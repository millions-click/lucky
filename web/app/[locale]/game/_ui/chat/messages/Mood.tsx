import type { MessageProps } from '@/ui';

const moods = ['ready', 'eager', 'calm', 'lucky'];

export const Mood: MessageProps['Actions'] = ({ message, onNext }) => {
  return (
    message.options?.length && (
      <ul className="menu bg-base-200 my-4 p-4 gap-2.5 rounded-box lg:menu-lg">
        <li className="menu-title">{message.select}</li>
        {message.options.map((option, i) => (
          <li
            key={i}
            className="btn bg-orange-500 hover:btn-accent text-amber-100"
            onClick={() => onNext?.(moods[i])}
          >
            {option}
          </li>
        ))}
      </ul>
    )
  );
};
