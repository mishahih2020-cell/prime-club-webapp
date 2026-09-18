import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Shared.css';

export function IconButton({ children, className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button className={`icon-btn pressable ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function Card({ children, className = '', ...rest }: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function Divider() {
  return <div className="divider" />;
}

type SpotsState = 'free' | 'low' | 'full';

export function spotsState(taken: number, total: number): SpotsState {
  const left = total - taken;
  if (left <= 0) return 'full';
  if (left <= 2) return 'low';
  return 'free';
}

export function StatusBadge({ taken, total }: { taken: number; total: number }) {
  const state = spotsState(taken, total);
  const left = total - taken;
  const label = state === 'full' ? 'Мест нет' : `${left} ${left === 1 ? 'место' : left < 5 ? 'места' : 'мест'}`;
  return (
    <span className="status-badge">
      <span className={`status-dot ${state}`} />
      {label}
    </span>
  );
}

export function FilterChip({ active, children, ...rest }: { active?: boolean; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`filter-chip pressable ${active ? 'active' : ''}`} {...rest}>
      {children}
    </button>
  );
}

export function Tabs<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="tabs">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`tab-item pressable ${value === opt.value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="toast anim-slide-up" onClick={onClose}>
      {message}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="empty-state anim-fade-in">
      <div className="icon-wrap">{icon}</div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}

export function Skeleton({ width = '100%', height = 16, radius }: { width?: string | number; height?: number; radius?: number }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: radius }}
    />
  );
}
