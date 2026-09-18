interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  enableClosingConfirmation?: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
  HapticFeedback?: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
  };
  initDataUnsafe?: {
    user?: { first_name?: string; last_name?: string; username?: string };
  };
  viewportHeight?: number;
  colorScheme?: 'light' | 'dark';
}

function getTelegram(): TelegramWebApp | null {
  const w = window as unknown as { Telegram?: { WebApp?: TelegramWebApp } };
  return w.Telegram?.WebApp ?? null;
}

export function initTelegram() {
  const tg = getTelegram();
  if (!tg) return;
  try {
    tg.ready();
    tg.expand();
    tg.setHeaderColor?.('#0a0a0b');
    tg.setBackgroundColor?.('#0a0a0b');
  } catch {
    // окружение вне Telegram — игнорируем
  }
}

export function getTelegramUserName(): string | null {
  const tg = getTelegram();
  const user = tg?.initDataUnsafe?.user;
  if (!user) return null;
  return user.first_name ?? user.username ?? null;
}

export function setBackButton(onBack: (() => void) | null) {
  const tg = getTelegram();
  if (!tg) return;
  if (onBack) {
    tg.BackButton.show();
    tg.BackButton.onClick(onBack);
  } else {
    tg.BackButton.hide();
  }
}

export function hapticImpact(style: 'light' | 'medium' | 'heavy' = 'light') {
  getTelegram()?.HapticFeedback?.impactOccurred(style);
}

export function hapticSuccess() {
  getTelegram()?.HapticFeedback?.notificationOccurred('success');
}

export function closeWebApp() {
  getTelegram()?.close();
}

export function isInTelegram(): boolean {
  return !!getTelegram();
}
