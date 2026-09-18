import clubInterior from '../assets/images/club-interior.png';
import logo from '../assets/images/logo.png';
import { Button } from '../components/Button';
import '../styles/screens.css';

export function Splash({ onStart }: { onStart: () => void }) {
  return (
    <div className="splash">
      <img className="splash-bg" src={clubInterior} alt="PRIME CLUB" />
      <div className="splash-overlay" />
      <div className="splash-content anim-fade-in">
        <img className="splash-logo" src={logo} alt="PRIME CLUB" />
        <div>
          <div className="splash-title">СИЛЬНЫЕ ЛЮДИ ЗДЕСЬ</div>
          <div className="splash-subtitle">Тренировки. Комьюнити. Результат.</div>
        </div>
        <Button fullWidth className="splash-cta" onClick={onStart}>
          Начать
        </Button>
      </div>
    </div>
  );
}
