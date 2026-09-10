import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useStore } from "./store";
import {
  createMaterial,
  getFloorOption,
  getWallOption,
  getRoofOption,
  getDoorOption,
  getWindowOption,
  type ElementType,
} from "./materials";

const WALL_HEIGHT = 3;
const ROOM_SIZE = 6;

interface ElementProps {
  type: ElementType;
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  rotation?: [number, number, number];
}

function BuildingElement({ type, geometry, position, rotation }: ElementProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const selectedElement = useStore((s) => s.selectedElement);
  const selectElement = useStore((s) => s.selectElement);
  const config = useStore((s) => s.config);

  const isSelected = selectedElement === type;

  const material = useMemo(() => {
    let mat: THREE.MeshStandardMaterial;
    if (type === "floor") mat = createMaterial(getFloorOption(config.floor));
    else if (type === "wall") mat = createMaterial(getWallOption(config.wall));
    else if (type === "roof") mat = createMaterial(getRoofOption(config.roof));
    else if (type === "door") {
      const opt = getDoorOption(config.door);
      mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(opt.color),
        roughness: opt.roughness,
        metalness: opt.metalness,
        transparent: opt.style === "glass",
        opacity: opt.style === "glass" ? 0.4 : 1.0,
      });
    } else {
      const opt = getWindowOption(config.window);
      mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#a0d0e0"),
        roughness: 0.05,
        metalness: 0.1,
        transparent: true,
        opacity: 0.3,
      });
      // frame color stored in option, used in geometry
      void opt;
    }
    return mat;
  }, [type, config]);

  useEffect(() => {
    if (isSelected) {
      material.emissive.set("#ffcc00");
      material.emissiveIntensity = 0.35;
    } else {
      material.emissive.set("#000000");
      material.emissiveIntensity = 0;
    }
  }, [isSelected, material]);

  useEffect(() => {
    return () => {
      material.dispose();
      if (material.map) material.map.dispose();
    };
  }, [material]);

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
      onPointerDown={(e) => {
        e.stopPropagation();
        selectElement(type);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (meshRef.current) {
          meshRef.current.scale.setScalar(1.01);
        }
      }}
      onPointerOut={() => {
        if (meshRef.current) {
          meshRef.current.scale.setScalar(1.0);
        }
      }}
    />
  );
}

