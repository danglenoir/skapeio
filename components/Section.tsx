import { ReactNode } from 'react';

import Background from '@/components/Background';
import Corners from '@/components/Corners';
import { cn } from '@/lib/utils';

import styles from '@/components/Section.module.css';

type SectionProps = {
  id?: string,
  labelledBy?: string,
  className?: string,
  contentClassName?: string,
  children: ReactNode,
  decorate?: boolean,
  visual?: ReactNode,
}
  
const Section = ({
  id,
  labelledBy,
  className,
  contentClassName,
  children,
  decorate,
  visual,
}: SectionProps) => (
  <section 
    id={id}
    aria-labelledby={labelledBy}
    className={cn(styles.Section, className)}
  >
    {decorate && 
      <>
        <Background />
        <Corners />
      </>
    }
    {visual &&
      <div
        aria-hidden="true"
        className={styles.Section__Visual}
      >
        {visual}
      </div>
    }
    <div className={cn(styles.Section__Content, contentClassName)}>
      {children}
    </div>
  </section>
);

export default Section;
