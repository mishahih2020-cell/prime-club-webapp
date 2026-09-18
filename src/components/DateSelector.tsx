import './Shared.css';

const DOW = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function buildDays(count = 14): { iso: string; dow: string; dom: number }[] {
  const days = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const jsDow = d.getDay(); // 0 = Sunday
    const dowIndex = jsDow === 0 ? 6 : jsDow - 1;
    days.push({ iso: d.toISOString().slice(0, 10), dow: DOW[dowIndex], dom: d.getDate() });
  }
  return days;
}

export function DateSelector({ value, onChange, days }: { value: string; onChange: (iso: string) => void; days?: { iso: string; dow: string; dom: number }[] }) {
  const list = days ?? buildDays();
  return (
    <div className="date-selector hide-scrollbar">
      {list.map((d) => (
        <button
          key={d.iso}
          className={`date-chip pressable ${d.iso === value ? 'active' : ''}`}
          onClick={() => onChange(d.iso)}
        >
          <span className="dow">{d.dow}</span>
          <span className="dom">{d.dom}</span>
        </button>
      ))}
    </div>
  );
}

export function formatDateLong(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

export function formatMonthYear(iso: string): string {
  const d = new Date(iso);
  const str = d.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  return str.charAt(0).toUpperCase() + str.slice(1);
}
