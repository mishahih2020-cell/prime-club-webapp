import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { ScreenHeader } from '../components/Header';
import { Card } from '../components/Shared';
import '../styles/screens.css';

function Switch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button className={`switch pressable ${on ? 'on' : ''}`} onClick={onToggle} aria-label="Переключить">
      <div className="switch-knob" />
    </button>
  );
}

export function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);

  return (
    <div className="settings-wrap anim-fade-in">
      <ScreenHeader title="Настройки" />

      <Card style={{ overflow: 'hidden' }}>
        <div className="settings-row">
          <span className="label">Уведомления</span>
          <Switch on={notifications} onToggle={() => setNotifications((v) => !v)} />
        </div>
        <div className="divider" />
        <div className="settings-row">
          <span className="label">Напоминания о тренировках</span>
          <Switch on={reminders} onToggle={() => setReminders((v) => !v)} />
        </div>
      </Card>

      <Card style={{ overflow: 'hidden' }}>
        <button className="settings-row pressable" style={{ width: '100%' }}>
          <span className="label">Язык</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14 }}>
            Русский <ChevronRight size={16} />
          </span>
        </button>
        <div className="divider" />
        <button className="settings-row pressable" style={{ width: '100%' }}>
          <span className="label">Помощь и поддержка</span>
          <ChevronRight size={16} color="var(--text-muted)" />
        </button>
      </Card>
    </div>
  );
}
