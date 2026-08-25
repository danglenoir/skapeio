import { ReactNode } from 'react';

import { hero } from '@/app/i18n';
import Container from '@/components/Container';
import RotatingWords from '@/components/RotatingWords';
import SculptureCanvas from '@/components/SculptureCanvas';
import Section from '@/components/Section';

import styles from '@/components/Hero.module.css';

const Hero = (): ReactNode => (
  <Section
    id="home"
    className={styles.Hero}
    visual={<SculptureCanvas />}
  >
    <Container>
      <h1 className={styles.Hero__Title}>
        <span className={styles.Hero__Title__Accessible}>
          {hero.accessibleTitle}
        </span>
        <span aria-hidden="true">
          hello, we are skape.io and we do{' '}
          <RotatingWords things={hero.things} />
        </span>
      </h1>
    </Container>
  </Section>
);

export default Hero;
