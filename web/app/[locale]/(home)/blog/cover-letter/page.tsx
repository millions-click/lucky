import type { Params } from '@/app/[locale]/locale.d';

const videoID = {
  es: process.env.NEXT_PUBLIC_COVER_LETTER_ES_VIDEO_ID,
  en: process.env.NEXT_PUBLIC_COVER_LETTER_EN_VIDEO_ID,
};
type VideoLocale = keyof typeof videoID;

export default function CoverLetterPage({ params: { locale } }: Params) {
  return (
    <div className="w-[90vw] h-[70dvh]">
      <iframe
        className="h-full w-full"
        src={`https://www.loom.com/embed/${
          videoID[(locale as VideoLocale) || 'en']
        }`}
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
}
