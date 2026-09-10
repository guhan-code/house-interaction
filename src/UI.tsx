import { useState, useEffect } from "react";
import { useStore } from "./store";
import {
  FLOOR_OPTIONS,
  WALL_OPTIONS,
  ROOF_OPTIONS,
  DOOR_OPTIONS,
  WINDOW_OPTIONS,
  type ElementType,
  type MaterialOption,
  type DoorOption,
  type WindowOption,
} from "./materials";

const ELEMENT_LABELS: Record<ElementType, string> = {
  floor: "Floor",
  wall: "Walls",
  roof: "Roof",
  door: "Door",
  window: "Windows",
};

export function CustomizationPanel() {
  const selectedElement = useStore((s) => s.selectedElement);
  const config = useStore((s) => s.config);
  const setOption = useStore((s) => s.setOption);
  const selectElement = useStore((s) => s.selectElement);
  const resetConfig = useStore((s) => s.resetConfig);
  const toggleNight = useStore((s) => s.toggleNight);
  const isNight = useStore((s) => s.isNight);

  if (!selectedElement) return null;

  const el = selectedElement;

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Customize {ELEMENT_LABELS[el]}</h2>
        <button style={closeBtnStyle} onClick={() => selectElement(null)}>
          ✕
        </button>
      </div>

      {el === "floor" && (
        <SwatchGrid
          options={FLOOR_OPTIONS}
          selectedId={config.floor}
          onSelect={(id) => setOption("floor", id)}
        />
      )}
      {el === "wall" && (
        <SwatchGrid
          options={WALL_OPTIONS}
          selectedId={config.wall}
          onSelect={(id) => setOption("wall", id)}
        />
      )}
      {el === "roof" && (
        <SwatchGrid
          options={ROOF_OPTIONS}
          selectedId={config.roof}
          onSelect={(id) => setOption("roof", id)}
        />
      )}
      {el === "door" && (
        <DoorSwatchGrid
          options={DOOR_OPTIONS}
          selectedId={config.door}
          onSelect={(id) => setOption("door", id)}
        />
      )}
      {el === "window" && (
        <WindowSwatchGrid
          options={WINDOW_OPTIONS}
          selectedId={config.window}
          onSelect={(id) => setOption("window", id)}
        />
      )}
    </div>
  );
}

