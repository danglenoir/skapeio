import Dialog from '@/components/Dialog';

import styles from '@/components/LegalContent.module.css';

const ImprintDialog = () => (
  <Dialog 
    id="imprint"
    title="Imprint"
  >
    <h3 className={styles.LegalContent__Heading}>Company data &amp; web hosting</h3>
    <dl className={styles.LegalContent__DefinitionList}>
      <dt className={styles.LegalContent__Term}>Name</dt>
      <dd className={styles.LegalContent__Definition}>skape.io Kft.</dd>
      <dt className={styles.LegalContent__Term}>Address</dt>
      <dd className={styles.LegalContent__Definition}>1092 Budapest, Erkel u. 13/A</dd>
      <dt className={styles.LegalContent__Term}>Email address</dt>
      <dd className={styles.LegalContent__Definition}>
        <a className={styles.LegalContent__Link} href="mailto:hello@skape.io">
          hello@skape.io
        </a>
      </dd>
    </dl>
  </Dialog>
);

export default ImprintDialog;
