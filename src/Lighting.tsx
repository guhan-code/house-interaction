import { useStore } from "./store";

export function Lighting() {
  const isNight = useStore((s) => s.isNight);

  return (
    <>
      <ambientLight intensity={isNight ? 0.15 : 0.5} color={isNight ? "#4a4a8a" : "#ffffff"} />
      <directionalLight
        position={isNight ? [5, 10, 5] : [10, 15, 8]}
        intensity={isNight ? 0.3 : 1.2}
        color={isNight ? "#6a6aaa" : "#fff5e0"}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      {/* Interior warm light at night */}
      {isNight && (
        <pointLight
          position={[0, 2.5, 0]}
          intensity={1.5}
          distance={8}
          color="#ffcc88"
          castShadow
        />
      )}
      {/* Moonlight fill */}
      {isNight && (
        <directionalLight
          position={[-5, 8, -5]}
          intensity={0.2}
          color="#a0a0ff"
        />
      )}
    </>
  );
}
