import { useMemo, forwardRef, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float, MeshDistortMaterial, MeshWobbleMaterial } from "@react-three/drei";

const Particles = forwardRef(function Particles(props: { count?: number }, _ref) {
  const count = props.count ?? 1200;
  const mesh = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cyan = new THREE.Color("hsl(175, 80%, 50%)");
    const purple = new THREE.Color("hsl(260, 60%, 60%)");
    const pink = new THREE.Color("hsl(320, 70%, 55%)");

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;

      const colorChoice = [cyan, purple, pink][Math.floor(Math.random() * 3)];
      colors[i * 3] = colorChoice.r;
      colors[i * 3 + 1] = colorChoice.g;
      colors[i * 3 + 2] = colorChoice.b;
    }
    return [positions, colors];
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
      <pointsMaterial size={0.035} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  );
});

const FloatingGlobe = forwardRef(function FloatingGlobe(_props, _ref) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.08;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.4;
  });

  return (
    <mesh ref={meshRef} position={[3.5, 0.5, -3]}>
      <icosahedronGeometry args={[1.8, 1]} />
      <meshBasicMaterial color="hsl(175, 80%, 50%)" wireframe transparent opacity={0.12} />
    </mesh>
  );
});

function FloatingTorusKnot() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.15;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
  });

  return (
    <mesh ref={meshRef} position={[-4, -1, -4]}>
      <torusKnotGeometry args={[1.2, 0.3, 100, 16]} />
      <meshBasicMaterial color="hsl(260, 60%, 60%)" wireframe transparent opacity={0.1} />
    </mesh>
  );
}

function GlowOrb({ position, color, speed, size }: { position: [number, number, number]; color: string; speed: number; size: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.8;
    meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed * 0.7) * 0.5;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <MeshDistortMaterial color={color} transparent opacity={0.15} distort={0.4} speed={2} />
      </mesh>
    </Float>
  );
}

function WobbleRing({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.12;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.08;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[1.5, 0.05, 16, 100]} />
      <MeshWobbleMaterial color={color} transparent opacity={0.2} factor={0.3} speed={1.5} />
    </mesh>
  );
}

function GridPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, -5]}>
      <planeGeometry args={[40, 40, 40, 40]} />
      <meshBasicMaterial color="hsl(175, 80%, 50%)" wireframe transparent opacity={0.04} />
    </mesh>
  );
}

export default function ParticleField() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 7], fov: 60 }} style={{ background: "transparent" }}>
        <Particles />
        <FloatingGlobe />
        <FloatingTorusKnot />
        <GlowOrb position={[-3, 2, -2]} color="hsl(175, 80%, 50%)" speed={0.5} size={0.6} />
        <GlowOrb position={[4, -2, -3]} color="hsl(260, 60%, 60%)" speed={0.7} size={0.8} />
        <GlowOrb position={[0, 3, -5]} color="hsl(320, 70%, 55%)" speed={0.4} size={0.5} />
        <WobbleRing position={[-2, 1, -6]} color="hsl(175, 80%, 50%)" />
        <WobbleRing position={[3, -1, -5]} color="hsl(260, 60%, 60%)" />
        <GridPlane />
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={0.3} color="hsl(175, 80%, 50%)" />
        <pointLight position={[-5, -3, 3]} intensity={0.2} color="hsl(260, 60%, 60%)" />
      </Canvas>
    </div>
  );
}
