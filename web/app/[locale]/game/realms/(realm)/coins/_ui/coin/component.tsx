'use client';

import styles from './styles.module.css';

export type Side = 'heads' | 'tails';
type Props = {
  side: Side;
  slot: number;
  playing: boolean;
  slots?: number;
  isDragging?: boolean;
  isOver?: boolean;
};
export function Coin({
  side,
  slot,
  playing,
  slots,
  isDragging,
  isOver,
}: Props) {
  return (
    <div
      className={`${styles.coin}`}
      data-slot={slot}
      data-slots={slots}
      data-spin={isDragging}
      data-lyingdown={isOver}
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
