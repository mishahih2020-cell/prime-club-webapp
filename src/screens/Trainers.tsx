import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenHeader } from '../components/Header';
import { FilterChip, Skeleton } from '../components/Shared';
import { TrainerCard } from '../components/TrainerCard';
import { useAppState } from '../context/AppStateContext';
import type { TrainingCategory } from '../types';
import '../styles/screens.css';

const FILTERS: { value: TrainingCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'boxing', label: 'Бокс' },
  { value: 'mma', label: 'MMA' },
  { value: 'crossfit', label: 'Кроссфит' },
  { value: 'functional', label: 'Функционал' },
];

export function Trainers() {
  const navigate = useNavigate();
  const { loading, trainers } = useAppState();
  const [filter, setFilter] = useState<TrainingCategory | 'all'>('all');

  const filtered = useMemo(
    () => trainers.filter((t) => filter === 'all' || t.categories.includes(filter)),
    [trainers, filter]
  );

  return (
    <div className="trainers-wrap anim-fade-in">
      <ScreenHeader title="Тренеры" />

      <div className="filter-row hide-scrollbar">
        {FILTERS.map((f) => (
          <FilterChip key={f.value} active={filter === f.value} onClick={() => setFilter(f.value)}>
            {f.label}
          </FilterChip>
        ))}
      </div>

      {loading ? (
        <div className="trainer-list">
          <Skeleton height={80} radius={16} />
          <Skeleton height={80} radius={16} />
        </div>
      ) : (
        <div className="trainer-list">
          {filtered.map((trainer) => (
            <TrainerCard key={trainer.id} trainer={trainer} onClick={() => navigate(`/trainers/${trainer.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
