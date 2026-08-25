import { ReactNode } from 'react';
import Link from 'next/link';

import styles from '@/components/Button.module.css';

type ButtonProps = {
  label: string,
  href?: string,
  unavailableLabel?: string,
}

const ButtonContent = ({ label }: Pick<ButtonProps, 'label'>): ReactNode => (
  <>
    <span className={styles.Button__Label}>{label}</span>
    <span className={styles.Button__Background} aria-hidden="true">
      <span className={styles.Button__TopLeft} />
      <span className={styles.Button__TopRight} />
      <span className={styles.Button__BottomLeft} />
      <span className={styles.Button__BottomRight} />
    </span>
  </>
);

const Button = ({
  label,
  href,
  unavailableLabel = 'This destination is not available yet.',
}: ButtonProps): ReactNode => {
  if (!href) {
    return (
      <button
        type="button"
        className={styles.Button}
        disabled={true}
        aria-label={`${label}. ${unavailableLabel}`}
        title={unavailableLabel}
      >
        <ButtonContent label={label} />
      </button>
    );
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.Button}
    >
      <ButtonContent label={label} />
    </Link>
  );
};

export default Button;
