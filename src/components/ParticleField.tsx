import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float, Line } from "@react-three/drei";

const CYAN = "hsl(175, 80%, 50%)";
const PURPLE = "hsl(260, 60%, 60%)";
const PINK = "hsl(320, 70%, 55%)";

function Particles({ count = 900 }) {
  const mesh = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const palette = [new THREE.Color(CYAN), new THREE.Color(PURPLE), new THREE.Color(PINK)];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;

      const c = palette[Math.floor(Math.random() * palette.length)];
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }

    return [pos, cols];
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.02;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.04;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function FloatingChip({ position, color }: { position: [number, number, number]; color: string }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.2;
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7) * 0.5;
  });

  return (
    <Float speed={2} rotationIntensity={0.35} floatIntensity={0.45}>
      <group ref={groupRef} position={position}>
        <mesh>
          <boxGeometry args={[0.8, 0.1, 0.8]} />
          <meshStandardMaterial color={color} transparent opacity={0.12} emissive={color} emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[0, 0.07, 0]}>
          <boxGeometry args={[0.35, 0.04, 0.35]} />
          <meshStandardMaterial color={color} transparent opacity={0.25} emissive={color} emissiveIntensity={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

function FloatingCodeBrackets({ position, color }: { position: [number, number, number]; color: string }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = state.clock.elapsedTime * 0.12;
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.4;
  });

  return (
    <group ref={groupRef} position={position}>
      <Line points={[[-0.6, 0.4, 0], [-0.85, 0, 0], [-0.6, -0.4, 0]]} color={color} lineWidth={1.5} transparent opacity={0.45} />
      <Line points={[[0.6, 0.4, 0], [0.85, 0, 0], [0.6, -0.4, 0]]} color={color} lineWidth={1.5} transparent opacity={0.45} />
      <Line points={[[-0.1, -0.45, 0], [0.1, 0.45, 0]]} color={color} lineWidth={1.5} transparent opacity={0.3} />
    </group>
  );
}

function NeuralCluster({ position, color }: { position: [number, number, number]; color: string }) {
  const groupRef = useRef<THREE.Group>(null!);
  const nodePositions = useMemo(
    () => [
      [-0.45, 0.2, 0],
      [0, 0.55, 0.25],
      [0.45, 0.18, -0.1],
      [-0.25, -0.3, 0.2],
      [0.3, -0.35, -0.2],
    ] as [number, number, number][],
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.22;
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.35;
  });

  return (
    <group ref={groupRef} position={position}>
      {nodePositions.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.8} />
        </mesh>
      ))}

      <Line points={[nodePositions[0], nodePositions[1], nodePositions[2], nodePositions[4], nodePositions[3], nodePositions[0]]} color={color} transparent opacity={0.35} lineWidth={1.5} />
    </group>
  );
}

export default function ParticleField() {
  return (
    <div className="fixed top-0 left-0 w-full h-screen z-0 pointer-events-none">
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 50% 30%, hsl(var(--primary) / 0.18), transparent 55%)" }} />

      <Canvas
        camera={{ position: [0, 0, 8], fov: 58 }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.55} />
        <pointLight position={[4, 3, 4]} intensity={1.1} color={CYAN} />
        <pointLight position={[-4, -2, 3]} intensity={0.9} color={PURPLE} />

        <Particles />

        <FloatingCodeBrackets position={[-4.8, 1.6, -4]} color={CYAN} />
        <FloatingCodeBrackets position={[4.8, -1.2, -4.5]} color={PURPLE} />

        <FloatingChip position={[-2.2, -2.2, -5.5]} color={CYAN} />
        <FloatingChip position={[2.6, 2.1, -5.8]} color={PURPLE} />

        <NeuralCluster position={[0.2, 2.6, -6]} color={PINK} />
        <NeuralCluster position={[-0.8, -2.8, -6.2]} color={CYAN} />
      </Canvas>
    </div>
  );
}
