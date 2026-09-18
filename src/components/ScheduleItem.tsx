import { ChevronRight } from 'lucide-react';
import type { Trainer, Training, TrainingSlot } from '../types';
import { CATEGORY_LABELS, LEVEL_LABELS } from '../types';
import { TrainerAvatar } from './TrainerAvatar';
import { StatusBadge } from './Shared';
import './ScheduleItem.css';

interface ScheduleItemProps {
  training: Training;
  trainer: Trainer;
  slot: TrainingSlot;
  onClick: () => void;
}

export function ScheduleItem({ training, trainer, slot, onClick }: ScheduleItemProps) {
  return (
    <button className="schedule-item pressable" onClick={onClick}>
      <div className="schedule-item-time">{slot.time}</div>
      <div className="schedule-item-main">
        <div className="schedule-item-title">{training.title}</div>
        <div className="schedule-item-meta">
          {training.duration} мин · {LEVEL_LABELS[training.level]}
        </div>
        <StatusBadge taken={slot.spotsTaken} total={slot.spotsTotal} />
      </div>
      <TrainerAvatar name={trainer.name} color={trainer.avatarColor} size={36} />
      <ChevronRight size={18} className="schedule-item-arrow" />
    </button>
  );
}

export function categoryLabel(cat: Training['category']) {
  return CATEGORY_LABELS[cat];
}
