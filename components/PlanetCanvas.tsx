'use client';

import { ReactNode, useCallback, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import SceneErrorBoundary from '@/components/SceneErrorBoundary';
import SceneFallback from '@/components/SceneFallback';
import { useScenePolicy } from '@/components/useScenePolicy';

import styles from '@/components/SceneCanvas.module.css';

const PlanetScene = dynamic(() => import('@/components/PlanetScene'), {
  loading: () => null,
  ssr: false,
});

const PlanetCanvas = (): ReactNode => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const { isActive, shouldMount } = useScenePolicy(wrapperRef, {
    rootMargin: '400px',
  });
  const handleReady = useCallback(() => setSceneReady(true), []);
  const handleError = useCallback(() => setSceneReady(false), []);

  return (
    <div ref={wrapperRef} className={styles.SceneCanvas}>
      <SceneFallback
        hidden={shouldMount && sceneReady}
        variant="planet"
      />
      {shouldMount &&
        <SceneErrorBoundary onError={handleError}>
          <PlanetScene
            active={isActive}
            onError={handleError}
            onReady={handleReady}
          />
        </SceneErrorBoundary>
      }
    </div>
  );
};

export default PlanetCanvas;
