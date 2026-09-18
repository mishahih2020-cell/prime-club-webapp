interface TrainerAvatarProps {
  name: string;
  color: string;
  size?: number;
}

export function TrainerAvatar({ name, color, size = 40 }: TrainerAvatarProps) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f5efe6',
        fontWeight: 700,
        fontSize: size * 0.38,
        flexShrink: 0,
        border: '1px solid rgba(255,255,255,0.12)',
      }}
    >
      {initials}
    </div>
  );
}
