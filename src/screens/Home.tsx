import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { LogoHeader } from '../components/Header';
import { IconButton, Skeleton, StatusBadge } from '../components/Shared';
import { TrainingVisual } from '../components/TrainingVisual';
import { TrainerAvatar } from '../components/TrainerAvatar';
import { Button } from '../components/Button';
import { useAppState } from '../context/AppStateContext';
import { CATEGORY_LABELS } from '../types';
import { formatDateLong } from '../components/DateSelector';
import '../styles/screens.css';

export function Home() {
  const navigate = useNavigate();
  const { loading, error, trainings, trainers, slots, bookings, profile, reload } = useAppState();

  if (loading) {
    return (
      <div className="home-wrap anim-fade-in">
        <LogoHeader />
        <Skeleton height={220} radius={22} />
        <Skeleton height={90} radius={16} />
        <Skeleton height={110} radius={16} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-wrap">
        <LogoHeader />
        <div className="center-loading" style={{ flexDirection: 'column', gap: 12 }}>
          <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <Button onClick={reload}>Повторить</Button>
        </div>
      </div>
    );
  }

  const todayISO = new Date().toISOString().slice(0, 10);
  const upcoming = bookings
    .filter((b) => b.status === 'upcoming')
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0];
  const upcomingTraining = upcoming ? trainings.find((t) => t.id === upcoming.trainingId) : null;
  const upcomingTrainer = upcoming ? trainers.find((t) => t.id === upcoming.trainerId) : null;

  const todaySlots = slots
    .filter((s) => s.date === todayISO)
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 6);

  return (
    <div className="home-wrap anim-fade-in">
      <LogoHeader
        right={
          <IconButton onClick={() => navigate('/notifications')} aria-label="Меню">
            <Menu size={20} />
          </IconButton>
        }
      />

      <div className="home-greeting-row">
        <div className="home-greeting">
          <h1>Привет, {profile?.name ?? 'Гость'}</h1>
          <p>Время становиться сильнее</p>
        </div>
      </div>

      {upcoming && upcomingTraining && upcomingTrainer ? (
        <TrainingVisual category={upcomingTraining.category} minHeight={220} radius={22} className="hero-card">
          <div className="hero-label">Ближайшая тренировка</div>
          <div className="hero-title">{upcomingTraining.title}</div>
          <div className="hero-meta">
            {upcoming.date === todayISO ? 'Сегодня' : formatDateLong(upcoming.date)}, {upcoming.time} · {upcomingTrainer.name}
          </div>
          <Button fullWidth className="hero-cta" onClick={() => navigate(`/training/${upcomingTraining.id}`)}>
            Открыть тренировку
          </Button>
        </TrainingVisual>
      ) : (
        <TrainingVisual category="boxing" minHeight={220} radius={22} className="hero-card">
          <div className="hero-label">Начните сегодня</div>
          <div className="hero-title">Выберите тренировку</div>
          <div className="hero-meta">Бокс · MMA · Кроссфит · Функционал</div>
          <Button fullWidth className="hero-cta" onClick={() => navigate('/schedule')}>
            Записаться
          </Button>
        </TrainingVisual>
      )}

      <div>
        <div className="section-title-row">
          <span className="section-title">Расписание на сегодня</span>
          <button className="section-link pressable" onClick={() => navigate('/schedule')}>
            Все
          </button>
        </div>
        <div className="today-list hide-scrollbar" style={{ marginTop: 12 }}>
          {todaySlots.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>На сегодня тренировок не осталось.</p>
          )}
          {todaySlots.map((slot) => {
            const training = trainings.find((t) => t.id === slot.trainingId)!;
            const trainer = trainers.find((t) => t.id === training.trainerId)!;
            return (
              <button
                key={slot.id}
                className="card today-card pressable"
                onClick={() => navigate(`/training/${training.id}?date=${slot.date}&time=${slot.time}`)}
              >
                <span className="time">{slot.time}</span>
                <span className="type">{training.title}</span>
                <TrainerAvatar name={trainer.name} color={trainer.avatarColor} size={26} />
                <StatusBadge taken={slot.spotsTaken} total={slot.spotsTotal} />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="section-title-row">
          <span className="section-title">Популярные тренировки</span>
        </div>
        <div className="popular-grid" style={{ marginTop: 12 }}>
          {trainings.map((training) => (
            <button
              key={training.id}
              className="popular-card pressable"
              onClick={() => navigate(`/training/${training.id}`)}
            >
              <TrainingVisual category={training.category} height="100%" radius={16} className="popular-card-bg" />
              <span style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 1 }}>
                {CATEGORY_LABELS[training.category]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
