import { ReactNode } from 'react';

import type { NavEntry } from '@/app/i18n';

import styles from '@/components/NavItem.module.css';

type NavItemProps = {
  item: NavEntry,
};

const NavItem = ({ item }: NavItemProps): ReactNode => (
  <a
    href={`#${item.id}`}
    className={styles.NavItem}
    data-nav-item
  >
    <span className={styles.NavItem__Label}>
      {item.label}
    </span>
    <span
      className={styles.NavItem__Indicator}
      aria-hidden="true"
    />
  </a>
);

export default NavItem;
