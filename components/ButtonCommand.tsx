import { ComponentProps, ReactNode } from 'react';

import styles from '@/components/Button.module.css';

type ButtonCommandProps = {
  label: string,
  commandFor: string,
  command: ComponentProps<'button'>['command'],
}

const ButtonCommand = ({
  label,
  commandFor,
  command
}: ButtonCommandProps): ReactNode => (
  <button
    type="button"
    commandfor={commandFor}
    command={command}
    className={styles.Button}
  >
    <span className={styles.Button__Label}>{label}</span>
    <span className={styles.Button__Background} aria-hidden="true">
      <span className={styles.Button__TopLeft} />
      <span className={styles.Button__TopRight} />
      <span className={styles.Button__BottomLeft} />
      <span className={styles.Button__BottomRight} />
    </span>
  </button>
);

export default ButtonCommand;
