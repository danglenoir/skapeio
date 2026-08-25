import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import styles from '@/components/Container.module.css';

type ContainerProps = {
  children: ReactNode,
  isFooter?: boolean,
  gap?: number,
  className?: string,
};

const Container = ({
  children,
  isFooter = false,
  gap = 8,
  className
}: ContainerProps): ReactNode => (
  <div 
    className={cn(isFooter ? styles.ContainerFooter : styles.Container, className)}
    style={{ '--gap': gap } as React.CSSProperties}
  >
    {children}
  </div>
);

export default Container;