import styles from './styles.module.css';

export type Side = 'heads' | 'tails';
type Props = {
  side: Side;
};
export function Coin({ side }: Props) {
  return (
    <div className={`${styles.coin}`}>
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
