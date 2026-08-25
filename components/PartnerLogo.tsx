import { ReactNode } from 'react';

import { partners } from '@/app/i18n';

import styles from '@/components/PartnerLogo.module.css';

type PartnerProps = (typeof partners)[number];

const PartnerLogo = ({ 
  label,
  src,
}: PartnerProps): ReactNode => (
  <li
    className={styles.PartnerLogo}
  >
    {/* Content-hashed SVG wordmarks do not benefit from raster optimization. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      alt={label}
      decoding="async"
      fetchPriority="low"
      height={250}
      loading="lazy"
      src={src}
      width={250}
    />
  </li>
);

export default PartnerLogo;
