import { ReactNode } from 'react';

import ButtonCommand from '@/components/ButtonCommand';
import Section from '@/components/Section';

import styles from '@/components/Dialog.module.css';

type DialogProps = {
  id: string,
  title: string,
  children: ReactNode,
}

const Dialog = ({
  id,
  title,
  children
}: DialogProps): ReactNode => (
  <dialog 
    id={id}
    aria-labelledby={`${id}-title`}
    className={styles.Dialog}
  >
    <Section
      decorate={true}
      contentClassName={styles.Dialog__Section}
    >
      <header className={styles.Dialog__Header}>
        <h2
          id={`${id}-title`}
          className={styles.Dialog__Title}
        >
          {title}
        </h2>
        <ButtonCommand 
          commandFor={id} 
          command="close" 
          label="Close" 
        />
      </header>
      <div className={styles.Dialog__Content}>
        {children}
      </div>
    </Section>
  </dialog>
);

export default Dialog;
