"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function Box() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 32.5, near: 1, far: 100 }}>
      <OrbitControls />

      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <mesh scale={2}>
        <boxGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </Canvas>
  );
}
