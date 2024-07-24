import type { MessageProps } from '@/ui/messages';

import { getCountdown, useCountdown } from '@/providers';
import { CountdownBag } from '@/ui';
import { Nav } from '@/ui/messages/Nav';

const TTL = 60 * 60;
const next = 'bag';

export const Timer: MessageProps['Actions'] = ({
  previous,
  onNext,
  backdrop,
}) => {
  const { setup } = useCountdown();

  const activate = (target: string) => {
    if (target === next) setup(TTL);
    return onNext?.(target);
  };

  return (
    <>
      <div className="bg-base-100 my-4 p-4 pb-6 gap-2.5 rounded-box flex justify-center">
        <CountdownBag countdown={getCountdown(Date.now() + TTL * 1000)} />
      </div>
      <Nav
        previous={previous}
        next={next}
        onNext={activate}
        backdrop={backdrop}
      />
    </>
  );
};
