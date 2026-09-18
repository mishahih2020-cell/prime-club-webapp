import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ScreenHeader } from '../components/Header';
import { TrainerAvatar } from '../components/TrainerAvatar';
import { DateSelector, buildDays } from '../components/DateSelector';
import { ScheduleItem } from '../components/ScheduleItem';
import { useAppState } from '../context/AppStateContext';
import { CATEGORY_LABELS } from '../types';
import '../styles/screens.css';

export function TrainerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trainers, trainings, slots } = useAppState();
  const trainer = trainers.find((t) => t.id === id);
  const days = useMemo(() => buildDays(14), []);
  const [date, setDate] = useState(days[0].iso);

  if (!trainer) return null;

  const trainerTrainingIds = trainings.filter((t) => t.trainerId === trainer.id).map((t) => t.id);
  const daySlots = slots
    .filter((s) => trainerTrainingIds.includes(s.trainingId) && s.date === date)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="screen">
      <ScreenHeader title="Тренер" />
      <div className="scroll-content hide-scrollbar">
        <div className="trainer-detail-header">
          <TrainerAvatar name={trainer.name} color={trainer.avatarColor} size={88} />
          <div className="trainer-detail-name">{trainer.name}</div>
          <div className="trainer-detail-spec">{trainer.specialization}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{trainer.experience}</div>
        </div>
        <p className="trainer-detail-desc">{trainer.description}</p>

        <div style={{ padding: '0 16px', display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
          {trainer.categories.map((c) => (
            <span key={c} className="filter-chip" style={{ pointerEvents: 'none' }}>
              {CATEGORY_LABELS[c]}
            </span>
          ))}
        </div>

        <div style={{ padding: '20px 16px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="section-title">Расписание тренера</div>
          <DateSelector value={date} onChange={setDate} days={days} />
          <div className="slot-list">
            {daySlots.length === 0 ? (
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>На эту дату тренировок нет.</p>
            ) : (
              daySlots.map((slot) => {
                const training = trainings.find((t) => t.id === slot.trainingId)!;
                return (
                  <ScheduleItem
                    key={slot.id}
                    training={training}
                    trainer={trainer}
                    slot={slot}
                    onClick={() => navigate(`/training/${training.id}?date=${slot.date}&time=${slot.time}`)}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
