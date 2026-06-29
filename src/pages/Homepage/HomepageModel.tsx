import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

interface InteractivePlaceholderProps
  extends React.ComponentProps<"mesh"> {
  wrapperRef: React.RefObject<HTMLDivElement | null>;
}

function InteractivePlaceholder({
  wrapperRef,
  ...props
}: InteractivePlaceholderProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const globalMouse = useRef({ x: 0, y: 0 });

  const targetRotation = useRef(new THREE.Euler());
  const targetQuaternion = useRef(new THREE.Quaternion());

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!wrapperRef.current) return;

      const rect = wrapperRef.current.getBoundingClientRect();

      // Center of the model on the page
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Distance from model center
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;

      // Larger radius = less sensitive movement
      const radius = Math.max(rect.width, rect.height) * 1.5;

      globalMouse.current.x = THREE.MathUtils.clamp(dx / radius, -1, 1);
      globalMouse.current.y = THREE.MathUtils.clamp(-dy / radius, -1, 1);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [wrapperRef]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const { x, y } = globalMouse.current;

    const maxTiltX = 0.4;
    const maxTiltY = 0.4;

    targetRotation.current.set(-y * maxTiltX, x * maxTiltY, 0);

    targetQuaternion.current.setFromEuler(targetRotation.current);

    meshRef.current.quaternion.slerp(
      targetQuaternion.current,
      1 - Math.exp(-5 * delta)
    );
  });

  return (
    <mesh {...props} ref={meshRef}>
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial color="#ff6b6b" />
    </mesh>
  );
}

function HomepageModel() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div className="home-details">
      <div
        ref={wrapperRef}
        className="logo-3d-wrapper"
        style={{ width: 300, height: 300 }}
      >
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} />

          <InteractivePlaceholder wrapperRef={wrapperRef} />
        </Canvas>
      </div>
    </div>
  );
}

export default HomepageModel;