function SwatchGrid({
  options,
  selectedId,
  onSelect,
}: {
  options: MaterialOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div style={gridStyle}>
      {options.map((opt) => (
        <button
          key={opt.id}
          style={{
            ...swatchStyle,
            background: opt.color,
            outline: selectedId === opt.id ? "3px solid #ffcc00" : "none",
            transform: selectedId === opt.id ? "scale(1.05)" : "scale(1)",
          }}
          onClick={() => onSelect(opt.id)}
          title={opt.label}
        >
          <span style={swatchLabelStyle}>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

function DoorSwatchGrid({
  options,
  selectedId,
  onSelect,
}: {
  options: DoorOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div style={gridStyle}>
      {options.map((opt) => (
        <button
          key={opt.id}
          style={{
            ...doorSwatchStyle,
            background: opt.color,
            outline: selectedId === opt.id ? "3px solid #ffcc00" : "none",
            transform: selectedId === opt.id ? "scale(1.05)" : "scale(1)",
          }}
          onClick={() => onSelect(opt.id)}
          title={opt.label}
        >
          <span style={swatchLabelStyle}>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

function WindowSwatchGrid({
  options,
  selectedId,
  onSelect,
}: {
  options: WindowOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div style={gridStyle}>
      {options.map((opt) => (
        <button
          key={opt.id}
          style={{
            ...windowSwatchStyle,
            background: opt.frameColor,
            outline: selectedId === opt.id ? "3px solid #ffcc00" : "none",
            transform: selectedId === opt.id ? "scale(1.05)" : "scale(1)",
          }}
          onClick={() => onSelect(opt.id)}
          title={opt.label}
        >
          <span style={swatchLabelStyle}>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

export function ControlBar() {
  const resetConfig = useStore((s) => s.resetConfig);
  const toggleNight = useStore((s) => s.toggleNight);
  const isNight = useStore((s) => s.isNight);
  const selectElement = useStore((s) => s.selectElement);
  const [showSave, setShowSave] = useState(false);
  const [showLoad, setShowLoad] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  const saveDesign = useStore((s) => s.saveDesign);
  const fetchDesigns = useStore((s) => s.fetchDesigns);
  const savedDesigns = useStore((s) => s.savedDesigns);
  const loadConfig = useStore((s) => s.loadConfig);
  const deleteDesign = useStore((s) => s.deleteDesign);

  useEffect(() => {
    if (showLoad) fetchDesigns();
  }, [showLoad, fetchDesigns]);

  const handleSave = async () => {
    if (!saveName.trim()) return;
    setSaveStatus("Saving...");
    try {
      await saveDesign(saveName.trim());
      setSaveStatus("Saved!");
      setSaveName("");
      setTimeout(() => {
        setShowSave(false);
        setSaveStatus("");
      }, 1000);
    } catch {
      setSaveStatus("Failed to save");
    }
  };

  return (
    <>
      <div style={controlBarStyle}>
        <div style={brandStyle}>
          <span style={brandIconStyle}>▣</span>
          VR Building Customizer
        </div>
        <div style={buttonGroupStyle}>
          <button
            style={btnStyle}
            onClick={() => selectElement("floor")}
          >
            Floor
          </button>
          <button
            style={btnStyle}
            onClick={() => selectElement("wall")}
          >
            Walls
          </button>
          <button
            style={btnStyle}
            onClick={() => selectElement("door")}
          >
            Door
          </button>
          <button
            style={btnStyle}
            onClick={() => selectElement("window")}
          >
            Windows
          </button>
          <button
            style={btnStyle}
            onClick={() => selectElement("roof")}
          >
            Roof
          </button>
          <div style={dividerStyle} />
          <button style={btnStyle} onClick={toggleNight}>
            {isNight ? "☀ Day" : "☾ Night"}
          </button>
          <button style={btnStyle} onClick={resetConfig}>
            ↺ Reset
          </button>
          <button style={btnStyle} onClick={() => setShowSave(true)}>
            💾 Save
          </button>
          <button style={btnStyle} onClick={() => setShowLoad(true)}>
            📂 Load
          </button>
        </div>
      </div>

      {showSave && (
        <div style={modalOverlayStyle} onClick={() => setShowSave(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={modalTitleStyle}>Save Design</h3>
            <input
              style={inputStyle}
              placeholder="Design name..."
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
            <div style={modalBtnRowStyle}>
              <button style={btnStyle} onClick={handleSave}>
                Save
              </button>
              <button style={btnStyle} onClick={() => setShowSave(false)}>
                Cancel
              </button>
            </div>
            {saveStatus && <p style={statusStyle}>{saveStatus}</p>}
          </div>
        </div>
      )}

      {showLoad && (
        <div style={modalOverlayStyle} onClick={() => setShowLoad(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={modalTitleStyle}>Load Design</h3>
            {savedDesigns.length === 0 ? (
              <p style={emptyStyle}>No saved designs yet.</p>
            ) : (
              <div style={designListStyle}>
                {savedDesigns.map((d) => (
                  <div key={d.id} style={designItemStyle}>
                    <span style={designNameStyle}>{d.name}</span>
                    <div>
                      <button
                        style={smallBtnStyle}
                        onClick={() => {
                          loadConfig(d.config);
                          setShowLoad(false);
                        }}
                      >
                        Load
                      </button>
                      <button
                        style={smallBtnDangerStyle}
                        onClick={() => deleteDesign(d.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={modalBtnRowStyle}>
              <button style={btnStyle} onClick={() => setShowLoad(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// --- Styles ---
const panelStyle: React.CSSProperties = {
  position: "absolute",
  top: "80px",
  right: "20px",
  width: "320px",
  background: "rgba(20, 22, 30, 0.95)",
  borderRadius: "16px",
  padding: "20px",
  zIndex: 100,
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  backdropFilter: "blur(10px)",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "18px",
  fontWeight: 600,
  color: "#e8e8f0",
};

const closeBtnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.1)",
  border: "none",
  borderRadius: "8px",
  color: "#ccc",
  width: "32px",
  height: "32px",
  cursor: "pointer",
  fontSize: "16px",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
};

const swatchStyle: React.CSSProperties = {
  height: "64px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  transition: "transform 0.2s, outline 0.2s",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  padding: "6px",
  position: "relative",
};

const doorSwatchStyle: React.CSSProperties = {
  ...swatchStyle,
};

const windowSwatchStyle: React.CSSProperties = {
  ...swatchStyle,
};

const swatchLabelStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 600,
  color: "#fff",
  textShadow: "0 1px 3px rgba(0,0,0,0.8)",
  background: "rgba(0,0,0,0.3)",
  padding: "2px 8px",
  borderRadius: "6px",
  whiteSpace: "nowrap",
};

const controlBarStyle: React.CSSProperties = {
  position: "absolute",
  top: "0",
  left: "0",
  right: "0",
  height: "60px",
  background: "rgba(15, 17, 25, 0.95)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 24px",
  zIndex: 100,
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(10px)",
};

const brandStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 700,
  color: "#e8e8f0",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const brandIconStyle: React.CSSProperties = {
  fontSize: "24px",
  color: "#4a9eda",
};

const buttonGroupStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const btnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "10px",
  color: "#e8e8f0",
  padding: "8px 16px",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
  transition: "background 0.2s, transform 0.1s",
};

const dividerStyle: React.CSSProperties = {
  width: "1px",
  height: "28px",
  background: "rgba(255,255,255,0.15)",
  margin: "0 4px",
};

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 200,
  backdropFilter: "blur(4px)",
};

const modalStyle: React.CSSProperties = {
  background: "rgba(20, 22, 30, 0.98)",
  borderRadius: "16px",
  padding: "28px",
  minWidth: "360px",
  maxWidth: "500px",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "0 12px 48px rgba(0,0,0,0.5)",
};

const modalTitleStyle: React.CSSProperties = {
  margin: "0 0 20px 0",
  fontSize: "20px",
  fontWeight: 600,
  color: "#e8e8f0",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.05)",
  color: "#e8e8f0",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const modalBtnRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  marginTop: "16px",
};

const statusStyle: React.CSSProperties = {
  marginTop: "12px",
  color: "#4a9eda",
  fontSize: "14px",
};

const emptyStyle: React.CSSProperties = {
  color: "#888",
  fontSize: "14px",
  textAlign: "center",
  padding: "20px 0",
};

const designListStyle: React.CSSProperties = {
  maxHeight: "300px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const designItemStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 16px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.05)",
};

const designNameStyle: React.CSSProperties = {
  color: "#e8e8f0",
  fontSize: "15px",
  fontWeight: 500,
};

const smallBtnStyle: React.CSSProperties = {
  background: "rgba(74, 158, 218, 0.2)",
  border: "1px solid rgba(74, 158, 218, 0.3)",
  borderRadius: "8px",
  color: "#4a9eda",
  padding: "6px 14px",
  fontSize: "13px",
  cursor: "pointer",
  marginRight: "6px",
};

const smallBtnDangerStyle: React.CSSProperties = {
  background: "rgba(218, 74, 74, 0.15)",
  border: "1px solid rgba(218, 74, 74, 0.3)",
  borderRadius: "8px",
  color: "#da4a4a",
  padding: "6px 14px",
  fontSize: "13px",
  cursor: "pointer",
};
