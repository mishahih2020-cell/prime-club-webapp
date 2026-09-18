import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AppNotification, Booking, Profile, Trainer, Training, TrainingSlot } from '../types';
import * as api from '../services/api';
import { hapticSuccess } from '../lib/telegram';

interface AppState {
  loading: boolean;
  error: string | null;
  trainings: Training[];
  trainers: Trainer[];
  slots: TrainingSlot[];
  bookings: Booking[];
  notifications: AppNotification[];
  profile: Profile | null;
  reload: () => void;
  book: (trainingId: string, trainerId: string, date: string, time: string) => Promise<Booking>;
  cancel: (bookingId: string) => Promise<void>;
  reschedule: (bookingId: string, date: string, time: string) => Promise<void>;
  markRead: (id: string) => void;
  refreshSlots: () => Promise<void>;
}

const AppStateCtx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trainingsData, setTrainingsData] = useState<Training[]>([]);
  const [trainersData, setTrainersData] = useState<Trainer[]>([]);
  const [slots, setSlots] = useState<TrainingSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [attempt, setAttempt] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [t, tr, sl, bk, nt, pr] = await Promise.all([
        api.fetchTrainings(),
        api.fetchTrainers(),
        api.fetchSlots(),
        api.fetchBookings(),
        api.fetchNotifications(),
        api.fetchProfile(),
      ]);
      setTrainingsData(t);
      setTrainersData(tr);
      setSlots(sl);
      setBookings(bk);
      setNotifications(nt);
      setProfileData(pr);
    } catch {
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  const refreshSlots = useCallback(async () => {
    const sl = await api.fetchSlots();
    setSlots(sl);
  }, []);

  const book = useCallback(
    async (trainingId: string, trainerId: string, date: string, time: string) => {
      const booking = await api.createBooking(trainingId, trainerId, date, time);
      const [bk, sl, nt] = await Promise.all([api.fetchBookings(), api.fetchSlots(), api.fetchNotifications()]);
      setBookings(bk);
      setSlots(sl);
      setNotifications(nt);
      hapticSuccess();
      return booking;
    },
    []
  );

  const cancel = useCallback(async (bookingId: string) => {
    await api.cancelBooking(bookingId);
    const bk = await api.fetchBookings();
    setBookings(bk);
  }, []);

  const reschedule = useCallback(async (bookingId: string, date: string, time: string) => {
    await api.rescheduleBooking(bookingId, date, time);
    const bk = await api.fetchBookings();
    setBookings(bk);
  }, []);

  const markRead = useCallback((id: string) => {
    api.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }, []);

  const value = useMemo<AppState>(
    () => ({
      loading,
      error,
      trainings: trainingsData,
      trainers: trainersData,
      slots,
      bookings,
      notifications,
      profile: profileData,
      reload,
      book,
      cancel,
      reschedule,
      markRead,
      refreshSlots,
    }),
    [loading, error, trainingsData, trainersData, slots, bookings, notifications, profileData, reload, book, cancel, reschedule, markRead, refreshSlots]
  );

  return <AppStateCtx.Provider value={value}>{children}</AppStateCtx.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateCtx);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
