'use client';

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas, RootState } from '@react-three/fiber';

import SceneFallback from '@/components/SceneFallback';
import Sculpture from '@/components/Sculpture';

type SculptureSceneProps = {
  active: boolean;
  lowQuality: boolean;
  onError: () => void;
  onReady: () => void;
};

const SculptureScene = ({
  active,
  lowQuality,
  onError,
  onReady,
}: SculptureSceneProps): ReactNode => {
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
      camera={{ position: [0, 0, 40], fov: 45 }}
      dpr={lowQuality ? 1 : [1, 1.5]}
      fallback={<SceneFallback variant="sculpture" />}
      frameloop={active ? 'always' : 'demand'}
      gl={{
        alpha: true,
        antialias: !lowQuality,
        powerPreference: lowQuality ? 'low-power' : 'high-performance',
      }}
      onCreated={handleCreated}
    >
      <Sculpture
        animate={active}
        lowQuality={lowQuality}
        onReady={onReady}
      />
    </Canvas>
  );
};

export default SculptureScene;
