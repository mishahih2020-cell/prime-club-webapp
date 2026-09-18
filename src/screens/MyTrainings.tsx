import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarX } from 'lucide-react';
import { LogoHeader } from '../components/Header';
import { Tabs, Card, EmptyState, Skeleton } from '../components/Shared';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { TrainerAvatar } from '../components/TrainerAvatar';
import { useAppState } from '../context/AppStateContext';
import type { Booking } from '../types';
import { formatDateLong } from '../components/DateSelector';
import '../styles/screens.css';

type TabValue = 'upcoming' | 'future' | 'history';

const STATUS_LABEL: Record<Booking['status'], string> = {
  upcoming: 'Запланирована',
  completed: 'Завершена',
  cancelled: 'Отменена',
  missed: 'Не состоялась',
};

export function MyTrainings() {
  const navigate = useNavigate();
  const { loading, trainings, trainers, bookings, cancel } = useAppState();
  const [tab, setTab] = useState<TabValue>('upcoming');
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const upcomingSorted = useMemo(
    () =>
      bookings
        .filter((b) => b.status === 'upcoming')
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    [bookings]
  );
  const nearest = upcomingSorted[0] ?? null;
  const future = upcomingSorted.slice(1);
  const history = bookings.filter((b) => b.status !== 'upcoming');

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    await cancel(cancelTarget.id);
    setCancelling(false);
    setCancelTarget(null);
  };

  const renderBooking = (booking: Booking, featured = false) => {
    const training = trainings.find((t) => t.id === booking.trainingId)!;
    const trainer = trainers.find((t) => t.id === booking.trainerId)!;
    return (
      <Card key={booking.id} className={`booking-card ${featured ? 'featured' : ''}`}>
        <div className="booking-card-top">
          <div>
            <div className="booking-card-date">{formatDateLong(booking.date)} · {booking.time}</div>
            <div className="booking-card-title">{training.title}</div>
          </div>
        </div>
        <div className="booking-card-meta">
          <TrainerAvatar name={trainer.name} color={trainer.avatarColor} size={26} />
          {trainer.name} · {training.duration} мин
        </div>
        {booking.status === 'upcoming' ? (
          <div className="booking-card-actions">
            <Button variant="secondary" onClick={() => navigate(`/training/${training.id}?date=${booking.date}&time=${booking.time}`)}>
              Открыть
            </Button>
            <Button variant="secondary" onClick={() => navigate(`/booking/${booking.id}/reschedule`)}>
              Перенести
            </Button>
            <Button variant="danger" onClick={() => setCancelTarget(booking)}>
              Отменить
            </Button>
          </div>
        ) : (
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{STATUS_LABEL[booking.status]}</span>
        )}
      </Card>
    );
  };

  return (
    <div className="my-trainings-wrap anim-fade-in">
      <LogoHeader />
      <h1 style={{ fontSize: 22, fontWeight: 800 }}>Мои тренировки</h1>

      <Tabs
        value={tab}
        onChange={setTab}
        options={[
          { value: 'upcoming', label: 'Ближайшая' },
          { value: 'future', label: 'Будущие' },
          { value: 'history', label: 'История' },
        ]}
      />

      {loading ? (
        <Skeleton height={140} radius={16} />
      ) : tab === 'upcoming' ? (
        nearest ? (
          renderBooking(nearest, true)
        ) : (
          <EmptyState
            icon={<CalendarX size={30} />}
            title="У вас пока нет тренировок"
            description="Запишитесь на первую тренировку в расписании"
            action={<Button onClick={() => navigate('/schedule')}>Перейти к расписанию</Button>}
          />
        )
      ) : tab === 'future' ? (
        future.length === 0 ? (
          <EmptyState icon={<CalendarX size={30} />} title="Будущих записей нет" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{future.map((b) => renderBooking(b))}</div>
        )
      ) : history.length === 0 ? (
        <EmptyState icon={<CalendarX size={30} />} title="История пуста" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{history.map((b) => renderBooking(b))}</div>
      )}

      <Modal open={!!cancelTarget} onClose={() => setCancelTarget(null)}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Отменить тренировку?</h3>
        {cancelTarget && (
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
            {trainings.find((t) => t.id === cancelTarget.trainingId)?.title} · {formatDateLong(cancelTarget.date)}, {cancelTarget.time}
          </p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button fullWidth variant="secondary" onClick={() => setCancelTarget(null)} disabled={cancelling}>
            Оставить запись
          </Button>
          <Button fullWidth variant="danger" onClick={handleCancel} disabled={cancelling}>
            {cancelling ? 'Отменяем...' : 'Отменить тренировку'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
