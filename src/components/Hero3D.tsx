import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Sphere, Box, Torus, MeshDistortMaterial } from "@react-three/drei";
import { Suspense } from "react";

const AnimatedShapes = () => {
  return (
    <>
      {/* Floating Sphere */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1, 32, 32]} position={[-3, 0, 0]}>
          <MeshDistortMaterial
            color="hsl(var(--primary))"
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      </Float>

      {/* Rotating Box */}
      <Float speed={1.2} rotationIntensity={1.5} floatIntensity={1.5}>
        <Box args={[1.5, 1.5, 1.5]} position={[3, 0, 0]}>
          <MeshDistortMaterial
            color="hsl(var(--accent))"
            attach="material"
            distort={0.2}
            speed={1.5}
            roughness={0.2}
            metalness={0.8}
          />
        </Box>
      </Float>

      {/* Floating Torus */}
      <Float speed={1.8} rotationIntensity={2} floatIntensity={2.5}>
        <Torus args={[1, 0.3, 16, 100]} position={[0, 2, -2]}>
          <MeshDistortMaterial
            color="hsl(var(--secondary))"
            attach="material"
            distort={0.4}
            speed={2.5}
            roughness={0.2}
            metalness={0.8}
          />
        </Torus>
      </Float>

      {/* Additional smaller shapes for depth */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Sphere args={[0.5, 16, 16]} position={[2, -2, 1]}>
          <meshStandardMaterial
            color="hsl(var(--primary))"
            roughness={0.3}
            metalness={0.7}
            emissive="hsl(var(--primary))"
            emissiveIntensity={0.3}
          />
        </Sphere>
      </Float>

      <Float speed={1.6} rotationIntensity={1.5} floatIntensity={1.8}>
        <Box args={[0.8, 0.8, 0.8]} position={[-2, -1.5, 1]}>
          <meshStandardMaterial
            color="hsl(var(--accent))"
            roughness={0.3}
            metalness={0.7}
            emissive="hsl(var(--accent))"
            emissiveIntensity={0.3}
          />
        </Box>
      </Float>

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="hsl(var(--primary))" />
      <pointLight position={[0, 0, 5]} intensity={1} color="hsl(var(--accent))" />
    </>
  );
};

export const Hero3D = () => {
  return (
    <div className="relative h-[500px] w-full">
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <Suspense fallback={null}>
            <AnimatedShapes />
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
            />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Welcome to Tracky
          </h1>
          <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto">
            Your futuristic productivity companion designed for engineering excellence
          </p>
        </div>
      </div>
    </div>
  );
};
