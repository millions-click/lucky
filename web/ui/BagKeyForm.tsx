'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  IconDeviceFloppy,
  IconEye,
  IconEyeOff,
  IconKey,
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
  // { color: 'checked:bg-red-500', value: 180 },
] as Array<TTLOption>; // days
const defaultValue = 7;

type FormProps = {
  onConfirm: (password: string, ttl: number) => boolean | Promise<boolean>;
};

function PasswordInput({
  name,
  visible,
  setVisible,
}: {
  name: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  return (
    <label className="input input-bordered input-primary flex items-center gap-2">
      <IconKey />
      <input
        required
        name={name}
        type={visible ? 'text' : 'password'}
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
      <label className="card-body gap-2.5 items-center cursor-pointer">
        <span className="card-title capitalize label-text">{label}</span>
        <input
          type="radio"
          name="ttl"
          value={value}
          className={`radio ${color} group-hover:border-primary`}
          defaultChecked={checked}
        />
      </label>
    </div>
  );
}

export function BagKeyForm({ onConfirm }: FormProps) {
  const [visible, setVisible] = useState(false);
  const t = useTranslations('Components');

  const setPassword = async (formData: FormData) => {
    const password = formData.get('password') as string;
    const confirm = formData.get('confirm') as string;

    if (password !== confirm) {
      alert(t('Common.alert.password.mismatch'));
      return;
    }

    const ttl = Number(formData.get('ttl'));

    onConfirm(password, ttl);
  };

  const labels = t('BagKey.ttl.options').split(',');
  const options = TTLS.map((ttl, i) => ({
    ...ttl,
    label: labels[i] || `${ttl.value} days`,
    checked: ttl.value === defaultValue,
  }));

  return (
    <form action={setPassword}>
      <h1 className="text-center text-3xl">{t('BagKey.title')}</h1>
      <div className="divider" />

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">{t('Common.input.password')}</span>
        </div>
        <PasswordInput
          name="password"
          visible={visible}
          setVisible={setVisible}
        />
      </label>

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
