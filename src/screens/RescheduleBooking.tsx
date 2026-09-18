import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ScreenHeader } from '../components/Header';
import { DateSelector, buildDays } from '../components/DateSelector';
import { Button } from '../components/Button';
import { useAppState } from '../context/AppStateContext';
import '../styles/screens.css';

export function RescheduleBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings, slots, reschedule } = useAppState();
  const booking = bookings.find((b) => b.id === id);
  const days = useMemo(() => buildDays(14), []);
  const [date, setDate] = useState(booking?.date ?? days[0].iso);
  const [time, setTime] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const daySlots = useMemo(
    () => (booking ? slots.filter((s) => s.trainingId === booking.trainingId && s.date === date).sort((a, b) => a.time.localeCompare(b.time)) : []),
    [slots, booking, date]
  );

  if (!booking) return null;

  const handleSubmit = async () => {
    if (!time) return;
    setSubmitting(true);
    await reschedule(booking.id, date, time);
    setSubmitting(false);
    navigate('/my-trainings', { replace: true });
  };

  return (
    <div className="screen">
      <ScreenHeader title="Перенос тренировки" />
      <div className="scroll-content hide-scrollbar">
        <div className="datetime-wrap">
          <div>
            <div className="section-title" style={{ marginBottom: 12 }}>
              Новая дата
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
              Новое время
            </div>
            {daySlots.length === 0 ? (
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Нет доступных слотов на эту дату.</p>
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
        </div>
      </div>
      <div className="fixed-cta">
        <Button fullWidth disabled={!time || submitting} onClick={handleSubmit}>
          {submitting ? 'Переносим...' : 'Перенести тренировку'}
        </Button>
      </div>
    </div>
  );
}
