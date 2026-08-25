'use client';

import { ReactNode, useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const EARTH_RADIUS = 11.65;
const AXIAL_TILT = THREE.MathUtils.degToRad(-23.4);
const LAND_MASK_URL = '/textures/earth/roughness-2048.7cc8aefdf3.jpg';

type MeshEarthProps = {
  animate?: boolean;
  onReady?: () => void;
};

const MASK_VERTEX_SHADER = /* glsl */ `
  uniform sampler2D landMap;
  uniform float displacement;

  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;

    float land = smoothstep(0.34, 0.66, texture2D(landMap, uv).r);
    vec3 displacedPosition = position + normal * land * displacement;
    vec4 worldPosition = modelMatrix * vec4(displacedPosition, 1.0);

    vWorldPosition = worldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const LAND_FILL_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D landMap;

  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    float land = smoothstep(0.38, 0.64, texture2D(landMap, vUv).r);
    if (land < 0.01) discard;

    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float facing = abs(dot(normalize(vWorldNormal), viewDirection));
    float alpha = land * mix(0.035, 0.11, facing);

    gl_FragColor = vec4(vec3(0.76, 0.82, 0.86), alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const COAST_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D landMap;

  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    float mask = texture2D(landMap, vUv).r;
    float width = max(fwidth(mask) * 0.7, 0.006);
    float coast = 1.0 - smoothstep(width, width * 1.8, abs(mask - 0.5));
    if (coast < 0.015) discard;

    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float facing = abs(dot(normalize(vWorldNormal), viewDirection));
    float alpha = coast * (0.32 + facing * 0.3);

    gl_FragColor = vec4(vec3(0.7, 0.74, 0.76), alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const ATMOSPHERE_VERTEX_SHADER = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const ATMOSPHERE_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float rim = pow(1.0 - abs(dot(normalize(vWorldNormal), viewDirection)), 3.2);
    gl_FragColor = vec4(vec3(0.63, 0.78, 0.88), rim * 0.23);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const MeshEarth = ({
  animate = true,
  onReady,
}: MeshEarthProps): ReactNode => {
  const spinRef = useRef<THREE.Group>(null);
  const gl = useThree((state) => state.gl);
  const loadedLandMap = useLoader(THREE.TextureLoader, LAND_MASK_URL);

  const landMap = useMemo(() => {
    const texture = loadedLandMap.clone();
    texture.colorSpace = THREE.NoColorSpace;
    texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
  }, [gl, loadedLandMap]);

  const maskUniforms = useMemo(() => ({
    displacement: { value: 0.055 },
    landMap: { value: landMap },
  }), [landMap]);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useEffect(() => () => landMap.dispose(), [landMap]);

  useFrame((_, delta) => {
    if (!animate) return;
    if (spinRef.current) spinRef.current.rotation.y += delta * 0.032;
  });

  return (
    <group rotation={[0, 0, AXIAL_TILT]}>
      <group ref={spinRef} rotation={[0, -1.34, 0]}>
        <mesh renderOrder={0}>
          <sphereGeometry args={[EARTH_RADIUS, 112, 72]} />
          <meshStandardMaterial
            color="#020405"
            roughness={0.74}
            metalness={0.28}
          />
        </mesh>

        <mesh renderOrder={1} scale={1.003}>
          <sphereGeometry args={[EARTH_RADIUS, 80, 52]} />
          <meshBasicMaterial
            color="#aebcc3"
            wireframe
            transparent
            opacity={0.075}
            depthWrite={false}
          />
        </mesh>

        <mesh renderOrder={2}>
          <sphereGeometry args={[EARTH_RADIUS + 0.025, 144, 92]} />
          <shaderMaterial
            uniforms={maskUniforms}
            vertexShader={MASK_VERTEX_SHADER}
            fragmentShader={LAND_FILL_FRAGMENT_SHADER}
            transparent
            depthWrite={false}
            side={THREE.FrontSide}
          />
        </mesh>

        <mesh renderOrder={4}>
          <sphereGeometry args={[EARTH_RADIUS + 0.08, 192, 128]} />
          <shaderMaterial
            uniforms={maskUniforms}
            vertexShader={MASK_VERTEX_SHADER}
            fragmentShader={COAST_FRAGMENT_SHADER}
            transparent
            depthWrite={false}
          />
        </mesh>
      </group>

      <mesh renderOrder={5} scale={1.055}>
        <sphereGeometry args={[EARTH_RADIUS, 80, 52]} />
        <shaderMaterial
          vertexShader={ATMOSPHERE_VERTEX_SHADER}
          fragmentShader={ATMOSPHERE_FRAGMENT_SHADER}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

export default MeshEarth;
