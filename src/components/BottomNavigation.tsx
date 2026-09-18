import { Home, CalendarDays, Dumbbell, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './BottomNavigation.css';

const ITEMS = [
  { to: '/', label: 'Главная', icon: Home },
  { to: '/schedule', label: 'Расписание', icon: CalendarDays },
  { to: '/my-trainings', label: 'Мои тренировки', icon: Dumbbell },
  { to: '/profile', label: 'Профиль', icon: User },
];

export function BottomNavigation() {
  return (
    <nav className="bottom-nav">
      {ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end={to === '/'}>
          <Icon size={22} strokeWidth={2} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
