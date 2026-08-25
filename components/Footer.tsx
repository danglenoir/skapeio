import { ReactNode } from 'react';

import { footer } from '@/app/i18n';
import Container from '@/components/Container';
import Logo from '@/components/Logo';

import styles from '@/components/Footer.module.css';

const currentYear = new Date().getFullYear();

const Footer = (): ReactNode => (
  <footer className={styles.Footer}>
    <Container isFooter={true}>
      <div className={styles.Footer__Inner}>
        <Logo className={styles.Footer__Logo} />
        <div className={styles.Footer__Items}>
          <span className={styles.Footer__Copy}>&copy; {currentYear} skape.io</span>
          <nav aria-label="Legal" className={styles.Footer__Links}>
            {footer.items.map(({ dialogId, label }) => (
              <button
                key={dialogId}
                type="button"
                commandfor={dialogId}
                command="show-modal"
                aria-controls={dialogId}
                aria-haspopup="dialog"
                className={styles.Footer__Button}
              >{label}</button>
            ))}
          </nav>
        </div>
      </div>
    </Container>
  </footer>
);

export default Footer;
