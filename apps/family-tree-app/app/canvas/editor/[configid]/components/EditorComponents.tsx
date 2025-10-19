import React from "react";
import { useNode, Element } from "@craftjs/core";

export const Button = ({ text = "Button", style = {} }: { text?: string, style?: React.CSSProperties }) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp }
  } = useNode((state) => ({ selected: state.events.selected }));

  return (
    <button
      ref={(ref) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      style={{
        padding: "10px 20px",
        background: selected ? "#0056b3" : "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        minWidth: "100px",
        ...style
      }}
    >
      {text}
    </button>
  );
};

// Add craft settings for Button
Button.craft = {
  displayName: "Button",
  props: {
    text: "Button",
    style: {}
  },
  related: {
    settings: () => <div>Button Settings</div>
  }
};

export const TextComponent = ({ text = "Text", style = {} }: { text?: string, style?: React.CSSProperties }) => {
  const {
    connectors: { connect, drag },
    selected
  } = useNode((state) => ({ selected: state.events.selected }));

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      style={{
        padding: "10px",
        border: selected ? "2px solid #007bff" : "1px solid transparent",
        borderRadius: "4px",
        minHeight: "40px",
        backgroundColor: "white",
        color: "#1f2937",
        fontSize: "14px",
        ...style
      }}
    >
      <p style={{ margin: 0, color: "#1f2937" }}>{text}</p>
    </div>
  );
};

// Add craft settings for TextComponent
TextComponent.craft = {
  displayName: "Text",
  props: {
    text: "Text",
    style: {}
  },
  related: {
    settings: () => <div>Text Settings</div>
  }
};

export const InputField = ({ placeholder = "Enter text...", style = {} }: { placeholder?: string, style?: React.CSSProperties }) => {
  const {
    connectors: { connect, drag },
    selected
  } = useNode((state) => ({ selected: state.events.selected }));

  return (
    <input
      ref={(ref) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      type="text"
      placeholder={placeholder}
      style={{
        padding: "8px 12px",
        border: selected ? "2px solid #007bff" : "1px solid #d1d5db",
        borderRadius: "4px",
        width: "200px",
        backgroundColor: "white",
        color: "#1f2937",
        fontSize: "14px",
        ...style
      }}
    />
  );
};

// Add craft settings for InputField
InputField.craft = {
  displayName: "Input Field",
  props: {
    placeholder: "Enter text...",
    style: {}
  },
  related: {
    settings: () => <div>Input Settings</div>
  }
};

export const Label = ({ text = "Label", htmlFor = "", style = {} }: { text?: string, htmlFor?: string, style?: React.CSSProperties }) => {
  const {
    connectors: { connect, drag },
    selected
  } = useNode((state) => ({ selected: state.events.selected }));

  return (
    <label
      ref={(ref) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      htmlFor={htmlFor}
      style={{
        display: "block",
        padding: "8px 4px",
        border: selected ? "2px solid #8b5cf6" : "1px solid transparent",
        borderRadius: "4px",
        backgroundColor: selected ? "rgba(139, 92, 246, 0.1)" : "transparent",
        color: "#374151",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
        userSelect: "none",
        ...style
      }}
    >
      {text}
    </label>
  );
};

// Add craft settings for Label
Label.craft = {
  displayName: "Label",
  props: {
    text: "Label",
    htmlFor: "",
    style: {}
  },
  related: {
    settings: () => <div>Label Settings</div>
  }
};

export const Container = ({ children, style = {} }: { children?: React.ReactNode, style?: React.CSSProperties }) => {
  const {
    connectors: { connect, drag },
    selected
  } = useNode((state) => ({ selected: state.events.selected }));

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      style={{
        padding: "20px",
        border: selected ? "2px solid #007bff" : "2px dashed #d1d5db",
        borderRadius: "8px",
        width: "100%",
        height: "calc(100vh - 120px)",
        minHeight: "calc(100vh - 120px)",
        backgroundColor: "#ffffff",
        boxSizing: "border-box",
        position: "relative",
        ...style
      }}
    >
      {children || (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#9ca3af",
          fontSize: "16px",
          fontWeight: "500",
          textAlign: "center",
          pointerEvents: "none"
        }}>
          Drop components here
        </div>
      )}
    </div>
  );
};

// Add craft settings for Container
Container.craft = {
  displayName: "Container",
  props: {
    style: {}
  },
  related: {
    settings: () => <div>Container Settings</div>
  }
};

export const InnerContainer = ({ children, style = {} }: { children?: React.ReactNode, style?: React.CSSProperties }) => {
  const {
    connectors: { connect, drag },
    selected,
    hasChildNodes
  } = useNode((state) => ({ 
    selected: state.events.selected,
    hasChildNodes: state.data.nodes && state.data.nodes.length > 0
  }));

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      style={{
        padding: "15px",
        border: selected ? "2px solid #10b981" : "1px dashed #10b981",
        borderRadius: "6px",
        minHeight: "80px",
        backgroundColor: "#f0fdf4",
        margin: "8px",
        position: "relative",
        ...style
      }}
    >
      <Element id="inner_drop_zone" is="div" canvas style={{ minHeight: "50px", padding: "10px" }}>
        {children}
        {!children && !hasChildNodes && (
          <div style={{
            color: "#059669",
            fontSize: "14px",
            fontWeight: "500",
            textAlign: "center",
            padding: "10px",
            fontStyle: "italic",
            pointerEvents: "none"
          }}>
          </div>
        )}
      </Element>
    </div>
  );
};

// Add craft settings for InnerContainer
InnerContainer.craft = {
  displayName: "Inner Container",
  props: {
    style: {}
  },
  related: {
    settings: () => <div>Inner Container Settings</div>
  }
};