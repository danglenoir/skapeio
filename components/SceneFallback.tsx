import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import styles from '@/components/SceneFallback.module.css';

type SceneFallbackProps = {
  hidden?: boolean;
  variant: 'planet' | 'sculpture';
};

const SceneFallback = ({ hidden, variant }: SceneFallbackProps): ReactNode => (
  <div
    data-scene-fallback={variant}
    data-scene-state={hidden ? 'ready' : 'fallback'}
    className={cn(
      styles.SceneFallback,
      styles[variant === 'planet' ? 'SceneFallback__Planet' : 'SceneFallback__Sculpture'],
      hidden && styles.SceneFallback__Hidden,
    )}
  >
    <svg
      className={styles.SceneFallback__Shape}
      viewBox="0 0 200 200"
      focusable="false"
      role="presentation"
    >
      <circle cx="100" cy="100" r="72" />
      <ellipse cx="100" cy="100" rx="72" ry="25" />
      <ellipse cx="100" cy="100" rx="25" ry="72" />
      <path d="M34 72c39 16 93 16 132 0M34 128c39-16 93-16 132 0" />
    </svg>
  </div>
);

export default SceneFallback;
