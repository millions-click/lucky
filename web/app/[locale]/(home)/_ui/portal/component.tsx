'use client';

import styles from './styles.module.css';
import { useEffect, useState } from 'react';

export type PortalType = 'entrance' | 'lucky' | 'unlucky';

type PortalProps = {
  active?: boolean;
  type?: PortalType;
  onActive?: (activated: boolean) => void;
  onWarping?: () => void;
};

const PORTAL_ACTIVATION_TIME = 3000;

export function Portal({
  active,
  type = 'entrance',
  onWarping,
  onActive,
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
    setWarping(true);
    onWarping && onWarping();
  };

  return (
    <button
      className={`${styles.portal}`}
      disabled={!active}
      onMouseUp={warp}
      onTouchEnd={warp}
      data-portal={type}
      data-warping={warping}
      data-activated={activated}
    />
  );
}
