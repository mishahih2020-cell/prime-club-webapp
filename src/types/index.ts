export type TrainingCategory = 'boxing' | 'mma' | 'crossfit' | 'functional';

export type TrainingLevel = 'beginner' | 'all' | 'medium' | 'advanced';

export interface Trainer {
  id: string;
  name: string;
  specialization: string;
  categories: TrainingCategory[];
  description: string;
  experience: string;
  avatarColor: string;
}

export interface TrainingSlot {
  id: string;
  trainingId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  spotsTotal: number;
  spotsTaken: number;
}

export interface Training {
  id: string;
  category: TrainingCategory;
  title: string;
  duration: number; // минут
  level: TrainingLevel;
  trainerId: string;
  description: string;
  equipment: string[];
}

export type BookingStatus = 'upcoming' | 'completed' | 'cancelled' | 'missed';

export interface Booking {
  id: string;
  trainingId: string;
  trainerId: string;
  date: string;
  time: string;
  status: BookingStatus;
  createdAt: number;
}

export type NotificationType = 'booking_confirmed' | 'reminder' | 'reschedule' | 'cancellation' | 'news';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  date: string;
  unread: boolean;
}

export interface Profile {
  name: string;
  phone: string;
  avatarColor: string;
  visitsCount: number;
}

export const CATEGORY_LABELS: Record<TrainingCategory, string> = {
  boxing: 'Бокс',
  mma: 'MMA',
  crossfit: 'Кроссфит',
  functional: 'Функционал',
};

export const LEVEL_LABELS: Record<TrainingLevel, string> = {
  beginner: 'Начальный',
  all: 'Все уровни',
  medium: 'Средний',
  advanced: 'Продвинутый',
};
