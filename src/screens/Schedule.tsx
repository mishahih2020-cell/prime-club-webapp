import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoHeader } from '../components/Header';
import { DateSelector, buildDays, formatMonthYear } from '../components/DateSelector';
import { FilterChip, EmptyState, Skeleton } from '../components/Shared';
import { ScheduleItem } from '../components/ScheduleItem';
import { Button } from '../components/Button';
import { useAppState } from '../context/AppStateContext';
import type { TrainingCategory } from '../types';
import { CalendarX } from 'lucide-react';
import '../styles/screens.css';

const CATEGORY_FILTERS: { value: TrainingCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'boxing', label: 'Бокс' },
  { value: 'mma', label: 'MMA' },
  { value: 'crossfit', label: 'Кроссфит' },
  { value: 'functional', label: 'Функционал' },
];

export function Schedule() {
  const navigate = useNavigate();
  const { loading, trainings, trainers, slots } = useAppState();
  const days = useMemo(() => buildDays(14), []);
  const [selectedDate, setSelectedDate] = useState(days[0].iso);
  const [category, setCategory] = useState<TrainingCategory | 'all'>('all');

  const daySlots = useMemo(() => {
    return slots
      .filter((s) => s.date === selectedDate)
      .filter((s) => {
        if (category === 'all') return true;
        const training = trainings.find((t) => t.id === s.trainingId);
        return training?.category === category;
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [slots, selectedDate, category, trainings]);

  return (
    <div className="schedule-wrap anim-fade-in">
      <LogoHeader />
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Расписание</h2>
        <div className="schedule-month">{formatMonthYear(selectedDate)}</div>
      </div>

      <DateSelector value={selectedDate} onChange={setSelectedDate} days={days} />

      <div className="filter-row hide-scrollbar">
        {CATEGORY_FILTERS.map((f) => (
          <FilterChip key={f.value} active={category === f.value} onClick={() => setCategory(f.value)}>
            {f.label}
          </FilterChip>
        ))}
      </div>

      {loading ? (
        <div className="slot-list">
          <Skeleton height={72} radius={16} />
          <Skeleton height={72} radius={16} />
          <Skeleton height={72} radius={16} />
        </div>
      ) : daySlots.length === 0 ? (
        <EmptyState
          icon={<CalendarX size={30} />}
          title="На этот день тренировок нет"
          description="Выберите другой день или измените фильтр"
          action={
            <Button variant="secondary" onClick={() => setCategory('all')}>
              Сбросить фильтры
            </Button>
          }
        />
      ) : (
        <div className="slot-list">
          {daySlots.map((slot) => {
            const training = trainings.find((t) => t.id === slot.trainingId)!;
            const trainer = trainers.find((t) => t.id === training.trainerId)!;
            return (
              <ScheduleItem
                key={slot.id}
                training={training}
                trainer={trainer}
                slot={slot}
                onClick={() => navigate(`/training/${training.id}?date=${slot.date}&time=${slot.time}`)}
              />
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 8 }}>
        <div className="section-title-row">
          <span className="section-title">Тренеры</span>
          <button className="section-link pressable" onClick={() => navigate('/trainers')}>
            Все
          </button>
        </div>
      </div>
    </div>
  );
}
