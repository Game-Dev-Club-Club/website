import { useRef, useEffect, useMemo, useState, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

interface InteractivePlaceholderProps {
  wrapperRef: React.RefObject<HTMLDivElement | null>;
}

function InteractiveStrawberry({
  wrapperRef,
  ...props
}: InteractivePlaceholderProps) {
  const groupRef = useRef<THREE.Group>(null);

  const { scene } = useGLTF("/logo/JamJam_strawberries.glb");

  // Deep clone so this instance is independent
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  const globalMouse = useRef({ x: 0, y: 0 });

  const targetRotation = useRef(new THREE.Euler());
  const targetQuaternion = useRef(new THREE.Quaternion());

  const baseRotation = useMemo(() => new THREE.Euler(-0.6, 0, -0.1), []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!wrapperRef.current) return;

      const rect = wrapperRef.current.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;

      const radius = Math.max(rect.width, rect.height) * 1.5;

      globalMouse.current.x = THREE.MathUtils.clamp(dx / radius, -1, 1);
      globalMouse.current.y = THREE.MathUtils.clamp(-dy / radius, -1, 1);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [wrapperRef]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Clone the material to avoid mutating the original cached glTF material
        child.material = child.material.clone();

        // Force the strawberry into the Transparent queue
        child.material.transparent = true;

        child.renderOrder = 5;

        child.material.depthTest = true;
        child.material.depthWrite = true;
      }
    });
  }, [clonedScene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const { x, y } = globalMouse.current;

    const maxTiltX = 0.2;
    const maxTiltY = 0.2;

    targetRotation.current.set(
      baseRotation.x - y * maxTiltX,
      baseRotation.y + x * maxTiltY,
      baseRotation.z
    );

    targetQuaternion.current.setFromEuler(targetRotation.current);

    groupRef.current.quaternion.slerp(
      targetQuaternion.current,
      1 - Math.exp(-5 * delta)
    );

    // Floating animation (doesn't drift)
    const time = performance.now() * 0.001;
    groupRef.current.position.y = -1 + Math.sin(time * 2.0) * 0.09;

    groupRef.current.position.x = Math.sin(time * 0.5) * 0.1;
  });

  return (
    <primitive ref={groupRef} object={clonedScene} scale={0.67} {...props} />
  );
}

function Jar({ wrapperRef, ...props }: InteractivePlaceholderProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/logo/JamJam_jar.glb");

  // Deep clone
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // Mouse tracking refs
  const globalMouse = useRef({ x: 0, y: 0 });
  const targetRotation = useRef(new THREE.Euler());
  const targetQuaternion = useRef(new THREE.Quaternion());

  // Use the original hardcoded rotation as the base
  const baseRotation = useMemo(
    () => new THREE.Euler(0, Math.PI + 0.2, -0.2),
    []
  );

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!wrapperRef.current) return;

      const rect = wrapperRef.current.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;

      const radius = Math.max(rect.width, rect.height) * 1.5;

      globalMouse.current.x = THREE.MathUtils.clamp(dx / radius, -1, 1);
      globalMouse.current.y = THREE.MathUtils.clamp(-dy / radius, -1, 1);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [wrapperRef]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = child.material.clone();

        const material = child.material as THREE.MeshPhysicalMaterial;

        // Important:
        material.depthWrite = false;
        material.depthTest = false;

        material.side = THREE.BackSide; // Render back faces first to avoid z-fighting

        material.needsUpdate = true;

        child.renderOrder = 1;

        if (child.name === "jar") {
          material.color = new THREE.Color(1.1, 1.1, 1.1);
          material.transparent = true;
          material.opacity = 0.3;
          material.roughness = 0.1;
          material.metalness = 0.1;
          material.depthWrite = false;
        }

        if (child.name === "jam") {
          material.color = new THREE.Color(2, 0.1, 0.11);
          material.opacity = 0.8;
          material.transmission = 0.9;
        }

        if (child.name === "lid") {
          //orangish yellow
          material.color = new THREE.Color(3.1, 1.8, 0.2);
          material.transparent = true;
          material.opacity = 0.9;
          material.depthWrite = true;
          material.depthTest = true;
          child.renderOrder = 2;
        }
      }
    });
  }, [clonedScene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const { x, y } = globalMouse.current;

    const maxTiltX = 0.03;
    const maxTiltY = 0.08;

    targetRotation.current.set(
      baseRotation.x - y * maxTiltX,
      baseRotation.y + x * maxTiltY,
      baseRotation.z
    );

    targetQuaternion.current.setFromEuler(targetRotation.current);

    groupRef.current.quaternion.slerp(
      targetQuaternion.current,
      1 - Math.exp(-5 * delta)
    );

    // Floating animation (doesn't drift)
    const time = performance.now() * 0.001;
    groupRef.current.position.y = -0.5 + Math.sin(time * 2.0) * 0.09;
  });

  return (
    <primitive
      ref={groupRef}
      object={clonedScene}
      scale={0.5}
      position={[0, -0.5, 0]}
      renderOrder={1}
      {...props}
    />
  );
}

function HomepageModel() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Track when the Canvas and WebGL context are fully initialized
  const [isReady, setIsReady] = useState(false);

  return (
    <div className="home-details">
      <div
        ref={wrapperRef}
        className="logo-3d-wrapper"
        style={{
          width: "100%",
          maxWidth: 580,
          aspectRatio: "5 / 3",
          // Hide until ready, then fade in smoothly to mask any shader compilation frame
          opacity: isReady ? 1 : 0,
          transition: "opacity 0.4s ease-out",
        }}
      >
        <Canvas
          camera={{
            position: [0, 4, 6],
            fov: 100,
            rotation: [-Math.PI / 10, 0, 0],
          }}
          onCreated={() => setIsReady(true)} // Fires once WebGL context & initial scene are built
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[100, 30, 100]} intensity={1.5} />

          {/* Suspense prevents the models from trying to render before GLTFs are fully parsed */}
          <Suspense fallback={null}>
            <Jar wrapperRef={wrapperRef} />
            <InteractiveStrawberry wrapperRef={wrapperRef} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

useGLTF.preload("/logo/JamJam_jar.glb");
useGLTF.preload("/logo/JamJam_strawberries.glb");

export default HomepageModel;

