import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface FlowSelectorProps {
  configId: string;
  flows: string[];
  currentFlow: string;
  onFlowChange: (flowId: string) => void;
  onFlowCreate: (newFlow: string) => void;
}

const FlowSelector = ({ configId, flows, currentFlow, onFlowChange, onFlowCreate }: FlowSelectorProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFlowName, setNewFlowName] = useState("");
  const router = useRouter();

  const handleFlowChange = (flowId: string) => {
    onFlowChange(flowId);
    // Update URL with new flowId
    router.push(`/canvas/editor/${configId}?flowId=${flowId}`);
  };

  const handleCreateFlow = async () => {
    if (!newFlowName.trim()) return;

    try {
      const response = await fetch(`/api/family-tree/flows/${configId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flowId: newFlowName.trim(),
          configId: configId
        }),
      });

      if (response.ok) {
        onFlowCreate(newFlowName.trim());
        setNewFlowName("");
        setIsCreating(false);
        handleFlowChange(newFlowName.trim());
      } else {
        alert("Failed to create flow");
      }
    } catch (error) {
      console.error('Error creating flow:', error);
      alert("Error creating flow");
    }
  };

  return (
    <div style={{
      marginBottom: "20px",
      padding: "15px",
      background: "#f8f9fa",
      borderRadius: "8px",
      border: "1px solid #dee2e6"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "10px" }}>
        <span style={{ fontWeight: "600", color: "#495057" }}>Current Flow:</span>
        <select
          value={currentFlow}
          onChange={(e) => handleFlowChange(e.target.value)}
          style={{
            padding: "5px 10px",
            borderRadius: "4px",
            border: "1px solid #ced4da",
            background: "white"
          }}
        >
          {flows.map(flow => (
            <option key={flow} value={flow}>{flow}</option>
          ))}
        </select>
        
        <button
          onClick={() => setIsCreating(true)}
          style={{
            padding: "5px 15px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px"
          }}
        >
          + New Flow
        </button>
      </div>

      {isCreating && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="text"
            placeholder="Enter flow name"
            value={newFlowName}
            onChange={(e) => setNewFlowName(e.target.value)}
            style={{
              padding: "5px 10px",
              borderRadius: "4px",
              border: "1px solid #ced4da",
              flex: 1
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateFlow()}
          />
          <button
            onClick={handleCreateFlow}
            style={{
              padding: "5px 10px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            Create
          </button>
          <button
            onClick={() => {
              setIsCreating(false);
              setNewFlowName("");
            }}
            style={{
              padding: "5px 10px",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default FlowSelector;