import { useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { HandMetal, Layers, Shirt, Droplets, CircleDot, Waves, Clock, BarChart3, Users, ChevronRight, type LucideIcon } from 'lucide-react';
import clubInterior from '../assets/images/club-interior.png';
import { OverlayHeader } from '../components/Header';
import { Card, Skeleton, StatusBadge, spotsState } from '../components/Shared';
import { TrainerAvatar } from '../components/TrainerAvatar';
import { Button } from '../components/Button';
import { useAppState } from '../context/AppStateContext';
import { CATEGORY_LABELS, LEVEL_LABELS } from '../types';
import { formatDateLong } from '../components/DateSelector';
import '../styles/screens.css';

const EQUIPMENT_ICON: Record<string, LucideIcon> = {
  'Перчатки': HandMetal,
  'Бинты': Layers,
  'Форма': Shirt,
  'Вода': Droplets,
  'Капа': CircleDot,
  'Полотенце': Waves,
};

export function TrainingDetail() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loading, trainings, trainers, slots } = useAppState();

  const training = trainings.find((t) => t.id === id);
  const trainer = training ? trainers.find((t) => t.id === training.trainerId) : null;

  const selectedDate = params.get('date') ?? new Date().toISOString().slice(0, 10);
  const selectedTime = params.get('time');

  const activeSlot = useMemo(() => {
    if (!training) return null;
    const bySameDate = slots.filter((s) => s.trainingId === training.id && s.date === selectedDate);
    if (selectedTime) {
      return bySameDate.find((s) => s.time === selectedTime) ?? bySameDate[0] ?? null;
    }
    return bySameDate.sort((a, b) => a.time.localeCompare(b.time))[0] ?? null;
  }, [training, slots, selectedDate, selectedTime]);

  if (loading || !training || !trainer) {
    return (
      <div className="screen">
        <Skeleton height={280} radius={0} />
        <div className="detail-body">
          <Skeleton height={28} width="60%" />
          <Skeleton height={80} />
        </div>
      </div>
    );
  }

  const full = activeSlot ? spotsState(activeSlot.spotsTaken, activeSlot.spotsTotal) === 'full' : false;

  const goToDatetime = () =>
    navigate(`/training/${training.id}/datetime?date=${activeSlot?.date ?? selectedDate}&time=${activeSlot?.time ?? ''}`);

  return (
    <div className="screen">
      <div className="scroll-content hide-scrollbar">
        <div className="detail-hero">
          <img src={clubInterior} alt={training.title} />
          <div className="detail-hero-overlay" />
          <OverlayHeader />
          <span className="detail-hero-tag">{CATEGORY_LABELS[training.category]}</span>
        </div>

        <div className="detail-body">
          <h1 className="detail-title">{training.title}</h1>

          <button className="detail-trainer-row pressable" onClick={() => navigate(`/trainers/${trainer.id}`)} style={{ background: 'none', width: '100%', textAlign: 'left' }}>
            <TrainerAvatar name={trainer.name} color={trainer.avatarColor} size={44} />
            <div style={{ flex: 1 }}>
              <div className="name">{trainer.name}</div>
              <div className="role">Тренер</div>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </button>

          <div className="detail-info-row">
            <Card className="detail-info-chip">
              <Clock size={18} color="var(--accent-hover)" />
              <span className="label">Длительность</span>
              <span className="value">{training.duration} мин</span>
            </Card>
            <Card className="detail-info-chip">
              <BarChart3 size={18} color="var(--accent-hover)" />
              <span className="label">Уровень</span>
              <span className="value">{LEVEL_LABELS[training.level]}</span>
            </Card>
            <Card className="detail-info-chip">
              <Users size={18} color="var(--accent-hover)" />
              <span className="label">Мест</span>
              <span className="value">
                {activeSlot ? `${Math.max(activeSlot.spotsTotal - activeSlot.spotsTaken, 0)} своб.` : '—'}
              </span>
            </Card>
          </div>

          <p className="detail-description">{training.description}</p>

          <div>
            <div className="section-title" style={{ marginBottom: 10 }}>
              Что взять с собой
            </div>
            <div className="equipment-grid">
              {training.equipment.map((item) => {
                const Icon = EQUIPMENT_ICON[item] ?? CircleDot;
                return (
                  <Card key={item} className="equipment-item">
                    <Icon size={20} />
                    {item}
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="datetime-preview pressable" onClick={goToDatetime} style={{ cursor: 'pointer' }}>
            <div>
              <div className="label">Выберите дату и время</div>
              <div className="value">
                {activeSlot ? `${formatDateLong(activeSlot.date)}, ${activeSlot.time}` : 'Нет доступных слотов'}
              </div>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </Card>

          {activeSlot && <StatusBadge taken={activeSlot.spotsTaken} total={activeSlot.spotsTotal} />}
        </div>
      </div>

      <div className="fixed-cta">
        <Button fullWidth disabled={!activeSlot || full} onClick={goToDatetime}>
          {full ? 'Мест нет' : 'Записаться'}
        </Button>
      </div>
    </div>
  );
}
