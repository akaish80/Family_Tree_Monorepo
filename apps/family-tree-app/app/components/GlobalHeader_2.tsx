"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Config {
  _id: string;
  name: string;
}

interface Flow {
  _id: string;
  configId: string;
  flowName: string;
}

const GlobalHeader = () => {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [flows, setFlows] = useState<Flow[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<string>("");
  const [selectedFlow, setSelectedFlow] = useState<string>("");
  const [showCreateConfig, setShowCreateConfig] = useState(false);
  const [showCreateFlow, setShowCreateFlow] = useState(false);
  const [newConfigName, setNewConfigName] = useState("");
  const [newFlowName, setNewFlowName] = useState("");
  const [loading, setLoading] = useState(false);

  // Load configurations on mount
  useEffect(() => {
    loadConfigs();
  }, []);

  // Load flows when config is selected
  useEffect(() => {
    if (selectedConfig) {
      loadFlows(selectedConfig);
    }
  }, [selectedConfig]);

  const loadConfigs = async () => {
    try {
      const response = await fetch("/api/family-tree/configs");
      const data = await response.json();
      setConfigs(data.configs || []);
    } catch (error) {
      console.error("Error loading configs:", error);
    }
  };

  const loadFlows = async (configId: string) => {
    try {
      const response = await fetch(`/api/family-tree/flows?configId=${configId}`);
      const data = await response.json();
      setFlows(data.flows || []);
    } catch (error) {
      console.error("Error loading flows:", error);
    }
  };

  const createConfig = async () => {
    if (!newConfigName.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/family-tree/configs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newConfigName.trim() }),
      });
      
      if (response.ok) {
        setNewConfigName("");
        setShowCreateConfig(false);
        loadConfigs();
      }
    } catch (error) {
      console.error("Error creating config:", error);
    } finally {
      setLoading(false);
    }
  };

  const createFlow = async () => {
    if (!newFlowName.trim() || !selectedConfig) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/family-tree/flows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          configId: selectedConfig, 
          flowName: newFlowName.trim() 
        }),
      });
      
      if (response.ok) {
        setNewFlowName("");
        setShowCreateFlow(false);
        loadFlows(selectedConfig);
      }
    } catch (error) {
      console.error("Error creating flow:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "60px",
      background: "#ffffff",
      borderBottom: "1px solid #ddd",
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
      gap: "20px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      zIndex: 1000
    }}>
      {/* Logo/Title */}
      <div style={{
        fontSize: "18px",
        fontWeight: "bold",
        color: "#333"
      }}>
        Family Tree Builder
      </div>

      {/* Configuration Selector */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <label style={{ fontSize: "14px", color: "#666" }}>Configuration:</label>
        <select
          value={selectedConfig}
          onChange={(e) => setSelectedConfig(e.target.value)}
          style={{
            padding: "5px 10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px"
          }}
        >
          <option value="">Select Configuration</option>
          {configs.map((config) => (
            <option key={config._id} value={config._id}>
              {config.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowCreateConfig(true)}
          style={{
            padding: "5px 10px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "12px",
            cursor: "pointer"
          }}
        >
          + New
        </button>
      </div>

      {/* Flow Selector */}
      {selectedConfig && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ fontSize: "14px", color: "#666" }}>Flow:</label>
          <select
            value={selectedFlow}
            onChange={(e) => setSelectedFlow(e.target.value)}
            style={{
              padding: "5px 10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px"
            }}
          >
            <option value="">Select Flow</option>
            {flows.map((flow) => (
              <option key={flow._id} value={flow._id}>
                {flow.flowName}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowCreateFlow(true)}
            style={{
              padding: "5px 10px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              cursor: "pointer"
            }}
          >
            + New
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
        {selectedConfig && (
          <Link href={`/flow/${selectedConfig}`}>
            <button style={{
              padding: "8px 16px",
              background: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "14px",
              cursor: "pointer"
            }}>
              App Flow
            </button>
          </Link>
        )}
        
        {selectedConfig && selectedFlow && (
          <Link href={`/canvas/editor/${selectedConfig}?flowId=${selectedFlow}`}>
            <button style={{
              padding: "8px 16px",
              background: "#6f42c1",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "14px",
              cursor: "pointer"
            }}>
              Canvas Editor
            </button>
          </Link>
        )}
      </div>

      {/* Create Config Modal */}
      {showCreateConfig && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000
        }}>
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            minWidth: "300px"
          }}>
            <h3>Create New Configuration</h3>
            <input
              type="text"
              placeholder="Configuration name"
              value={newConfigName}
              onChange={(e) => setNewConfigName(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                margin: "10px 0",
                border: "1px solid #ccc",
                borderRadius: "4px"
              }}
            />
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowCreateConfig(false)}
                style={{
                  padding: "8px 16px",
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={createConfig}
                disabled={loading || !newConfigName.trim()}
                style={{
                  padding: "8px 16px",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  opacity: loading || !newConfigName.trim() ? 0.6 : 1
                }}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Flow Modal */}
      {showCreateFlow && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000
        }}>
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            minWidth: "300px"
          }}>
            <h3>Create New Flow</h3>
            <input
              type="text"
              placeholder="Flow name"
              value={newFlowName}
              onChange={(e) => setNewFlowName(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                margin: "10px 0",
                border: "1px solid #ccc",
                borderRadius: "4px"
              }}
            />
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowCreateFlow(false)}
                style={{
                  padding: "8px 16px",
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={createFlow}
                disabled={loading || !newFlowName.trim()}
                style={{
                  padding: "8px 16px",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  opacity: loading || !newFlowName.trim() ? 0.6 : 1
                }}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default GlobalHeader;