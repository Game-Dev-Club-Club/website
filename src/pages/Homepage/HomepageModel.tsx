import { useRef, useEffect, useMemo, useState, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

interface ModelProps {
  wrapperRef: React.RefObject<HTMLDivElement | null>;
}

function useMouseTilt(
  wrapperRef: React.RefObject<HTMLDivElement | null>,
  groupRef: React.RefObject<THREE.Group | null>,
  baseRotation: THREE.Euler,
  maxTiltX: number,
  maxTiltY: number
) {
  const mouse = useRef({ x: 0, y: 0 });
  const targetRotation = useRef(new THREE.Euler());
  const targetQuaternion = useRef(new THREE.Quaternion());

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!wrapperRef.current) return;

      const rect = wrapperRef.current.getBoundingClientRect();

      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);

      const radius = Math.max(rect.width, rect.height) * 1.5;

      mouse.current.x = THREE.MathUtils.clamp(dx / radius, -1, 1);
      mouse.current.y = THREE.MathUtils.clamp(-dy / radius, -1, 1);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [wrapperRef]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const { x, y } = mouse.current;
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
  });
}

function InteractiveStrawberry({ wrapperRef, ...props }: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/logo/JamJam_strawberries.glb");
  //deep clone so this instance is independent
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const baseRotation = useMemo(() => new THREE.Euler(-0.6, 0, -0.1), []);
  useMouseTilt(wrapperRef, groupRef, baseRotation, 0.2, 0.2);

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

  // i chose to make the strawberry spin rather than the jar since they're separate
  // strawberry renders in front of jar
  const outerRef = useRef<THREE.Group>(null);

  const spin = useRef({ angle: 0, target: 0, velocity: 0 });
  const SPIN_ACCEL = 32;
  const SPIN_MAX_SPEED = 16; // rad
  const SPIN_SETTLE = 6;

  const baseScale = useRef(1);
  const pulseProgress = useRef<number | null>(null);
  useEffect(() => () => void (document.body.style.cursor = ""), []);

  useFrame(({ clock }, delta) => {
    if (!outerRef.current) return;
    // Srink to 0.8x while spinning
    const targetScale = spin.current.target > 0 ? 0.8 : 1;
    baseScale.current = THREE.MathUtils.damp(baseScale.current, targetScale, 5, delta);
    //this is the quick hover pulse
    let pulse = 1;
    if (pulseProgress.current !== null) {
      pulseProgress.current = Math.min(1, pulseProgress.current + delta / 0.3);
      pulse = 1 + 0.03 * Math.sin(Math.PI * pulseProgress.current);
      if (pulseProgress.current >= 1) pulseProgress.current = null;
    }
    outerRef.current.scale.setScalar(baseScale.current * pulse);

    const time = clock.elapsedTime;
    // Floating animation (doesn't drift)
    outerRef.current.position.y = -1 + Math.sin(time * 2.0) * 0.09;
    outerRef.current.position.x = Math.sin(time * 0.5) * 0.1;

    // Full 360 around Y
    const s = spin.current;
    if (s.target > 0) {
      const remaining = s.target - s.angle; //slows based on remaining angle
      const rem = Math.max(remaining, 0);
      const desired = Math.min(SPIN_MAX_SPEED, SPIN_SETTLE * rem);
      s.velocity = Math.min(desired, s.velocity + SPIN_ACCEL * delta);
      s.angle += s.velocity * delta;

      // in case there are hanging floats
      if (s.angle >= s.target - 0.01) {
        s.angle = 0;
        s.target = 0;
        s.velocity = 0;
      }
      outerRef.current.rotation.y = s.angle;
    }
  });

  return (
    <group
      ref={outerRef}
      onClick={() => {
        // spin: each click adds 2pi
        // with accel limits so ppl can spam click for funsies
        spin.current.target += Math.PI * 2;
      }}
      onPointerOver={() => {
        if (pulseProgress.current === null) pulseProgress.current = 0;
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      <primitive ref={groupRef} object={clonedScene} scale={0.67} {...props} />
    </group>
  );
}

function Jar({ wrapperRef, ...props }: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/logo/JamJam_jar.glb");

  // Deep clone
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  const baseRotation = useMemo(
    () => new THREE.Euler(0, Math.PI + 0.2, -0.2),
    []
  );

  useMouseTilt(wrapperRef, groupRef, baseRotation, 0.03, 0.08);

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

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    groupRef.current.position.y = -0.5 + Math.sin(clock.elapsedTime * 2.0) * 0.09;
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
          width: 500,
          maxWidth: 500,
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
            {/* nudge the model so that it's visually centered
               (the jar previously leaned right of its origin) */}
            <group position={[1.1, 0, 0]}>
              <Jar wrapperRef={wrapperRef} />
              <InteractiveStrawberry wrapperRef={wrapperRef} />
            </group>
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

useGLTF.preload("/logo/JamJam_jar.glb");
useGLTF.preload("/logo/JamJam_strawberries.glb");

export default HomepageModel;
