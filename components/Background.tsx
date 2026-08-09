import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import styles from '@/components/Background.module.css';

type BackgroundProps = {
  className?: string;
}

const Background = ({
  className
}: BackgroundProps): ReactNode => (
  <div className={cn(styles.Background, className)}>
    <div className={styles.Color} />
    <div className={styles.Pattern} />
  </div>
);

export default Background;
