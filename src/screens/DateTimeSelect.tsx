import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ScreenHeader } from '../components/Header';
import { DateSelector, buildDays } from '../components/DateSelector';
import { Button } from '../components/Button';
import { useAppState } from '../context/AppStateContext';
import '../styles/screens.css';

export function DateTimeSelect() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { trainings, slots } = useAppState();

  const training = trainings.find((t) => t.id === id);
  const days = useMemo(() => buildDays(14), []);
  const [date, setDate] = useState(params.get('date') ?? days[0].iso);
  const [time, setTime] = useState<string | null>(params.get('time'));

  const daySlots = useMemo(
    () => slots.filter((s) => s.trainingId === id && s.date === date).sort((a, b) => a.time.localeCompare(b.time)),
    [slots, id, date]
  );

  if (!training) return null;

  const activeSlot = daySlots.find((s) => s.time === time);
  const spotsLeft = activeSlot ? activeSlot.spotsTotal - activeSlot.spotsTaken : null;

  const handleNext = () => {
    if (!time) return;
    navigate(`/training/${training.id}/confirm?date=${date}&time=${time}`);
  };

  return (
    <div className="screen">
      <ScreenHeader title="Выбор даты и времени" />
      <div className="scroll-content hide-scrollbar">
        <div className="datetime-wrap">
          <div>
            <div className="section-title" style={{ marginBottom: 12 }}>
              {training.title}
            </div>
            <DateSelector
              value={date}
              onChange={(d) => {
                setDate(d);
                setTime(null);
              }}
              days={days}
            />
          </div>

          <div>
            <div className="section-title" style={{ marginBottom: 12 }}>
              Время
            </div>
            {daySlots.length === 0 ? (
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>На эту дату тренировок нет.</p>
            ) : (
              <div className="time-grid">
                {daySlots.map((slot) => {
                  const full = slot.spotsTaken >= slot.spotsTotal;
                  return (
                    <button
                      key={slot.id}
                      className={`time-slot pressable ${time === slot.time ? 'active' : ''}`}
                      disabled={full}
                      onClick={() => setTime(slot.time)}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {activeSlot && (
            <p className="spots-hint">
              {spotsLeft && spotsLeft > 0 ? `${spotsLeft} ${spotsLeft === 1 ? 'место' : 'места'} свободно` : 'Мест нет'}
            </p>
          )}
        </div>
      </div>
      <div className="fixed-cta">
        <Button fullWidth disabled={!time || !activeSlot || activeSlot.spotsTaken >= activeSlot.spotsTotal} onClick={handleNext}>
          Далее
        </Button>
      </div>
    </div>
  );
}
