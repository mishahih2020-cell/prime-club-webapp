import clubInterior from '../assets/images/club-interior.png';
import type { TrainingCategory } from '../types';

const CATEGORY_TINT: Record<TrainingCategory, string> = {
  boxing: 'rgba(122, 31, 43, 0.55)',
  mma: 'rgba(20, 20, 22, 0.6)',
  crossfit: 'rgba(90, 60, 20, 0.45)',
  functional: 'rgba(40, 40, 44, 0.55)',
};

const CATEGORY_POSITION: Record<TrainingCategory, string> = {
  boxing: 'center 20%',
  mma: 'center 45%',
  crossfit: 'center 65%',
  functional: 'center 80%',
};

interface TrainingVisualProps {
  category: TrainingCategory;
  /** Жёсткая высота — контент, выходящий за неё, будет обрезан. Для плиток с коротким текстом. */
  height?: number | string;
  /** Минимальная высота — карточка растягивается под контент, ничего не обрезается. */
  minHeight?: number | string;
  radius?: number;
  children?: React.ReactNode;
  className?: string;
}

export function TrainingVisual({ category, height, minHeight, radius = 16, children, className = '' }: TrainingVisualProps) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        height: height ?? (minHeight ? 'auto' : 120),
        minHeight,
        borderRadius: radius,
        overflow: 'hidden',
        flexShrink: 0,
        background: '#161616',
      }}
    >
      <img
        src={clubInterior}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: CATEGORY_POSITION[category],
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${CATEGORY_TINT[category]}, rgba(10,10,11,0.75))`,
        }}
      />
      {children}
    </div>
  );
}
