import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '../components/Button';
import { TrainerAvatar } from '../components/TrainerAvatar';
import { Toast } from '../components/Shared';
import { useAppState } from '../context/AppStateContext';
import { formatDateLong } from '../components/DateSelector';
import '../styles/screens.css';

export function BookingSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { trainings, trainers } = useAppState();
  const [toast, setToast] = useState(false);

  const trainingId = params.get('trainingId');
  const date = params.get('date') ?? '';
  const time = params.get('time') ?? '';
  const training = trainings.find((t) => t.id === trainingId);
  const trainer = training ? trainers.find((t) => t.id === training.trainerId) : null;

  return (
    <div className="screen">
      <div className="success-wrap">
        <div className="success-icon">
          <Check size={40} strokeWidth={3} />
        </div>
        <div>
          <div className="success-title">Запись подтверждена!</div>
          <div className="success-summary" style={{ marginTop: 8 }}>
            {training?.title} · {formatDateLong(date)}, {time}
          </div>
        </div>
        {trainer && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrainerAvatar name={trainer.name} color={trainer.avatarColor} size={36} />
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{trainer.name}</span>
          </div>
        )}
        <div className="success-actions">
          <Button fullWidth onClick={() => setToast(true)}>
            Добавить в календарь
          </Button>
          <Button fullWidth variant="secondary" onClick={() => navigate('/my-trainings', { replace: true })}>
            Мои тренировки
          </Button>
        </div>
      </div>
      {toast && <Toast message="Добавлено в календарь" onClose={() => setToast(false)} />}
    </div>
  );
}
