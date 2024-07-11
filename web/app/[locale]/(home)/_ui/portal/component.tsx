'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import styles from './styles.module.css';

export type PortalType = 'entrance' | 'lucky' | 'unlucky';

type PortalProps = {
  active?: boolean;
  type?: PortalType;
  href?: string;
  onActive?: (activated: boolean) => void;
  onWarping?: () => void;
  onWarped?: () => void;
};

const PORTAL_ACTIVATION_TIME = 3000;
const PORTAL_WARPING_TIME = 4000;

export function Portal({
  active,
  type = 'entrance',
  href,
  onActive,
  onWarping,
  onWarped,
}: PortalProps) {
  const [activated, setActivated] = useState<boolean>(false);
  const [warping, setWarping] = useState<boolean>(false);

  useEffect(() => {
    if (!active) return setActivated(false);

    const timeout = setTimeout(() => {
      onActive && onActive(true);
      setActivated(true);
    }, PORTAL_ACTIVATION_TIME);

    return () => clearTimeout(timeout);
  }, [active]);

  const warp = () => {
    if (!activated || warping) return;

    setWarping(true);
    onWarping && onWarping();

    setTimeout(
      () =>
        setTimeout(() => {
          onWarped && onWarped();
          const link = document.getElementById('target');
          link && link.click();
        }, PORTAL_WARPING_TIME / 2),
      PORTAL_WARPING_TIME
    );
  };

  return (
    <>
      <button
        className={styles.portal}
        disabled={!active}
        onMouseUp={warp}
        onTouchEnd={warp}
        data-portal={type}
        data-activated={activated}
        data-warping={warping}
      />
      {href && activated && <Link id="target" href={href} prefetch hidden />}
      {warping && <div id="screen" className={styles.warp} />}
    </>
  );
}
