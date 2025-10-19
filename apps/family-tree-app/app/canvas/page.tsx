"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./canvas.module.scss";

interface Config {
  id: string;
  name: string;
}

interface Flow {
  id: string;
  configId: string;
  flowName: string;
  description?: string;
  nodes?: any[];
  edges?: any[];
  startNode?: string;
  updatedNode?: any[];
  createdAt?: string;
  updatedAt?: string;
}

interface Canvas {
  id: string;
  configId: string;
  flowId: string;
  canvasName: string;
  canvasDescription: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (canvasData: {
    configId: string;
    flowId: string;
    canvasName: string;
    canvasDescription: string;
  }) => void;
  configs: Config[];
  flows: Flow[];
  loading: boolean;
}

function CreateCanvasModal({ isOpen, onClose, onSave, configs, flows, loading }: CreateCanvasModalProps) {
  const [selectedConfigId, setSelectedConfigId] = useState("");
  const [selectedFlowId, setSelectedFlowId] = useState("");
  const [canvasName, setCanvasName] = useState("");
  const [canvasDescription, setCanvasDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredFlows = flows.filter(flow => flow.configId === selectedConfigId);
  
  // Debug logging
  console.log("All flows:", flows);
  console.log("Selected config ID:", selectedConfigId);
  console.log("Filtered flows:", filteredFlows);

  const handleSave = async () => {
    if (!selectedConfigId || !selectedFlowId || !canvasName.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        configId: selectedConfigId,
        flowId: selectedFlowId,
        canvasName: canvasName.trim(),
        canvasDescription: canvasDescription.trim(),
      });
      
      // Reset form
      setSelectedConfigId("");
      setSelectedFlowId("");
      setCanvasName("");
      setCanvasDescription("");
      onClose();
    } catch (error) {
      console.error("Error saving canvas:", error);
      alert("Failed to save canvas. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Create New Canvas</h2>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Configuration *</label>
          <select 
            className={styles.select}
            value={selectedConfigId}
            onChange={(e) => {
              setSelectedConfigId(e.target.value);
              setSelectedFlowId(""); // Reset flow selection when config changes
            }}
          >
            <option value="">Select Configuration</option>
            {configs.map((config) => (
              <option key={config.id} value={config.id}>
                {config.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>App Flow *</label>
          <select 
            className={styles.select}
            value={selectedFlowId}
            onChange={(e) => setSelectedFlowId(e.target.value)}
            disabled={!selectedConfigId || filteredFlows.length === 0}
          >
            <option value="">
              {!selectedConfigId 
                ? "Select Configuration First" 
                : filteredFlows.length === 0 
                  ? "No flows available for this configuration" 
                  : "Select App Flow"
              }
            </option>
            {filteredFlows.map((flow) => (
              <option key={flow.id} value={flow.id}>
                {flow.flowName}
              </option>
            ))}
          </select>
          {selectedConfigId && (
            <small style={{ color: '#6c757d', marginTop: '4px', display: 'block' }}>
              Found {filteredFlows.length} flow(s) for selected configuration
            </small>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Canvas Name *</label>
          <input
            type="text"
            className={styles.input}
            value={canvasName}
            onChange={(e) => setCanvasName(e.target.value)}
            placeholder="Enter canvas name"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Canvas Description</label>
          <textarea
            className={styles.textarea}
            value={canvasDescription}
            onChange={(e) => setCanvasDescription(e.target.value)}
            placeholder="Enter canvas description (optional)"
            rows={3}
          />
        </div>

        <div className={styles.modalActions}>
          <button 
            className={`${styles.ctaBtn} ${styles.cancelBtn}`}
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button 
            className={styles.ctaBtn}
            onClick={handleSave}
            disabled={saving || !selectedConfigId || !selectedFlowId || !canvasName.trim()}
          >
            {saving ? "Saving..." : "Save Canvas"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CanvasLandingPage() {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [flows, setFlows] = useState<Flow[]>([]);
  const [canvas, setCanvas] = useState<Canvas[]>([]);
  const [filteredCanvas, setFilteredCanvas] = useState<Canvas[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter states
  const [selectedConfigFilter, setSelectedConfigFilter] = useState("");
  const [selectedFlowFilter, setSelectedFlowFilter] = useState("");
  const [canvasNameFilter, setCanvasNameFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch configs
        const configResponse = await fetch("/api/family-tree/configs");
        if (!configResponse.ok) {
          throw new Error(`Config API error: ${configResponse.status}`);
        }
        const configData = await configResponse.json();
        console.log("Config data:", configData);
        setConfigs(configData || []);

        // Fetch flows
        const flowResponse = await fetch("/api/family-tree/flows");
        if (!flowResponse.ok) {
          throw new Error(`Flow API error: ${flowResponse.status}`);
        }
        const flowData = await flowResponse.json();
        console.log("Flow data:", flowData);
        setFlows(flowData.flows || []);

        // Fetch canvas
        const canvasResponse = await fetch("/api/family-tree/canvas");
        if (!canvasResponse.ok) {
          console.warn("Canvas API error:", canvasResponse.status, "- This is expected if no canvas exist yet");
        }
        const canvasData = await canvasResponse.json();
        console.log("Canvas data:", canvasData);
        setCanvas(canvasData.canvas || []);
        setFilteredCanvas(canvasData.canvas || []);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter canvas based on selected filters
  useEffect(() => {
    let filtered = canvas;

    if (selectedConfigFilter) {
      filtered = filtered.filter(c => c.configId === selectedConfigFilter);
    }

    if (selectedFlowFilter) {
      filtered = filtered.filter(c => c.flowId === selectedFlowFilter);
    }

    if (canvasNameFilter) {
      filtered = filtered.filter(c => 
        c.canvasName.toLowerCase().includes(canvasNameFilter.toLowerCase())
      );
    }

    setFilteredCanvas(filtered);
  }, [canvas, selectedConfigFilter, selectedFlowFilter, canvasNameFilter]);

  const handleCreateCanvas = async (canvasData: {
    configId: string;
    flowId: string;
    canvasName: string;
    canvasDescription: string;
  }) => {
    try {
      const response = await fetch("/api/family-tree/canvas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(canvasData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create canvas");
      }

      const result = await response.json();
      
      // Add the new canvas to the list
      setCanvas(prev => [...prev, result.canvas]);
      
      alert("Canvas created successfully!");
    } catch (error) {
      console.error("Error creating canvas:", error);
      alert(`Failed to create canvas: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  const getConfigName = (configId: string) => {
    const config = configs.find(c => c.id === configId);
    return config ? config.name : configId;
  };

  const getFlowName = (flowId: string) => {
    const flow = flows.find(f => f.id === flowId);
    return flow ? flow.flowName : flowId;
  };

  const filteredFlowsForFilter = flows.filter(flow => 
    selectedConfigFilter ? flow.configId === selectedConfigFilter : true
  );

  console.log("Main page - selectedConfigFilter:", selectedConfigFilter);
  console.log("Main page - filteredFlowsForFilter:", filteredFlowsForFilter);

  return (
    <div className={styles.wrapper}>
      <div className={styles.canvasContainer}>
        <h1 className={styles.heading}>Canvas Management</h1>
        <p className={styles.subheading}>Manage your canvas configurations</p>
        
        {/* Create Canvas Button */}
        <div className={styles.createSection}>
          <button 
            className={styles.ctaBtn}
            onClick={() => setIsModalOpen(true)}
          >
            Create New Canvas
          </button>
        </div>

        {/* Filters */}
        <div className={styles.filtersSection}>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Configuration</label>
              <select 
                className={styles.filterSelect}
                value={selectedConfigFilter}
                onChange={(e) => {
                  setSelectedConfigFilter(e.target.value);
                  setSelectedFlowFilter(""); // Reset flow filter when config changes
                }}
              >
                <option value="">All Configurations</option>
                {configs.map((config) => (
                  <option key={config.id} value={config.id}>
                    {config.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>App Flow</label>
              <select 
                className={styles.filterSelect}
                value={selectedFlowFilter}
                onChange={(e) => setSelectedFlowFilter(e.target.value)}
              >
                <option value="">All Flows</option>
                {filteredFlowsForFilter.map((flow) => (
                  <option key={flow.id} value={flow.id}>
                    {flow.flowName}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Canvas Name</label>
              <input
                type="text"
                className={styles.filterInput}
                value={canvasNameFilter}
                onChange={(e) => setCanvasNameFilter(e.target.value)}
                placeholder="Filter by canvas name"
              />
            </div>
          </div>
        </div>

        {/* Canvas List */}
        <div className={styles.canvasListSection}>
          {loading ? (
            <div className={styles.loadingMessage}>Loading canvas...</div>
          ) : filteredCanvas.length === 0 ? (
            <div className={styles.emptyMessage}>
              {canvas.length === 0 
                ? "No canvas found. Create your first canvas to get started." 
                : "No canvas match the current filters."}
            </div>
          ) : (
            <div className={styles.canvasTable}>
              <div className={styles.tableHeader}>
                <div className={styles.tableHeaderCell}>Canvas Name</div>
                <div className={styles.tableHeaderCell}>Configuration</div>
                <div className={styles.tableHeaderCell}>App Flow</div>
                <div className={styles.tableHeaderCell}>Description</div>
                <div className={styles.tableHeaderCell}>Created</div>
                <div className={styles.tableHeaderCell}>Actions</div>
              </div>
              
              {filteredCanvas.map((canvasItem) => (
                <div key={canvasItem.id} className={styles.tableRow}>
                  <div className={styles.tableCell}>
                    <strong>{canvasItem.canvasName}</strong>
                  </div>
                  <div className={styles.tableCell}>
                    {getConfigName(canvasItem.configId)}
                  </div>
                  <div className={styles.tableCell}>
                    {getFlowName(canvasItem.flowId)}
                  </div>
                  <div className={styles.tableCell}>
                    {canvasItem.canvasDescription || "No description"}
                  </div>
                  <div className={styles.tableCell}>
                    {new Date(canvasItem.createdAt).toLocaleDateString()}
                  </div>
                  <div className={styles.tableCell}>
                    <Link href={`/canvas/editor/${canvasItem.configId}/${canvasItem.flowId}`}>
                      <button className={styles.editBtn}>
                        Edit Canvas
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className={styles.navigationSection}>
          <Link href="/landing">
            <button className={styles.ctaBtn}>Go to Landing page</button>
          </Link>
        </div>

        {/* Create Canvas Modal */}
        <CreateCanvasModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleCreateCanvas}
          configs={configs}
          flows={flows}
          loading={loading}
        />
      </div>
    </div>
  );
}
