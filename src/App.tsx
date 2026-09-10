import { Scene } from "./Scene";
import { CustomizationPanel, ControlBar } from "./UI";

export function App() {
  return (
    <>
      <Scene />
      <ControlBar />
      <CustomizationPanel />
      <Instructions />
    </>
  );
}

function Instructions() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        background: "rgba(20, 22, 30, 0.9)",
        borderRadius: "12px",
        padding: "14px 18px",
        zIndex: 100,
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        maxWidth: "280px",
      }}
    >
      <p
        style={{
          margin: "0 0 8px 0",
          fontSize: "13px",
          fontWeight: 600,
          color: "#4a9eda",
        }}
      >
        How to use
      </p>
      <p
        style={{
          margin: 0,
          fontSize: "12px",
          lineHeight: "1.6",
          color: "#aaa",
        }}
      >
        Click any part of the building to select it. Use the panel to swap
        materials and styles. Drag to orbit, scroll to zoom. Click "Enter VR"
        for immersive mode if you have a VR headset.
      </p>
    </div>
  );
}
