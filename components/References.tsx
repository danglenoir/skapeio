import { ReactNode } from 'react';

import Container from '@/components/Container';
import PartnerLogoSet from '@/components/PartnerLogoSet';
import Section from '@/components/Section';

import styles from '@/components/References.module.css';

const References = (): ReactNode => (
  <Section 
    id="references"
    labelledBy="references-title"
  >
    <Container className={styles.References__Container}>
      <h2 id="references-title" className={styles.References__Title}>
        References
      </h2>
      <div className={styles.References__Gradients}>
        <div className={styles.References__Gradients__Left} />
        <div className={styles.References__Gradients__Right} />
      </div>
      <div className={styles.References__Wrapper}>
        <div className={styles.References__Wrapper__Marquee}>
          <PartnerLogoSet ariaLabel="Partner organizations" />
          <PartnerLogoSet ariaHidden className={styles.PartnerLogoSet} />
          <PartnerLogoSet ariaHidden className={styles.PartnerLogoSet} />
        </div>
      </div>
    </Container>
  </Section>
);

export default References;
