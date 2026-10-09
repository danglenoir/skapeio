import { ReactNode } from 'react';

import ContactTesseract from '@/components/ContactTesseract';
import Container from '@/components/Container';
import Section from '@/components/Section';

import styles from '@/components/Contact.module.css';

const Contact = (): ReactNode => (
  <Section
    id="contact"
    labelledBy="contact-email"
    decorate={true}
  >
    <Container gap={0} className={styles.Contact__Container}>
      <ContactTesseract>
        <a
          id="contact-email"
          href="mailto:hello@skape.io"
          className={styles.Contact__Link}
        >
          hello@skape.io
          <span
            className={styles.Contact__Link__Line}
            aria-hidden="true"
          />
        </a>
      </ContactTesseract>
    </Container>
  </Section>
);

export default Contact;
