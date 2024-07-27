'use client';

import { useDraggable } from '@dnd-kit/core';
import styles from './styles.module.css';

export type Side = 'heads' | 'tails';
type Props = {
  side: Side;
  playing: boolean;
};
export function Coin({ side, playing }: Props) {
  const { isDragging, over } = useDraggable({
    id: 'pointer',
  });

  return (
    <div
      className={`${styles.coin}`}
      data-spin={isDragging}
      data-lyingDown={Boolean(over)}
      data-playing={playing}
    >
      <div className={`${styles.front} ${styles.jump}`}>
        <span className={styles.currency}>{side === 'heads' ? 'H' : 'T'}</span>
        <div className={styles.shapes}>
          <div className={styles.shape_l}></div>
          <div className={styles.shape_r}></div>
          <span className={styles.top}>Lucky</span>
          <span className={styles.bottom}>Land</span>
        </div>
      </div>
      <div className={styles.shadow}></div>
    </div>
  );
}
