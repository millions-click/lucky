import { Keypair } from '@solana/web3.js';
import { useTranslations } from 'next-intl';
import { IconDownload, IconKey } from '@tabler/icons-react';

export function Download({
  keypair,
  onChange,
}: {
  keypair: Keypair;
  onChange: (confirmed: boolean) => void;
}) {
  const t = useTranslations('Components.Generate.download');
  const downloadKeypair = (formData: FormData) => {
    // Serialize the Keypair's secret key
    const serializedKey = JSON.stringify(Array.from(keypair.secretKey));
    const passKey = formData.get('key') as string;
    if (passKey) {
      // TODO: Encrypt the serialized key with the provided password
    }

    // Create a Blob from the serialized key
    const blob = new Blob([serializedKey], { type: 'application/json' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create an anchor element and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lucky-bag.json';
    document.body.appendChild(a);
    a.click();

    // Cleanup: remove the anchor and revoke the blob URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onChange(true);
  };

  return (
    <>
      <h1 className="text-center mb-4">{t('title')}</h1>
      <form className="flex flex-col gap-4" action={downloadKeypair}>
        <label className="form-control w-full max-w-xs self-center">
          <div className="label">
            <span className="label-text">{t('encrypt')}</span>
          </div>
          <label className="input input-bordered flex items-center gap-2">
            <IconKey />
            <input name="key" type="password" className="grow" />
          </label>
          <div className="label">
            <span className="label-text-alt">{t('recommend')}</span>
          </div>
        </label>

        <button className="btn btn-accent btn-lg">
          <IconDownload />
          <span className="">{t('button')}</span>
        </button>
      </form>
    </>
  );
}
