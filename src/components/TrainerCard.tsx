import { ChevronRight } from 'lucide-react';
import type { Trainer } from '../types';
import { TrainerAvatar } from './TrainerAvatar';
import './TrainerCard.css';

export function TrainerCard({ trainer, onClick }: { trainer: Trainer; onClick: () => void }) {
  return (
    <button className="trainer-card pressable" onClick={onClick}>
      <TrainerAvatar name={trainer.name} color={trainer.avatarColor} size={52} />
      <div className="trainer-card-main">
        <div className="trainer-card-name">{trainer.name}</div>
        <div className="trainer-card-spec">{trainer.specialization}</div>
      </div>
      <ChevronRight size={18} className="trainer-card-arrow" />
    </button>
  );
}
