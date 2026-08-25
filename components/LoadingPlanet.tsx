'use client';

import { ReactNode } from 'react';
import * as THREE from 'three';

const EARTH_RADIUS = 11.65;
const AXIAL_TILT = THREE.MathUtils.degToRad(-23.4);

const LoadingPlanet = (): ReactNode => (
  <group rotation={[0, 0, AXIAL_TILT]}>
    <mesh>
      <sphereGeometry args={[EARTH_RADIUS, 64, 44]} />
      <meshBasicMaterial color="#030506" />
    </mesh>
    <mesh scale={1.006}>
      <sphereGeometry args={[EARTH_RADIUS, 64, 44]} />
      <meshBasicMaterial
        color="#dce4e8"
        wireframe
        transparent
        opacity={0.09}
        depthWrite={false}
      />
    </mesh>
  </group>
);

export default LoadingPlanet;
