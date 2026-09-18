import { ArrowLeft, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { IconButton } from './Shared';
import './Header.css';

export function LogoHeader({ right }: { right?: React.ReactNode }) {
  return (
    <div className="header logo-header">
      <div className="header-logo">
        <img src={logo} alt="PRIME CLUB" />
        <span>PRIME CLUB</span>
      </div>
      {right}
    </div>
  );
}

export function ScreenHeader({ title, onShare }: { title: string; onShare?: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="header screen-header">
      <IconButton onClick={() => navigate(-1)} aria-label="Назад">
        <ArrowLeft size={20} />
      </IconButton>
      <span className="screen-header-title">{title}</span>
      {onShare ? (
        <IconButton onClick={onShare} aria-label="Поделиться">
          <Share2 size={18} />
        </IconButton>
      ) : (
        <div style={{ width: 40 }} />
      )}
    </div>
  );
}

export function OverlayHeader({ onShare }: { onShare?: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="header overlay-header">
      <IconButton onClick={() => navigate(-1)} aria-label="Назад">
        <ArrowLeft size={20} />
      </IconButton>
      {onShare && (
        <IconButton onClick={onShare} aria-label="Поделиться">
          <Share2 size={18} />
        </IconButton>
      )}
    </div>
  );
}
