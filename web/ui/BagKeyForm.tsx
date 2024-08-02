'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  IconDeviceFloppy,
  IconEye,
  IconEyeOff,
  IconKey,
  IconMoneybag,
  IconPencil,
} from '@tabler/icons-react';

type TTLOption = {
  color: string;
  value: number;
  label: string;
  checked: boolean;
};
const TTLS = [
  { color: 'checked:bg-blue-500', value: 1 },
  { color: 'checked:bg-green-500', value: 7 },
  { color: 'checked:bg-yellow-500', value: 30 },
  { color: 'checked:bg-orange-500', value: 90 },
] as Array<TTLOption>; // days
const defaultValue = 7;

type FormProps = {
  name?: string;
  onConfirm: (
    password: string,
    ttl: number,
    name: string
  ) => boolean | Promise<boolean>;
  unlock?: boolean;
};

function BagName({
  current,
  label,
  readOnly,
}: {
  current?: string;
  label: string;
  readOnly?: boolean;
}) {
  const [name, setName] = useState(current);
  const [editable, setEditable] = useState(false);

  return editable ? (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text">{label}</span>
      </div>
      <label className="input input-bordered input-primary flex items-center gap-2">
        <IconMoneybag />
        <input
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="grow"
          placeholder="Bag Name"
        />
      </label>
    </label>
  ) : (
    <div className="bg-primary w-fit self-center rounded-box px-4 text-xl py-2 flex gap-2.5 items-center text-white">
      {current}
      {!readOnly && (
        <span
          className="btn btn-circle btn-sm btn-ghost"
          onClick={() => setEditable(true)}
        >
          <IconPencil />
        </span>
      )}
    </div>
  );
}

function PasswordInput({
  name,
  visible,
  setVisible,
  focused,
}: {
  name: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  focused?: boolean;
}) {
  return (
    <label className="input input-bordered input-primary flex items-center gap-2">
      <IconKey />
      <input
        required
        name={name}
        autoFocus={focused}
        type={visible ? 'text' : 'password'}
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        className="grow"
        placeholder="••••••••"
      />
      <label
        className={`swap ${visible ? 'swap-active' : ''}`}
        onClick={() => setVisible(!visible)}
      >
        <IconEye className="swap-on" />
        <IconEyeOff className="swap-off" />
      </label>
    </label>
  );
}

function TTLOption({ color, value, label, checked }: TTLOption) {
  return (
    <div className="form-control card card-compact col-span-4 sm:col-span-2 group bg-base-300 hover:bg-base-100">
      <label className="card-body gap-2.5 items-center cursor-pointer max-sm:flex-row justify-between">
        <span className="card-title capitalize label-text">{label}</span>
        <input
          type="radio"
          name="ttl"
          value={value * 24 * 60 * 60 * 1000}
          className={`radio ${color} group-hover:border-primary`}
          defaultChecked={checked}
        />
      </label>
    </div>
  );
}

export function BagKeyForm({ name, unlock, onConfirm }: FormProps) {
  const [visible, setVisible] = useState(false);
  const t = useTranslations('Components');

  const setPassword = async (formData: FormData) => {
    const password = formData.get('password') as string;
    const confirm = formData.get('confirm') as string;
    const name = formData.get('name') as string;

    if (!unlock && password !== confirm) {
      alert(t('Common.alert.password.mismatch'));
      return;
    }

    const ttl = Number(formData.get('ttl'));

    onConfirm(password, ttl, name);
  };

  const labels = t('BagKey.ttl.options').split(',');
  const options = TTLS.map((ttl, i) => ({
    ...ttl,
    label: labels[i] || `${ttl.value} days`,
    checked: ttl.value === defaultValue,
  }));

  return (
    <form className="flex flex-col justify-center" action={setPassword}>
      <h1 className="text-center text-3xl">{t('BagKey.title')}</h1>
      <div className="divider" />

      <BagName
        current={name}
        label={t('BagKey.input.name.label')}
        readOnly={unlock}
      />

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">{t('Common.input.password')}</span>
        </div>
        <PasswordInput
          name="password"
          visible={visible}
          setVisible={setVisible}
          focused
        />
      </label>

      {!unlock && (
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">{t('Common.input.confirm')}</span>
          </div>
          <PasswordInput
            name="confirm"
            visible={visible}
            setVisible={setVisible}
          />
        </label>
      )}

      <div className="divider" />
      <span>{t('BagKey.ttl.title')}</span>
      <div className="grid grid-cols-8 justify-around gap-4 mt-4 w-full">
        {options.map((option, i) => (
          <TTLOption key={i} {...option} />
        ))}
      </div>

      <div className="modal-action">
        <button className="btn btn-primary btn-block">
          <IconDeviceFloppy />
          {t('Common.action.save')}
        </button>
      </div>
    </form>
  );
}
