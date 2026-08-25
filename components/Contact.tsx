import { ReactNode } from 'react';

import { contact } from '@/app/i18n';
import Container from '@/components/Container';
import Section from '@/components/Section';

import styles from '@/components/Contact.module.css';

const Contact = (): ReactNode => (
  <Section 
    id="contact" 
    decorate={true}
  >
    <Container gap={0}>
      <h2 className={styles.Contact__Headline}>{contact.headline}</h2>
      <a
        href="mailto:hello@skape.io"
        className={styles.Contact__Link}
      >
        hello@skape.io
        <span
          className={styles.Contact__Link__Line}
          aria-hidden="true"
        />
      </a>
    </Container>
  </Section>
);

export default Contact;
