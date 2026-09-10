import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { XR, VRButton, Controllers, TeleportationPlane } from "@react-three/xr";
import { Building } from "./Building";
import { useStore } from "./store";
import { Lighting } from "./Lighting";

export function Scene() {
  const isNight = useStore((s) => s.isNight);

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [8, 5, 8], fov: 50 }}
        gl={{ antialias: true, toneMappingExposure: isNight ? 0.4 : 1.0 }}
      >
        <color attach="background" args={[isNight ? "#0a0a1a" : "#87ceeb"]} />
        <fog attach="fog" args={[isNight ? "#0a0a1a" : "#87ceeb", 15, 40]} />

        <Lighting />

        <Building />

        <ContactShadows
          position={[0, -0.05, 0]}
          opacity={isNight ? 0.3 : 0.5}
          scale={20}
          blur={2}
          far={8}
        />

        {!isNight && <Environment preset="park" />}

        <OrbitControls
          enablePan={true}
          minDistance={3}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2 - 0.05}
          target={[0, 1.5, 0]}
        />

        <XR>
          <Controllers />
          <TeleportationPlane
            position={[0, 0, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={30}
          />
        </XR>
      </Canvas>

      <VRButton
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
          background: "rgba(74, 158, 218, 0.9)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "12px",
          color: "#fff",
          padding: "12px 32px",
          fontSize: "16px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        }}
      />
    </>
  );
}
