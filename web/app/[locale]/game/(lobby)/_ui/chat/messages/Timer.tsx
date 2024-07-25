import type { MessageProps } from '@/ui/messages';

import { useLuckyPass } from '@/providers';
import { CountdownBag } from '@/ui';
import { Nav } from '@/ui/messages/Nav';

const next = 'bag';

export const Timer: MessageProps['Actions'] = ({
  previous,
  onNext,
  backdrop,
}) => {
  const { countdown } = useLuckyPass();

  return (
    <>
      <div className="bg-base-100 my-4 p-4 pb-6 gap-2.5 rounded-box flex justify-center">
        <CountdownBag {...countdown} />
      </div>
      <Nav
        previous={previous}
        next={next}
        onNext={onNext}
        backdrop={backdrop}
      />
    </>
  );
};
