import {
  trainers,
  trainings,
  generateSlots,
  initialBookings,
  initialNotifications,
  profile,
} from '../data/mockData';
import type { Booking, TrainingSlot, AppNotification } from '../types';

/**
 * Слой имитирует backend API поверх in-memory данных.
 * Все функции возвращают Promise — при подключении реального backend
 * достаточно заменить реализацию внутри, не трогая экраны.
 */

let slots: TrainingSlot[] = generateSlots();
let bookings: Booking[] = [...initialBookings];
let notifications: AppNotification[] = [...initialNotifications];

const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms));

export async function fetchTrainings() {
  await delay(200);
  return trainings;
}

export async function fetchTrainers() {
  await delay(200);
  return trainers;
}

export async function fetchSlots() {
  await delay(200);
  return slots;
}

export async function fetchBookings() {
  await delay(150);
  return bookings;
}

export async function fetchNotifications() {
  await delay(150);
  return notifications;
}

export async function fetchProfile() {
  await delay(100);
  return profile;
}

export async function createBooking(trainingId: string, trainerId: string, date: string, time: string) {
  await delay(400);
  const slot = slots.find((s) => s.trainingId === trainingId && s.date === date && s.time === time);
  if (slot && slot.spotsTaken < slot.spotsTotal) {
    slot.spotsTaken += 1;
  }
  const booking: Booking = {
    id: `bk-${Date.now()}`,
    trainingId,
    trainerId,
    date,
    time,
    status: 'upcoming',
    createdAt: Date.now(),
  };
  bookings = [booking, ...bookings];
  notifications = [
    {
      id: `nt-${Date.now()}`,
      type: 'booking_confirmed',
      title: 'Запись подтверждена',
      description: `${date} · ${time}`,
      date: new Date().toISOString().slice(0, 10),
      unread: true,
    },
    ...notifications,
  ];
  return booking;
}

export async function cancelBooking(bookingId: string) {
  await delay(350);
  bookings = bookings.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b));
  return bookings.find((b) => b.id === bookingId)!;
}

export async function rescheduleBooking(bookingId: string, date: string, time: string) {
  await delay(350);
  bookings = bookings.map((b) => (b.id === bookingId ? { ...b, date, time } : b));
  return bookings.find((b) => b.id === bookingId)!;
}

export async function markNotificationRead(id: string) {
  notifications = notifications.map((n) => (n.id === id ? { ...n, unread: false } : n));
  return notifications;
}

export function getSlotFor(trainingId: string, date: string, time: string) {
  return slots.find((s) => s.trainingId === trainingId && s.date === date && s.time === time);
}

export function getSlotsForTrainingOnDate(trainingId: string, date: string) {
  return slots.filter((s) => s.trainingId === trainingId && s.date === date);
}
