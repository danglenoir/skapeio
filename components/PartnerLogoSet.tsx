import { ReactNode } from 'react';

import { partners } from '@/app/i18n';
import PartnerLogo from '@/components/PartnerLogo';
import { cn } from '@/lib/utils';

import styles from '@/components/PartnerLogoSet.module.css'

type PartnerLogoSetProps = {
  ariaLabel?: string;
  ariaHidden?: boolean;
  className?: string;
}

const PartnerLogoSet = ({ 
  ariaLabel,
  ariaHidden = false,
  className
}: PartnerLogoSetProps): ReactNode => (
  <ul
    aria-label={ariaLabel}
    aria-hidden={ariaHidden || undefined}
    className={cn(styles.PartnerLogoSet, className)}
  >
    {partners.map((partner) => (
      <PartnerLogo 
        key={partner.src}
        {...partner} 
      />
    ))}
  </ul>
);

export default PartnerLogoSet;
