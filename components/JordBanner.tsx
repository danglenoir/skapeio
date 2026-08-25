import { ReactNode } from 'react';

import { jord } from '@/app/i18n';
import Button from '@/components/Button';
import Container from '@/components/Container';
import PlanetCanvas from '@/components/PlanetCanvas';
import Section from '@/components/Section';

import styles from '@/components/JordBanner.module.css';

const JordBanner = (): ReactNode => (
  <Section
    id="jord"
    decorate={true}
    visual={(
      <div className={styles.JordBanner__PlanetWrapper}>
        <PlanetCanvas />
      </div>
    )}
  >
    <Container gap={6}>
      <h2 className={styles.JordBanner__Title}>{jord.title}</h2>
      {jord.text.map((paragraph) => (
        <p key={paragraph} className={styles.JordBanner__Text}>{paragraph}</p>
      ))}
      <Button
        label={jord.cta.label}
        href={jord.cta.href ?? undefined}
        unavailableLabel={jord.cta.unavailableLabel}
      />
    </Container>
  </Section>
);

export default JordBanner;
