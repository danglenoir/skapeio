import { ReactNode } from 'react';

import Logo from '@/components/Logo';

import styles from '@/components/TopLink.module.css';

const TopLink = (): ReactNode => (
  <a
    href="#home"
    aria-label="Back to top"
    className={styles.TopLink}
  >
    <Logo onlyIcon />
  </a>
);

export default TopLink;
