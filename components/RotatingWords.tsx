'use client';

import { ReactNode, useEffect, useState } from 'react';

import { usePrefersReducedMotion } from '@/components/useScenePolicy';

import styles from '@/components/Hero.module.css';

type RotatingWordsProps = {
  things: readonly string[];
};

const RotatingWords = ({ things }: RotatingWordsProps): ReactNode => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const displayedIndex = prefersReducedMotion ? 0 : index;
  const longestThing = things.reduce(
    (longest, thing) => thing.length > longest.length ? thing : longest,
    '',
  );

  useEffect(() => {
    if (prefersReducedMotion || things.length < 2) return;

    const interval = window.setInterval(() => {
      setIndex((previous) => (previous + 1) % things.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion, things.length]);

  if (things.length === 0) return null;

  return (
    <span className={styles.Hero__Title__Things}>
      <span
        key={displayedIndex}
        className={styles.Hero__Title__Things__Thing}
      >
        {things[displayedIndex]}
      </span>
      <span className={styles.Hero__Title__Things__Hidden}>
        {longestThing}
      </span>
    </span>
  );
};

export default RotatingWords;
