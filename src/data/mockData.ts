import type { Booking, Profile, Trainer, Training, TrainingSlot, AppNotification } from '../types';

export const trainers: Trainer[] = [
  {
    id: 'tr-1',
    name: 'Алексей Смирнов',
    specialization: 'Бокс — тренер',
    categories: ['boxing'],
    description: 'Профессиональный боец, тренер с уклоном в постановку удара и защиты.',
    experience: 'Опыт 9 лет',
    avatarColor: '#7a1f2b',
  },
  {
    id: 'tr-2',
    name: 'Дмитрий Кузнецов',
    specialization: 'Кроссфит — тренер',
    categories: ['crossfit', 'functional'],
    description: 'Мастер спорта, тренирует выносливость и силу через функциональные комплексы.',
    experience: 'Опыт 7 лет',
    avatarColor: '#3f3a37',
  },
  {
    id: 'tr-3',
    name: 'Сергей Волков',
    specialization: 'MMA — тренер',
    categories: ['mma'],
    description: 'Тренер по смешанным единоборствам, готовит как новичков, так и спортсменов.',
    experience: 'Опыт 11 лет',
    avatarColor: '#2c2a29',
  },
  {
    id: 'tr-4',
    name: 'Иван Петров',
    specialization: 'Функциональный тренинг',
    categories: ['functional'],
    description: 'КМС по лёгкой атлетике, тренер по подготовке к соревнованиям.',
    experience: 'Опыт 5 лет',
    avatarColor: '#55201f',
  },
];

export const trainings: Training[] = [
  {
    id: 'tn-boxing',
    category: 'boxing',
    title: 'Бокс',
    duration: 60,
    level: 'medium',
    trainerId: 'tr-1',
    description:
      'Классическая тренировка по боксу, направленная на развитие техники, выносливости и силы. Подходит как для новичков, так и для продолжающих. Особое внимание — постановке удара и защите.',
    equipment: ['Перчатки', 'Бинты', 'Форма', 'Вода'],
  },
  {
    id: 'tn-crossfit',
    category: 'crossfit',
    title: 'Кроссфит',
    duration: 60,
    level: 'all',
    trainerId: 'tr-2',
    description:
      'Высокоинтенсивная функциональная тренировка на все группы мышц. Комбинация силовых и кардио упражнений для максимального результата.',
    equipment: ['Форма', 'Вода', 'Полотенце'],
  },
  {
    id: 'tn-mma',
    category: 'mma',
    title: 'MMA',
    duration: 60,
    level: 'advanced',
    trainerId: 'tr-3',
    description:
      'Смешанные единоборства: удары, борьба, партер. Тренировка для тех, кто хочет комплексно развивать боевые навыки.',
    equipment: ['Перчатки', 'Капа', 'Форма', 'Вода'],
  },
  {
    id: 'tn-functional',
    category: 'functional',
    title: 'Функциональная тренировка',
    duration: 60,
    level: 'all',
    trainerId: 'tr-4',
    description:
      'Комплексная тренировка на развитие силы, координации и выносливости с использованием собственного веса и дополнительного инвентаря.',
    equipment: ['Форма', 'Вода'],
  },
];

function todayISO(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const TIME_SLOTS = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];

function seededSpots(seed: number): number {
  const pattern = [1, 5, 3, 0, 4, 2, 6];
  return pattern[seed % pattern.length];
}

export function generateSlots(): TrainingSlot[] {
  const slots: TrainingSlot[] = [];
  let seed = 0;
  for (let day = 0; day < 14; day++) {
    const date = todayISO(day);
    trainings.forEach((training, tIdx) => {
      TIME_SLOTS.forEach((time, tsIdx) => {
        // не каждая тренировка в каждый слот — разрежаем расписание
        if ((tIdx + tsIdx + day) % 3 === 0) return;
        const total = 6;
        const taken = total - seededSpots(seed);
        slots.push({
          id: `slot-${training.id}-${date}-${time}`,
          trainingId: training.id,
          date,
          time,
          spotsTotal: total,
          spotsTaken: Math.min(taken, total),
        });
        seed++;
      });
    });
  }
  return slots;
}

export const initialBookings: Booking[] = [
  {
    id: 'bk-1',
    trainingId: 'tn-mma',
    trainerId: 'tr-3',
    date: todayISO(1),
    time: '12:00',
    status: 'upcoming',
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: 'bk-2',
    trainingId: 'tn-boxing',
    trainerId: 'tr-1',
    date: todayISO(-3),
    time: '18:00',
    status: 'completed',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: 'bk-3',
    trainingId: 'tn-crossfit',
    trainerId: 'tr-2',
    date: todayISO(-6),
    time: '10:00',
    status: 'cancelled',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
  },
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'nt-1',
    type: 'booking_confirmed',
    title: 'Запись подтверждена',
    description: 'MMA — завтра, 12:00',
    date: todayISO(0),
    unread: true,
  },
  {
    id: 'nt-2',
    type: 'reminder',
    title: 'Напоминание о тренировке',
    description: 'Сегодня, 18:00 — MMA',
    date: todayISO(0),
    unread: true,
  },
  {
    id: 'nt-3',
    type: 'reschedule',
    title: 'Перенос тренировки',
    description: 'Бокс · 20 сентября, 18:00',
    date: todayISO(-1),
    unread: false,
  },
  {
    id: 'nt-4',
    type: 'cancellation',
    title: 'Отмена записи',
    description: 'Кроссфит · 22 сентября, 10:00',
    date: todayISO(-2),
    unread: false,
  },
  {
    id: 'nt-5',
    type: 'news',
    title: 'Новость от клуба',
    description: 'Новый зал и обновлённая экипировка',
    date: todayISO(-4),
    unread: false,
  },
];

export const profile: Profile = {
  name: 'Алексей',
  phone: '+7 999 123-45-67',
  avatarColor: '#7a1f2b',
  visitsCount: 12,
};
