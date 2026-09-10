import * as THREE from "three";

export type ElementType = "floor" | "wall" | "door" | "window" | "roof";

export interface MaterialOption {
  id: string;
  label: string;
  color: string;
  roughness: number;
  metalness: number;
  textureType?: "solid" | "checker" | "stripes" | "plank" | "brick";
  repeat?: number;
}

export interface DoorOption {
  id: string;
  label: string;
  color: string;
  style: "panel" | "glass" | "sliding" | "modern";
  roughness: number;
  metalness: number;
}

export interface WindowOption {
  id: string;
  label: string;
  style: "single" | "double" | "arch" | "full";
  frameColor: string;
}

export const FLOOR_OPTIONS: MaterialOption[] = [
  { id: "tile", label: "Tile", color: "#c8c8d0", roughness: 0.3, metalness: 0.1, textureType: "checker", repeat: 4 },
  { id: "wood", label: "Wood", color: "#8b5a2b", roughness: 0.7, metalness: 0.0, textureType: "plank", repeat: 3 },
  { id: "marble", label: "Marble", color: "#e8e8e0", roughness: 0.1, metalness: 0.05, textureType: "solid", repeat: 1 },
  { id: "carpet", label: "Carpet", color: "#6b4c7d", roughness: 0.95, metalness: 0.0, textureType: "solid", repeat: 1 },
];

export const WALL_OPTIONS: MaterialOption[] = [
  { id: "paint-white", label: "White Paint", color: "#f5f5f0", roughness: 0.9, metalness: 0.0, textureType: "solid", repeat: 1 },
  { id: "paint-blue", label: "Blue Paint", color: "#4a7a9c", roughness: 0.9, metalness: 0.0, textureType: "solid", repeat: 1 },
  { id: "paint-green", label: "Green Paint", color: "#5a8a5a", roughness: 0.9, metalness: 0.0, textureType: "solid", repeat: 1 },
  { id: "wallpaper", label: "Wallpaper", color: "#d4a76a", roughness: 0.85, metalness: 0.0, textureType: "stripes", repeat: 4 },
  { id: "brick", label: "Brick", color: "#8c3a2a", roughness: 0.9, metalness: 0.0, textureType: "brick", repeat: 6 },
  { id: "concrete", label: "Concrete", color: "#9a9a9a", roughness: 0.95, metalness: 0.0, textureType: "solid", repeat: 1 },
];

export const ROOF_OPTIONS: MaterialOption[] = [
  { id: "tile-roof", label: "Clay Tile", color: "#a04030", roughness: 0.8, metalness: 0.0, textureType: "checker", repeat: 6 },
  { id: "shingle", label: "Shingle", color: "#2a2a2a", roughness: 0.9, metalness: 0.0, textureType: "plank", repeat: 8 },
  { id: "metal", label: "Metal", color: "#888899", roughness: 0.3, metalness: 0.7, textureType: "solid", repeat: 1 },
  { id: "green", label: "Green Roof", color: "#3a6a3a", roughness: 0.8, metalness: 0.0, textureType: "solid", repeat: 1 },
];

export const DOOR_OPTIONS: DoorOption[] = [
  { id: "wooden", label: "Wooden", color: "#6b4220", style: "panel", roughness: 0.7, metalness: 0.0 },
  { id: "glass", label: "Glass", color: "#aaccdd", style: "glass", roughness: 0.05, metalness: 0.1 },
  { id: "sliding", label: "Sliding", color: "#555560", style: "sliding", roughness: 0.3, metalness: 0.4 },
  { id: "modern", label: "Modern", color: "#1a1a1a", style: "modern", roughness: 0.2, metalness: 0.6 },
];

export const WINDOW_OPTIONS: WindowOption[] = [
  { id: "single", label: "Single Pane", style: "single", frameColor: "#ffffff" },
  { id: "double", label: "Double Pane", style: "double", frameColor: "#d4b896" },
  { id: "arch", label: "Arched", style: "arch", frameColor: "#c8c8c8" },
  { id: "full", label: "Full Wall", style: "full", frameColor: "#444444" },
];

export interface DesignConfig {
  floor: string;
  wall: string;
  roof: string;
  door: string;
  window: string;
}

export const DEFAULT_CONFIG: DesignConfig = {
  floor: "wood",
  wall: "paint-white",
  roof: "shingle",
  door: "wooden",
  window: "single",
};

export function getFloorOption(id: string): MaterialOption {
  return FLOOR_OPTIONS.find((o) => o.id === id) ?? FLOOR_OPTIONS[0];
}
export function getWallOption(id: string): MaterialOption {
  return WALL_OPTIONS.find((o) => o.id === id) ?? WALL_OPTIONS[0];
}
export function getRoofOption(id: string): MaterialOption {
  return ROOF_OPTIONS.find((o) => o.id === id) ?? ROOF_OPTIONS[0];
}
export function getDoorOption(id: string): DoorOption {
  return DOOR_OPTIONS.find((o) => o.id === id) ?? DOOR_OPTIONS[0];
}
export function getWindowOption(id: string): WindowOption {
  return WINDOW_OPTIONS.find((o) => o.id === id) ?? WINDOW_OPTIONS[0];
}

export function createMaterial(opt: MaterialOption): THREE.MeshStandardMaterial {
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(opt.color),
    roughness: opt.roughness,
    metalness: opt.metalness,
  });
  if (opt.textureType && opt.textureType !== "solid") {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = opt.color;
    ctx.fillRect(0, 0, 256, 256);

    if (opt.textureType === "checker") {
      ctx.fillStyle = shadeColor(opt.color, -20);
      const s = 256 / (opt.repeat ?? 4);
      for (let x = 0; x < 256; x += s) {
        for (let y = 0; y < 256; y += s) {
          if (((x / s + y / s) | 0) % 2 === 0) ctx.fillRect(x, y, s, s);
        }
      }
    } else if (opt.textureType === "stripes") {
      ctx.fillStyle = shadeColor(opt.color, -15);
      const s = 256 / (opt.repeat ?? 4);
      for (let x = 0; x < 256; x += s * 2) ctx.fillRect(x, 0, s, 256);
    } else if (opt.textureType === "plank") {
      ctx.fillStyle = shadeColor(opt.color, -25);
      const s = 256 / (opt.repeat ?? 3);
      for (let y = 0; y < 256; y += s) {
        ctx.fillRect(0, y, 256, 2);
        const offset = (y / s) % 2 === 0 ? 0 : s / 2;
        ctx.fillRect(offset, y, 2, s);
      }
    } else if (opt.textureType === "brick") {
      ctx.fillStyle = shadeColor(opt.color, -30);
      const brickH = 256 / (opt.repeat ?? 6);
      const brickW = brickH * 2;
      for (let y = 0; y < 256; y += brickH) {
        const offset = (y / brickH) % 2 === 0 ? 0 : brickW / 2;
        for (let x = -brickW; x < 256; x += brickW) {
          ctx.strokeStyle = shadeColor(opt.color, -30);
          ctx.lineWidth = 2;
          ctx.strokeRect(x + offset, y, brickW, brickH);
        }
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(opt.repeat ?? 1, opt.repeat ?? 1);
    mat.map = tex;
  }
  return mat;
}

function shadeColor(color: string, percent: number): string {
  const c = new THREE.Color(color);
  const factor = 1 + percent / 100;
  c.r = Math.max(0, Math.min(1, c.r * factor));
  c.g = Math.max(0, Math.min(1, c.g * factor));
  c.b = Math.max(0, Math.min(1, c.b * factor));
  return `#${c.getHexString()}`;
}
