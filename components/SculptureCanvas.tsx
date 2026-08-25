'use client';

import { ReactNode, useCallback, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import SceneErrorBoundary from '@/components/SceneErrorBoundary';
import SceneFallback from '@/components/SceneFallback';
import { useScenePolicy } from '@/components/useScenePolicy';

import styles from '@/components/SceneCanvas.module.css';

const SculptureScene = dynamic(() => import('@/components/SculptureScene'), {
  loading: () => null,
  ssr: false,
});

const SculptureCanvas = (): ReactNode => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const { isActive, lowQuality, shouldMount } = useScenePolicy(wrapperRef, {
    rootMargin: '200px',
  });
  const handleReady = useCallback(() => setSceneReady(true), []);
  const handleError = useCallback(() => setSceneReady(false), []);

  return (
    <div ref={wrapperRef} className={styles.SceneCanvas}>
      <SceneFallback
        hidden={shouldMount && sceneReady}
        variant="sculpture"
      />
      {shouldMount &&
        <SceneErrorBoundary onError={handleError}>
          <SculptureScene
            active={isActive}
            lowQuality={lowQuality}
            onError={handleError}
            onReady={handleReady}
          />
        </SceneErrorBoundary>
      }
    </div>
  );
};

export default SculptureCanvas;
