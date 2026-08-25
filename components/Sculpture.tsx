'use client';

import { ReactNode, Suspense, useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const MODEL_URL = '/models/discobolus-mesh.19f72baea8.glb';

type SculptureProps = {
  animate?: boolean;
  lowQuality?: boolean;
  onReady?: () => void;
};

type PreparedSculpture = {
  center: readonly [number, number, number];
  depthObject: THREE.Group;
  height: number;
  wireObject: THREE.Group;
};

const prepareSculpture = (
  source: THREE.Group,
  depthMaterial: THREE.MeshBasicMaterial,
  wireMaterial: THREE.MeshBasicMaterial,
): PreparedSculpture => {
  const depthObject = source.clone(true);
  const wireObject = source.clone(true);

  depthObject.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    child.material = depthMaterial;
    child.renderOrder = 1;
  });

  wireObject.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    child.material = wireMaterial;
    child.renderOrder = 2;
  });

  source.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(source);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());

  return {
    center: [-center.x, -center.y, -center.z],
    depthObject,
    height: size.z,
    wireObject,
  };
};

const DiscobolusMesh = ({
  animate = true,
  lowQuality = false,
  onReady,
}: SculptureProps): ReactNode => {
  const rotatingRef = useRef<THREE.Group>(null);
  const cageRef = useRef<THREE.Mesh>(null);
  const { scene } = useGLTF(MODEL_URL);
  const viewportWidth = useThree((state) => state.viewport.width);
  const isCompact = viewportWidth < 22;

  const depthMaterial = useMemo(() => {
    const material = new THREE.MeshBasicMaterial({
      color: '#000000',
      depthTest: true,
      depthWrite: true,
      side: THREE.DoubleSide,
    });
    material.colorWrite = false;
    return material;
  }, []);

  const wireMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#ffffff',
    depthTest: true,
    depthWrite: false,
    opacity: 0.15,
    side: THREE.FrontSide,
    toneMapped: false,
    transparent: true,
    wireframe: true,
  }), []);

  const sculpture = useMemo(
    () => prepareSculpture(scene, depthMaterial, wireMaterial),
    [depthMaterial, scene, wireMaterial],
  );

  const targetHeight = isCompact ? 60 : 78;
  const verticalOffset = isCompact ? -15.3 : -27;
  const rotationBase = isCompact ? -1.15 : -0.28;
  const scale = targetHeight / sculpture.height;
  const horizontalOffset = isCompact ? -5.4 : -3.2;

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useEffect(() => () => {
    depthMaterial.dispose();
    wireMaterial.dispose();
  }, [depthMaterial, wireMaterial]);

  useFrame(({ clock }, delta) => {
    if (!animate) return;

    if (rotatingRef.current) {
      rotatingRef.current.rotation.y = rotationBase
        + Math.sin(clock.elapsedTime * 0.16) * 0.1;
      rotatingRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.24) * 0.018;
      rotatingRef.current.position.y = verticalOffset
        + Math.sin(clock.elapsedTime * 0.31) * 0.055;
    }

    if (cageRef.current) {
      cageRef.current.rotation.x -= delta * 0.008;
      cageRef.current.rotation.y -= delta * 0.018;
    }
  });

  return (
    <group>
      <mesh
        ref={cageRef}
        position={[isCompact ? 0 : horizontalOffset, 0, 0]}
        renderOrder={0}
        scale={isCompact ? 0.82 : 1}
      >
        <icosahedronGeometry args={[13.7, lowQuality ? 1 : 2]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.018}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <group
        ref={rotatingRef}
        position={[horizontalOffset, verticalOffset, 0]}
        rotation={[0, rotationBase, 0]}
      >
        <group rotation={[-Math.PI / 2, 0, 0]} scale={scale}>
          <primitive
            object={sculpture.depthObject}
            position={sculpture.center}
            dispose={null}
          />
          <primitive
            object={sculpture.wireObject}
            position={sculpture.center}
            dispose={null}
          />
        </group>
      </group>
    </group>
  );
};

const Sculpture = (props: SculptureProps): ReactNode => (
  <Suspense fallback={null}>
    <DiscobolusMesh {...props} />
  </Suspense>
);

export default Sculpture;
