import React from "react";
import { useEditor } from "@craftjs/core";
import { Button, TextComponent, InputField, Label, InnerContainer } from "./EditorComponents";

// Create wrapper components that don't require props
const DefaultTextComponent = () => <TextComponent text="Default Text" />;
const DefaultInputField = () => <InputField placeholder="Enter text..." />;
const DefaultButton = () => <Button text="Default Button" />;
const DefaultLabel = () => <Label text="Default Label" />;
const DefaultInnerContainer = () => <InnerContainer />;

const Toolbox = () => {
  const { connectors } = useEditor();

  return (
    <div
      style={{
        width: "100%",
        background: "transparent",
        padding: "0",
        height: "100%",
      }}
    >
      <div style={{ padding: "15px" }}>
        <div
          ref={(ref) => {
            if (ref) {
              connectors.create(ref, DefaultButton);
            }
          }}
          style={{
            padding: "12px",
            margin: "8px 0",
            background: "#007bff",
            color: "white",
            cursor: "grab",
            borderRadius: "8px",
            textAlign: "center",
            fontWeight: "600",
            fontSize: "14px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
          }}
        >
        Button
      </div>

      <div
        ref={(ref) => {
          if (ref) {
            connectors.create(ref, DefaultTextComponent);
          }
        }}
        style={{
          padding: "12px",
          margin: "8px 0",
          background: "#28a745",
          color: "white",
          cursor: "grab",
          borderRadius: "8px",
          textAlign: "center",
          fontWeight: "600",
          fontSize: "14px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        }}
      >
        Text Component
      </div>

      <div
        ref={(ref) => {
          if (ref) {
            connectors.create(ref, DefaultInputField);
          }
        }}
        style={{
          padding: "12px",
          margin: "8px 0",
          background: "#ffc107",
          color: "#212529",
          cursor: "grab",
          borderRadius: "8px",
          textAlign: "center",
          fontWeight: "600",
          fontSize: "14px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        }}
      >
        Input Field
      </div>

      <div
        ref={(ref) => {
          if (ref) {
            connectors.create(ref, DefaultLabel);
          }
        }}
        style={{
          padding: "12px",
          margin: "8px 0",
          background: "#8b5cf6",
          color: "white",
          cursor: "grab",
          borderRadius: "8px",
          textAlign: "center",
          fontWeight: "600",
          fontSize: "14px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        }}
      >
        Label
      </div>

      <div
        ref={(ref) => {
          if (ref) {
            connectors.create(ref, DefaultInnerContainer);
          }
        }}
        style={{
          padding: "12px",
          margin: "8px 0",
          background: "#6f42c1",
          color: "white",
          cursor: "grab",
          borderRadius: "8px",
          textAlign: "center",
          fontWeight: "600",
          fontSize: "14px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        }}
      >
        Inner Container
      </div>
      </div>
    </div>
  );
};

export default Toolbox;