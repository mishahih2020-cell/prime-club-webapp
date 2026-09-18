import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ScreenHeader } from '../components/Header';
import { Card } from '../components/Shared';
import { Button } from '../components/Button';
import { TrainerAvatar } from '../components/TrainerAvatar';
import { useAppState } from '../context/AppStateContext';
import { LEVEL_LABELS } from '../types';
import { formatDateLong } from '../components/DateSelector';
import '../styles/screens.css';

export function BookingConfirm() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { trainings, trainers, book } = useAppState();
  const [submitting, setSubmitting] = useState(false);

  const training = trainings.find((t) => t.id === id);
  const trainer = training ? trainers.find((t) => t.id === training.trainerId) : null;
  const date = params.get('date') ?? '';
  const time = params.get('time') ?? '';

  if (!training || !trainer) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    await book(training.id, trainer.id, date, time);
    navigate(`/booking-success?trainingId=${training.id}&date=${date}&time=${time}`, { replace: true });
  };

  return (
    <div className="screen">
      <ScreenHeader title="Подтверждение записи" />
      <div className="scroll-content hide-scrollbar">
        <div className="confirm-wrap">
          <Card className="confirm-summary-card">
            <div className="confirm-row">
              <span className="k">Тренировка</span>
              <span className="v">{training.title}</span>
            </div>
            <div className="confirm-row">
              <span className="k">Дата</span>
              <span className="v">{formatDateLong(date)}</span>
            </div>
            <div className="confirm-row">
              <span className="k">Время</span>
              <span className="v">{time}</span>
            </div>
            <div className="confirm-row">
              <span className="k">Длительность</span>
              <span className="v">{training.duration} мин</span>
            </div>
            <div className="confirm-row">
              <span className="k">Уровень</span>
              <span className="v">{LEVEL_LABELS[training.level]}</span>
            </div>
            <div className="confirm-row">
              <span className="k">Тренер</span>
              <span className="v" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrainerAvatar name={trainer.name} color={trainer.avatarColor} size={26} />
                {trainer.name}
              </span>
            </div>
          </Card>
        </div>
      </div>
      <div className="fixed-cta" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button fullWidth onClick={handleConfirm} disabled={submitting}>
          {submitting ? 'Подтверждаем...' : 'Подтвердить запись'}
        </Button>
        <Button fullWidth variant="ghost" onClick={() => navigate(-1)} disabled={submitting}>
          Изменить
        </Button>
      </div>
    </div>
  );
}
