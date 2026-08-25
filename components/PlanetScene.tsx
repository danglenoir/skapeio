'use client';

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas, RootState } from '@react-three/fiber';

import Planet from '@/components/Planet';
import SceneFallback from '@/components/SceneFallback';

type PlanetSceneProps = {
  active: boolean;
  onError: () => void;
  onReady: () => void;
};

const PlanetScene = ({
  active,
  onError,
  onReady,
}: PlanetSceneProps): ReactNode => {
  const cleanupContextListener = useRef<(() => void) | null>(null);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => () => {
    cleanupContextListener.current?.();
    onError();
  }, [onError]);

  const handleCreated = useCallback(({ gl }: RootState) => {
    cleanupContextListener.current?.();

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setContextLost(true);
      onError();
    };

    gl.domElement.addEventListener('webglcontextlost', handleContextLost, { once: true });
    cleanupContextListener.current = () => {
      gl.domElement.removeEventListener('webglcontextlost', handleContextLost);
    };
  }, [onError]);

  if (contextLost) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 30], fov: 45 }}
      dpr={[1, 1.5]}
      fallback={<SceneFallback variant="planet" />}
      frameloop={active ? 'always' : 'demand'}
      onCreated={handleCreated}
    >
      <Planet
        animate={active}
        onReady={onReady}
      />
    </Canvas>
  );
};

export default PlanetScene;
