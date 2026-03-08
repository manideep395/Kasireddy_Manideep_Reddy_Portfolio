import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text, Float, Line } from "@react-three/drei";

// Floating particles
function Particles({ count = 600 }) {
  const mesh = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cyan = new THREE.Color("hsl(175, 80%, 50%)");
    const purple = new THREE.Color("hsl(260, 60%, 60%)");
    const pink = new THREE.Color("hsl(320, 70%, 55%)");

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
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
    mesh.current.rotation.x = state.clock.elapsedTime * 0.015;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.025;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

// Floating tech symbol
function FloatingSymbol({
  text,
  position,
  color,
  speed,
  size = 0.4,
}: {
  text: string;
  position: [number, number, number];
  color: string;
  speed: number;
  size?: number;
}) {
  const meshRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.6;
    meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed * 0.5) * 0.3;
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.15;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
      <group ref={meshRef} position={position}>
        <Text
          fontSize={size}
          color={color}
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.2}
          font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff"
        >
          {text}
        </Text>
      </group>
    </Float>
  );
}

// Wireframe code bracket shape
function CodeBracket({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[0.8, 0.03, 8, 4]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.15} />
    </mesh>
  );
}

// Neural network node cluster
function NeuralNode({ position, color }: { position: [number, number, number]; color: string }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x = state.clock.elapsedTime * 0.08;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.12;
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4) * 0.4;
  });

  const nodePositions: [number, number, number][] = useMemo(() => {
    return Array.from({ length: 6 }, () => [
      (Math.random() - 0.5) * 1.5,
      (Math.random() - 0.5) * 1.5,
      (Math.random() - 0.5) * 1.5,
    ] as [number, number, number]);
  }, []);

  return (
    <group ref={groupRef} position={position}>
      {nodePositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.25} />
        </mesh>
      ))}
      {/* Connection lines */}
      {nodePositions.slice(0, 4).map((pos, i) => {
        const nextPos = nodePositions[(i + 1) % nodePositions.length];
        const points = [new THREE.Vector3(...pos), new THREE.Vector3(...nextPos)];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={`line-${i}`} geometry={geometry}>
            <lineBasicMaterial color={color} transparent opacity={0.1} />
          </line>
        );
      })}
    </group>
  );
}

// Data flow line
function DataStream({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[0.02, 0.02, 3, 4]} />
      <meshBasicMaterial color={color} transparent opacity={0.08} />
    </mesh>
  );
}

const CYAN = "hsl(175, 80%, 50%)";
const PURPLE = "hsl(260, 60%, 60%)";
const PINK = "hsl(320, 70%, 55%)";

// Tech symbols to float
const techSymbols = [
  { text: "</>", position: [-5, 2, -4] as [number, number, number], color: CYAN, speed: 0.4, size: 0.5 },
  { text: "{ }", position: [5, -1, -3] as [number, number, number], color: PURPLE, speed: 0.5, size: 0.45 },
  { text: "AI", position: [-3, -2, -5] as [number, number, number], color: PINK, speed: 0.35, size: 0.6 },
  { text: "def", position: [4, 3, -6] as [number, number, number], color: CYAN, speed: 0.45, size: 0.35 },
  { text: ">>", position: [-6, 0, -4] as [number, number, number], color: PURPLE, speed: 0.3, size: 0.4 },
  { text: "SQL", position: [3, -3, -5] as [number, number, number], color: CYAN, speed: 0.5, size: 0.35 },
  { text: "λ", position: [-2, 3, -6] as [number, number, number], color: PINK, speed: 0.4, size: 0.5 },
  { text: "API", position: [6, 1, -5] as [number, number, number], color: PURPLE, speed: 0.35, size: 0.35 },
  { text: "0101", position: [-4, -3, -7] as [number, number, number], color: CYAN, speed: 0.45, size: 0.3 },
  { text: "fn()", position: [2, 2, -4] as [number, number, number], color: PINK, speed: 0.5, size: 0.35 },
];

export default function ParticleField() {
  return (
    <div className="fixed top-0 left-0 w-full h-screen z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 7], fov: 60 }} style={{ background: "transparent", width: "100%", height: "100%" }}>
        <Particles />

        {/* Floating tech symbols */}
        {techSymbols.map((sym, i) => (
          <FloatingSymbol key={i} {...sym} />
        ))}

        {/* Neural network clusters */}
        <NeuralNode position={[-4, 1, -5]} color={CYAN} />
        <NeuralNode position={[4, -2, -6]} color={PURPLE} />

        {/* Code brackets */}
        <CodeBracket position={[5, 2, -4]} color={CYAN} />
        <CodeBracket position={[-5, -2, -5]} color={PURPLE} />

        {/* Data streams */}
        <DataStream position={[-6, 0, -7]} color={CYAN} />
        <DataStream position={[6, 0, -7]} color={PURPLE} />
        <DataStream position={[0, -3, -8]} color={PINK} />

        <ambientLight intensity={0.3} />
      </Canvas>
    </div>
  );
}
