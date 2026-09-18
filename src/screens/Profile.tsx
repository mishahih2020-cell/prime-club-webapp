import { useNavigate } from 'react-router-dom';
import { Dumbbell, History, Bell, Settings as SettingsIcon, HelpCircle, ChevronRight } from 'lucide-react';
import { LogoHeader } from '../components/Header';
import { TrainerAvatar } from '../components/TrainerAvatar';
import { useAppState } from '../context/AppStateContext';
import '../styles/screens.css';

const MENU = [
  { icon: Dumbbell, label: 'Мои тренировки', to: '/my-trainings' },
  { icon: History, label: 'История посещений', to: '/my-trainings' },
  { icon: Bell, label: 'Уведомления', to: '/notifications' },
  { icon: SettingsIcon, label: 'Настройки', to: '/settings' },
  { icon: HelpCircle, label: 'Помощь и поддержка', to: '/settings' },
];

export function Profile() {
  const navigate = useNavigate();
  const { profile } = useAppState();

  return (
    <div className="profile-wrap anim-fade-in">
      <LogoHeader />

      <div className="profile-header">
        <TrainerAvatar name={profile?.name ?? 'Гость'} color={profile?.avatarColor ?? '#7a1f2b'} size={64} />
        <div>
          <div className="profile-name">{profile?.name}</div>
          <div className="profile-phone">{profile?.phone}</div>
        </div>
      </div>

      <div className="profile-menu">
        {MENU.map((item, idx) => (
          <div key={item.label}>
            <button className="profile-menu-item pressable" onClick={() => navigate(item.to)}>
              <item.icon size={20} color="var(--accent-hover)" />
              <span className="grow">{item.label}</span>
              <ChevronRight size={18} />
            </button>
            {idx < MENU.length - 1 && <div className="divider" />}
          </div>
        ))}
      </div>
    </div>
  );
}
