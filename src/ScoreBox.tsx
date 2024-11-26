import styles from './ScoreBox.module.css';

function ScoreBox(props: { title: string; score: number }) {
  const { title, score } = props;

  return (
    <div className={styles.scoreBox}>
      <div className={styles.title}>{title}</div>
      <div className={styles.score}>{score}</div>
    </div>
  );
}

export default ScoreBox;
