import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellOff, CalendarCheck, Bell, Repeat, Ban, Megaphone, type LucideIcon } from 'lucide-react';
import { ScreenHeader } from '../components/Header';
import { FilterChip, EmptyState, Card } from '../components/Shared';
import { useAppState } from '../context/AppStateContext';
import type { NotificationType } from '../types';
import '../styles/screens.css';

const ICON: Record<NotificationType, LucideIcon> = {
  booking_confirmed: CalendarCheck,
  reminder: Bell,
  reschedule: Repeat,
  cancellation: Ban,
  news: Megaphone,
};

type FilterValue = 'all' | 'bookings' | 'reminders' | 'news';

function matchesFilter(type: NotificationType, filter: FilterValue): boolean {
  if (filter === 'all') return true;
  if (filter === 'bookings') return type === 'booking_confirmed' || type === 'reschedule' || type === 'cancellation';
  if (filter === 'reminders') return type === 'reminder';
  return type === 'news';
}

export function Notifications() {
  const navigate = useNavigate();
  const { notifications, markRead } = useAppState();
  const [filter, setFilter] = useState<FilterValue>('all');

  const filtered = useMemo(() => notifications.filter((n) => matchesFilter(n.type, filter)), [notifications, filter]);

  return (
    <div className="notifications-wrap anim-fade-in">
      <ScreenHeader title="Уведомления" />

      <div className="filter-row hide-scrollbar">
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>Все</FilterChip>
        <FilterChip active={filter === 'bookings'} onClick={() => setFilter('bookings')}>Записи</FilterChip>
        <FilterChip active={filter === 'reminders'} onClick={() => setFilter('reminders')}>Напоминания</FilterChip>
        <FilterChip active={filter === 'news'} onClick={() => setFilter('news')}>Новости</FilterChip>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<BellOff size={30} />} title="Пока нет уведомлений" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((n) => {
            const Icon = ICON[n.type];
            return (
              <Card
                key={n.id}
                className="notification-item pressable"
                onClick={() => {
                  markRead(n.id);
                  if (n.type !== 'news') navigate('/my-trainings');
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="notification-icon">
                  <Icon size={18} />
                </div>
                <div className="notification-main">
                  <div className="notification-title-row">
                    <span className="notification-title">{n.title}</span>
                    {n.unread && <span className="unread-dot" />}
                  </div>
                  <span className="notification-desc">{n.description}</span>
                  <span className="notification-date">{n.date}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