export function Building() {
  const config = useStore((s) => s.config);

  const geometries = useMemo(() => {
    const floorGeo = new THREE.BoxGeometry(ROOM_SIZE, 0.1, ROOM_SIZE);

    // 4 walls with gaps for door and windows
    const wallThickness = 0.15;
    // Back wall (full)
    const backWallGeo = new THREE.BoxGeometry(ROOM_SIZE, WALL_HEIGHT, wallThickness);
    // Left wall (full)
    const leftWallGeo = new THREE.BoxGeometry(wallThickness, WALL_HEIGHT, ROOM_SIZE);
    // Right wall (full)
    const rightWallGeo = new THREE.BoxGeometry(wallThickness, WALL_HEIGHT, ROOM_SIZE);
    // Front wall with door gap — split into two segments
    const doorWidth = 1.2;
    const sideWidth = (ROOM_SIZE - doorWidth) / 2;
    const frontLeftGeo = new THREE.BoxGeometry(sideWidth, WALL_HEIGHT, wallThickness);
    const frontRightGeo = new THREE.BoxGeometry(sideWidth, WALL_HEIGHT, wallThickness);
    // Top piece above door
    const doorTopHeight = 0.6;
    const frontTopGeo = new THREE.BoxGeometry(doorWidth, doorTopHeight, wallThickness);

    // Roof — pyramid-like
    const roofGeo = new THREE.ConeGeometry(ROOM_SIZE * 0.85, 2, 4);

    // Door geometry based on style
    const doorOpt = getDoorOption(config.door);
    let doorGeo: THREE.BufferGeometry;
    if (doorOpt.style === "sliding") {
      doorGeo = new THREE.BoxGeometry(doorWidth, WALL_HEIGHT * 0.85, 0.08);
    } else if (doorOpt.style === "modern") {
      doorGeo = new THREE.BoxGeometry(doorWidth, WALL_HEIGHT * 0.9, 0.08);
    } else if (doorOpt.style === "glass") {
      doorGeo = new THREE.BoxGeometry(doorWidth, WALL_HEIGHT * 0.85, 0.05);
    } else {
      doorGeo = new THREE.BoxGeometry(doorWidth * 0.9, WALL_HEIGHT * 0.85, 0.08);
    }

    // Window geometry based on style
    const winOpt = getWindowOption(config.window);
    let windowGeo: THREE.BufferGeometry;
    if (winOpt.style === "double") {
      windowGeo = new THREE.BoxGeometry(1.6, 1.2, 0.08);
    } else if (winOpt.style === "arch") {
      windowGeo = new THREE.BoxGeometry(1.0, 1.4, 0.08);
    } else if (winOpt.style === "full") {
      windowGeo = new THREE.BoxGeometry(2.0, 2.0, 0.08);
    } else {
      windowGeo = new THREE.BoxGeometry(1.0, 1.0, 0.08);
    }

    return {
      floorGeo,
      backWallGeo,
      leftWallGeo,
      rightWallGeo,
      frontLeftGeo,
      frontRightGeo,
      frontTopGeo,
      roofGeo,
      doorGeo,
      windowGeo,
    };
  }, [config.door, config.window]);

  // Window positions on left and right walls
  const windowY = 1.6;
  const windowPositions: { pos: [number, number, number]; rot: [number, number, number] }[] = [
    { pos: [-ROOM_SIZE / 2, windowY, 0], rot: [0, Math.PI / 2, 0] },
    { pos: [ROOM_SIZE / 2, windowY, 0], rot: [0, Math.PI / 2, 0] },
  ];

  return (
    <group>
      {/* Floor */}
      <BuildingElement type="floor" geometry={geometries.floorGeo} position={[0, -0.05, 0]} />

      {/* Walls */}
      <BuildingElement type="wall" geometry={geometries.backWallGeo} position={[0, WALL_HEIGHT / 2, -ROOM_SIZE / 2]} />
      <BuildingElement type="wall" geometry={geometries.leftWallGeo} position={[-ROOM_SIZE / 2, WALL_HEIGHT / 2, 0]} />
      <BuildingElement type="wall" geometry={geometries.rightWallGeo} position={[ROOM_SIZE / 2, WALL_HEIGHT / 2, 0]} />
      <BuildingElement
        type="wall"
        geometry={geometries.frontLeftGeo}
        position={[-(ROOM_SIZE / 2 - (ROOM_SIZE - 1.2) / 4), WALL_HEIGHT / 2, ROOM_SIZE / 2]}
      />
      <BuildingElement
        type="wall"
        geometry={geometries.frontRightGeo}
        position={[ROOM_SIZE / 2 - (ROOM_SIZE - 1.2) / 4, WALL_HEIGHT / 2, ROOM_SIZE / 2]}
      />
      <BuildingElement
        type="wall"
        geometry={geometries.frontTopGeo}
        position={[0, WALL_HEIGHT - doorTopHeight() / 2, ROOM_SIZE / 2]}
      />

      {/* Roof */}
      <BuildingElement
        type="roof"
        geometry={geometries.roofGeo}
        position={[0, WALL_HEIGHT + 1, 0]}
        rotation={[0, Math.PI / 4, 0]}
      />

      {/* Door */}
      <BuildingElement
        type="door"
        geometry={geometries.doorGeo}
        position={[0, (WALL_HEIGHT * 0.85) / 2, ROOM_SIZE / 2 + 0.08]}
      />

      {/* Windows */}
      {windowPositions.map((w, i) => (
        <BuildingElement
          key={i}
          type="window"
          geometry={geometries.windowGeo}
          position={w.pos}
          rotation={w.rot}
        />
      ))}
    </group>
  );
}

function doorTopHeight() {
  return 0.6;
}
