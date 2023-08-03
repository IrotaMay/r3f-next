'use client';

import * as THREE from 'three';
import { useRef, useState } from 'react';
import { easing } from 'maath';
import { Canvas, useFrame, GroupProps } from '@react-three/fiber';
import {
  useGLTF,
  Center,
  Caustics,
  Environment,
  Lightformer,
  RandomizedLight,
  PerformanceMonitor,
  AccumulativeShadows,
  MeshTransmissionMaterial,
} from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    glass: THREE.Mesh
    glass_back: THREE.Mesh
    glass_inner: THREE.Mesh
    cake: THREE.Mesh
    straw_1: THREE.Mesh
    straw001_1: THREE.Mesh
    straw001_2: THREE.Mesh
    straw_2: THREE.Mesh
    flowers: THREE.Mesh
    fork: THREE.Mesh
  }
  materials: {
    glass_accurate: THREE.MeshPhysicalMaterial
    FruitCakeSlice_u1_v1: THREE.MeshBasicMaterial
    straw_2: THREE.MeshStandardMaterial
    straw_1: THREE.MeshStandardMaterial
    ['draifrawer_u1_v1.001']: THREE.MeshStandardMaterial
    ForkAndKnivesSet001_1K: THREE.MeshStandardMaterial
  }
}

const innerMaterial = new THREE.MeshStandardMaterial({
  transparent: true,
  opacity: 1,
  color: 'black',
  roughness: 0,
  side: THREE.FrontSide,
  blending: THREE.AdditiveBlending,
  polygonOffset: true,
  polygonOffsetFactor: 1,
  envMapIntensity: 2,
})

function Scene(props: GroupProps) {
  const { nodes, materials } = useGLTF('/glass-transformed.glb') as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh castShadow rotation={[0, -0.5, 0]} geometry={nodes.cake.geometry} material={materials.FruitCakeSlice_u1_v1} />
      <mesh castShadow geometry={nodes.straw_1.geometry} material={materials.straw_2} />
      <mesh castShadow geometry={nodes.straw_2.geometry} material={materials.straw_1} />
      <mesh castShadow position={[0, -0.005, 0]} geometry={nodes.straw001_1.geometry} material={materials.straw_2} />
      <mesh castShadow position={[0, -0.005, 0]} geometry={nodes.straw001_2.geometry} material={materials.straw_1} />
      <Center rotation={[0, -0.4, 0]} position={[-1, -0.01, -2]} top>
        <mesh scale={1.2} castShadow geometry={nodes.flowers.geometry} material={materials['draifrawer_u1_v1.001']} />
      </Center>
      <mesh castShadow geometry={nodes.fork.geometry} material={materials.ForkAndKnivesSet001_1K} />

      <Caustics
        backside
        color={[1, 0.8, 0.8]}
        lightSource={[-2, 2.5, -2.5]}
        intensity={0.005}
        worldRadius={0.66/10}
        ior={0.6}
        backsideIOR={1.26}
        causticsOnly={false}
      >
        <mesh castShadow receiveShadow geometry={nodes.glass.geometry}>
          <MeshTransmissionMaterial
            distortionScale={1}
            temporalDistortion={1}
            thickness={0.2}
            chromaticAberration={0.05}
            anisotropy={1.5}
            clearcoat={1}
            clearcoatRoughness={0.2}
            envMapIntensity={3}
          />
        </mesh>
      </Caustics>

      <mesh scale={[0.95, 1, 0.95]} geometry={nodes.glass_back.geometry} material={innerMaterial} />
      <mesh geometry={nodes.glass_inner.geometry} material={innerMaterial} />
    </group>
  )
}

function Env({ perfSucks }: { perfSucks: boolean }) {
  const ref = useRef<THREE.Group>(null!);
  const vec = new THREE.Vector3();
  useFrame((state, delta) => {
    if (ref.current) {
      if (!perfSucks) {
        vec.setFromEuler(ref.current.rotation);
        easing.damp3(vec, [Math.PI / 2, 0, state.clock.elapsedTime / 5 + state.pointer.x], 0.2, delta);
        easing.damp3(state.camera.position, [Math.sin(state.pointer.x / 4) * 9, 1.25 + state.pointer.y, Math.cos(state.pointer.x / 4) * 9], 0.5, delta)
        state.camera.lookAt(0, 0, 0)
      }
    }
  })

  return (
    <Environment frames={perfSucks ? 1: Infinity} preset='city' resolution={256} background blur={0.8}>
      <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
      <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
      <group rotation={[Math.PI / 2, 1, 0]}>
        {[2, -2, 2, -4, 2, -5, 2, -9].map((x, i) => (
          <Lightformer key={i} intensity={1} rotation={[Math.PI / 4, 0, 0]} position={[x, 4, i * 4]} scale={[4, 1, 1]} />
        ))}
        <Lightformer intensity={0.5} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
        <Lightformer intensity={0.5} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[50, 2, 1]} />
        <Lightformer intensity={0.5} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
      </group>
      <group ref={ref}>
        <Lightformer intensity={5} form="ring" color="red" rotation-y={Math.PI / 2} position={[-5, 2, -1]} scale={[10, 10, 1]} />
      </group>
    </Environment>
  )
}

export default function Caustic() {
  const [perfSucks, setPerfSucks] = useState(false);
  return (
    <Canvas
      shadows
      dpr={[1, perfSucks ? 1.5 : 2]}
      eventPrefix='client'
      camera={{position: [20, 0.9, 20], fov: 26}}
    >
      {/* <PerformanceMonitor onDecline={() => setPerfSucks(true)} /> */}
      <color attach="background" args={['#f0f0f0']} />
      <group position={[0, -0.5, 0]} rotation={[0, -0.75, 0]}>
        <Scene />
        <AccumulativeShadows frames={100} alphaTest={0.85} opacity={0.8} color='red' scale={20} position={[0, -0.005, 0]}>
          <RandomizedLight amount={8} radius={6} ambient={0.5} intensity={1} position={[-1.5, 2.5, -2.5]} bias={0.001} />
        </AccumulativeShadows>
      </group>
      <Env perfSucks={perfSucks} />
    </Canvas>
  )
}
