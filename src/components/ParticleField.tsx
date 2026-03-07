import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 800 }) {
  const mesh = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cyan = new THREE.Color("hsl(175, 80%, 50%)");
    const purple = new THREE.Color("hsl(260, 60%, 60%)");
    const pink = new THREE.Color("hsl(320, 70%, 55%)");

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const colorChoice = [cyan, purple, pink][Math.floor(Math.random() * 3)];
      colors[i * 3] = colorChoice.r;
      colors[i * 3 + 1] = colorChoice.g;
      colors[i * 3 + 2] = colorChoice.b;
    }
    return [positions, colors];
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.03;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function FloatingGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={[3, 0, -2]}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshBasicMaterial color="hsl(175, 80%, 50%)" wireframe transparent opacity={0.15} />
    </mesh>
  );
}

export default function ParticleField() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }} style={{ background: "transparent" }}>
        <Particles />
        <FloatingGlobe />
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>
  );
}
