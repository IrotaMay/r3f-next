"use client";

import * as THREE from "three";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  RapierRigidBody,
} from "@react-three/rapier";

type BubbleProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: (range: number) => number;
};

const babbleMaterial = new THREE.MeshLambertMaterial({
  color: "#c0a0a0",
  emissive: "red",
});
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const bubbles = [...Array(50)].map(() => ({
  scale: [0.75, 0.75, 1, 1, 1.25][Math.floor(Math.random() * 5)],
}));

function Bubble({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
}: BubbleProps) {
  const api = useRef<RapierRigidBody>(null);
  useFrame((_, delta) => {
    delta = Math.min(0.1, delta);
    if (api.current) {
      api.current.applyImpulse(
        vec
          .copy(api.current.translation() as THREE.Vector3)
          .normalize()
          .multiply(
            new THREE.Vector3(
              -50 * delta * scale,
              -150 * delta * scale,
              -50 * delta * scale
            )
          ),
        true
      );
    }
  });

  return (
    <RigidBody
      ref={api}
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={babbleMaterial}
      />
    </RigidBody>
  );
}

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef<RapierRigidBody>(null);
  useFrame(({ mouse, viewport }) => {
    vec.lerp(
      new THREE.Vector3(
        (mouse.x * viewport.width) / 2,
        (mouse.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    if (ref.current) {
      ref.current.setNextKinematicTranslation(vec);
    }
  });
  return (
    <RigidBody
      ref={ref}
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

export default function BestServedBold() {
  return (
    <Canvas
      shadows
      gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
      camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
      onCreated={({ gl }) => (gl.toneMappingExposure = 1.5)}
    >
      <ambientLight intensity={1} />
      <spotLight
        position={[20, 20, 25]}
        penumbra={1}
        angle={0.2}
        color="white"
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <directionalLight position={[0, 5, -4]} intensity={4} />
      <directionalLight position={[0, -15, -0]} intensity={4} color="red" />
      <Physics gravity={[0, 0, 0]}>
        <Pointer />
        {bubbles.map((props, i) => (
          <Bubble key={i} scale={props.scale} />
        ))}
      </Physics>
      <EffectComposer disableNormalPass multisampling={0}>
        <N8AO color="red" aoRadius={2} intensity={1} />
      </EffectComposer>
    </Canvas>
  );
}
