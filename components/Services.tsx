import { ReactNode } from 'react';

import { services } from '@/app/i18n';
import Container from '@/components/Container';
import Corners from '@/components/Corners';
import Heading from '@/components/Heading';
import Section from '@/components/Section';
import ServiceCard from '@/components/ServiceCard';

import styles from '@/components/Services.module.css';

const { title, items } = services;

const Services = (): ReactNode => (
  <Section id="capabilities">
    <Container>
      <Heading
        index="02"
        title={title}
      />
      <div className={styles.GridWrapper}>
        <div className={styles.Grid}>
          {items.map(({ id, title, description }, index) => (
            <ServiceCard
              key={id}
              index={String(index + 1).padStart(2, '0')}
              title={title}
              description={description}
            />
          ))}
        </div>
        <Corners />
      </div>
    </Container>
  </Section>
);

export default Services;
