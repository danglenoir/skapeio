'use client';

import { ReactNode, Suspense } from 'react';

import LoadingPlanet from '@/components/LoadingPlanet';
import MeshEarth from '@/components/MeshEarth';

type PlanetProps = {
  animate?: boolean;
  onReady?: () => void;
};

const Planet = ({
  animate = true,
  onReady,
}: PlanetProps): ReactNode => (
  <group>
    <ambientLight 
      intensity={0.3} 
      color="#9eb2bd" 
    />
    <directionalLight 
      position={[10, 8, 14]} 
      intensity={2.15} 
      color="#f7fbff" 
    />
    <directionalLight 
      position={[-9, -5, -8]} 
      intensity={0.24} 
      color="#668397" 
    />
    <Suspense fallback={<LoadingPlanet />}>
      <MeshEarth
        animate={animate}
        onReady={onReady}
      />
    </Suspense>
  </group>
);

export default Planet;
