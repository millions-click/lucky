'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IconSend } from '@tabler/icons-react';

import { useAssistant } from '@/providers';

export function UserQuestion() {
  const t = useTranslations('Components.Common');
  const { ask, loading } = useAssistant();
  const [text, setText] = useState('');

  return (
    <form
      className="form-control space-y-1"
      action={async (formData) => {
        const text = formData.get('q') as string;
        if (!text) return;

        await ask(text);
        setText('');
      }}
    >
      <textarea
        name="q"
        className="textarea textarea-info w-full"
        disabled={loading}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('input.question')}
      />
      <button
        type="submit"
        className="btn btn-primary btn-sm"
        disabled={loading}
      >
        {t('action.ask')}
        <IconSend />
      </button>
    </form>
  );
}
