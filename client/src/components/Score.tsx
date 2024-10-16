import { scoreType } from '../../../shared/types/UserObject';
import '../styles/User.css';

const Score: React.FC<{ scores: scoreType[] }> = ({ scores }) => {
  return (
    <>
      {scores.map((score, scoreIndex) => (
        <p key={scoreIndex}>
          {score.title} <br /> {score.pp}pp - {Math.round(score.accuracy * 100 * 100) / 100}%
        </p>
      ))}
    </>
  );
};

export default Score;
