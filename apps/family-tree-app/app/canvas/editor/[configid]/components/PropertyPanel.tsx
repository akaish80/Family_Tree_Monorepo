"use client";
import React from "react";
import { useEditor } from "@craftjs/core";

const PropertyPanel = () => {
  const { selected, actions, query } = useEditor((state, query) => {
    const currentNodeId = query.getEvent('selected').first();
    return {
      selected: currentNodeId,
    };
  });

  const selectedNode = selected && query.node(selected).get();

  // Custom scrollbar styles
  const scrollbarStyles = {
    WebkitScrollbar: {
      width: "8px",
    },
    WebkitScrollbarTrack: {
      background: "rgba(243, 244, 246, 0.5)",
      borderRadius: "4px",
    },
    WebkitScrollbarThumb: {
      background: "rgba(209, 213, 219, 0.8)",
      borderRadius: "4px",
      border: "1px solid rgba(229, 231, 235, 0.5)",
    },
    WebkitScrollbarThumbHover: {
      background: "rgba(156, 163, 175, 0.9)",
    },
  };

  return (
    <div style={{
      width: "100%",
      background: "transparent",
      padding: "0",
      height: "100%",
      color: "#1f2937",
      display: "flex",
      flexDirection: "column",
    }}>
      <style jsx>{`
        .property-panel-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .property-panel-scroll::-webkit-scrollbar-track {
          background: rgba(243, 244, 246, 0.5);
          border-radius: 4px;
        }
        .property-panel-scroll::-webkit-scrollbar-thumb {
          background: rgba(209, 213, 219, 0.8);
          border-radius: 4px;
          border: 1px solid rgba(229, 231, 235, 0.5);
        }
        .property-panel-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.9);
        }
      `}</style>
      <div 
        className="property-panel-scroll"
        style={{ 
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "15px",
          maxHeight: "100%",
        }}
      >
      {selected && selectedNode ? (
        <div style={{
          paddingBottom: "20px" // Extra padding at bottom for better scrolling
        }}>
          <div style={{ 
            marginBottom: "20px", 
            padding: "12px",
            background: "rgba(79, 70, 229, 0.1)",
            borderRadius: "8px",
            border: "1px solid rgba(79, 70, 229, 0.2)"
          }}>
            <strong style={{ color: "#4f46e5", fontSize: "14px" }}>Selected Component:</strong> 
            <div style={{ color: "#1f2937", fontWeight: "600", marginTop: "4px" }}>
              {String(selectedNode.data.displayName || selectedNode.data.name)}
            </div>
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "600",
              color: "#374151",
              fontSize: "14px"
            }}>
              Text Alignment:
            </label>
            <select 
              style={{ 
                width: "100%", 
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                background: "white",
                color: "#1f2937",
                fontSize: "14px"
              }}
              onChange={(e) => {
                actions.setProp(selected, (props) => {
                  props.style = { ...props.style, textAlign: e.target.value };
                });
              }}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "600",
              color: "#374151",
              fontSize: "14px"
            }}>
              Margin (px):
            </label>
            <input 
              type="range" 
              min="0" 
              max="50" 
              defaultValue="8"
              style={{ 
                width: "100%",
                marginBottom: "8px"
              }}
              onChange={(e) => {
                actions.setProp(selected, (props) => {
                  props.style = { ...props.style, margin: `${e.target.value}px` };
                });
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "600",
              color: "#374151",
              fontSize: "14px"
            }}>
              Padding (px):
            </label>
            <input 
              type="range" 
              min="0" 
              max="50" 
              defaultValue="10"
              style={{ 
                width: "100%",
                marginBottom: "8px"
              }}
              onChange={(e) => {
                actions.setProp(selected, (props) => {
                  props.style = { ...props.style, padding: `${e.target.value}px` };
                });
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "600",
              color: "#374151",
              fontSize: "14px"
            }}>
              Background Color:
            </label>
            <input 
              type="color" 
              style={{ 
                width: "100%", 
                height: "40px",
                border: "1px solid #d1d5db",
                borderRadius: "6px"
              }}
              onChange={(e) => {
                actions.setProp(selected, (props) => {
                  props.style = { ...props.style, backgroundColor: e.target.value };
                });
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "600",
              color: "#374151",
              fontSize: "14px"
            }}>
              Border Radius (px):
            </label>
            <input 
              type="range" 
              min="0" 
              max="20" 
              defaultValue="4"
              style={{ 
                width: "100%",
                marginBottom: "8px"
              }}
              onChange={(e) => {
                actions.setProp(selected, (props) => {
                  props.style = { ...props.style, borderRadius: `${e.target.value}px` };
                });
              }}
            />
          </div>

          {/* Universal Quick Text Editor - Works for All Text Components */}
          {(selectedNode.data.name === 'Button' || 
            selectedNode.data.name === 'TextComponent' || 
            selectedNode.data.name === 'Label' || 
            selectedNode.data.name === 'InputField') && (
            <div style={{ 
              marginBottom: "25px", 
              padding: "16px",
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
              borderRadius: "10px",
              border: "2px solid rgba(59, 130, 246, 0.3)",
              boxShadow: "0 4px 15px rgba(59, 130, 246, 0.2)"
            }}>
              <label style={{ 
                display: "block", 
                marginBottom: "12px", 
                fontWeight: "800",
                color: "#1e40af",
                fontSize: "18px",
                textAlign: "center"
              }}>
                ✏️ EDIT COMPONENT TEXT
              </label>
              
              {selectedNode.data.name === 'Button' && (
                <div>
                  <label style={{fontSize: "14px", fontWeight: "600", color: "#1e40af", marginBottom: "8px", display: "block"}}>
                    Button Text:
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter button text"
                    defaultValue={selectedNode.data.props.text || "Button"}
                    style={{ 
                      width: "100%", 
                      padding: "12px 16px",
                      border: "2px solid #3b82f6",
                      borderRadius: "8px",
                      background: "white",
                      color: "#1f2937",
                      fontSize: "16px",
                      fontWeight: "600"
                    }}
                    onChange={(e) => {
                      actions.setProp(selected, (props) => {
                        props.text = e.target.value;
                      });
                    }}
                  />
                </div>
              )}
              
              {selectedNode.data.name === 'TextComponent' && (
                <div>
                  <label style={{fontSize: "14px", fontWeight: "600", color: "#1e40af", marginBottom: "8px", display: "block"}}>
                    Text Content:
                  </label>
                  <textarea 
                    placeholder="Enter text content"
                    defaultValue={selectedNode.data.props.text || "Text"}
                    rows={3}
                    style={{ 
                      width: "100%", 
                      padding: "12px 16px",
                      border: "2px solid #3b82f6",
                      borderRadius: "8px",
                      background: "white",
                      color: "#1f2937",
                      fontSize: "16px",
                      fontWeight: "600",
                      resize: "vertical"
                    }}
                    onChange={(e) => {
                      actions.setProp(selected, (props) => {
                        props.text = e.target.value;
                      });
                    }}
                  />
                </div>
              )}
              
              {selectedNode.data.name === 'Label' && (
                <div>
                  <label style={{fontSize: "14px", fontWeight: "600", color: "#1e40af", marginBottom: "8px", display: "block"}}>
                    Label Text:
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter label text"
                    defaultValue={selectedNode.data.props.text || selectedNode.data.props.label || "Label"}
                    style={{ 
                      width: "100%", 
                      padding: "12px 16px",
                      border: "2px solid #3b82f6",
                      borderRadius: "8px",
                      background: "white",
                      color: "#1f2937",
                      fontSize: "16px",
                      fontWeight: "600"
                    }}
                    onChange={(e) => {
                      actions.setProp(selected, (props) => {
                        props.text = e.target.value;
                        props.label = e.target.value;
                      });
                    }}
                  />
                </div>
              )}
              
              {selectedNode.data.name === 'InputField' && (
                <div>
                  <label style={{fontSize: "14px", fontWeight: "600", color: "#1e40af", marginBottom: "8px", display: "block"}}>
                    Placeholder Text:
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter placeholder text"
                    defaultValue={selectedNode.data.props.placeholder || "Enter text..."}
                    style={{ 
                      width: "100%", 
                      padding: "12px 16px",
                      border: "2px solid #3b82f6",
                      borderRadius: "8px",
                      background: "white",
                      color: "#1f2937",
                      fontSize: "16px",
                      fontWeight: "600"
                    }}
                    onChange={(e) => {
                      actions.setProp(selected, (props) => {
                        props.placeholder = e.target.value;
                      });
                    }}
                  />
                </div>
              )}
              
              <div style={{ 
                fontSize: "12px", 
                color: "#1e40af", 
                marginTop: "10px",
                textAlign: "center",
                fontWeight: "600"
              }}>
                Changes appear instantly on the canvas!
              </div>
            </div>
          )}

          {selectedNode.data.name === 'Button' && (
            <>
              {/* Button Action Type Configuration */}
              <div style={{ 
                marginBottom: "25px", 
                padding: "16px",
                background: "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
                borderRadius: "10px",
                border: "2px solid rgba(168, 85, 247, 0.3)",
                boxShadow: "0 4px 15px rgba(168, 85, 247, 0.2)"
              }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "12px", 
                  fontWeight: "800",
                  color: "#7c3aed",
                  fontSize: "16px",
                  textAlign: "center"
                }}>
                  ⚡ BUTTON ACTION TYPE
                </label>
                
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "8px", 
                    fontWeight: "600",
                    color: "#7c3aed",
                    fontSize: "14px"
                  }}>
                    Action Type:
                  </label>
                  <select 
                    defaultValue={selectedNode.data.props.actionType || "navigation"}
                    style={{ 
                      width: "100%", 
                      padding: "10px 12px",
                      border: "2px solid #a855f7",
                      borderRadius: "8px",
                      background: "white",
                      color: "#1f2937",
                      fontSize: "14px",
                      fontWeight: "600"
                    }}
                    onChange={(e) => {
                      actions.setProp(selected, (props) => {
                        props.actionType = e.target.value;
                        
                        // Auto-set appropriate default colors based on action type
                        const colorMap = {
                          'submit': { backgroundColor: '#28a745', color: 'white' },
                          'navigation': { backgroundColor: '#007bff', color: 'white' },
                          'secondary': { backgroundColor: '#6c757d', color: 'white' },
                          'danger': { backgroundColor: '#dc3545', color: 'white' },
                          'warning': { backgroundColor: '#ffc107', color: '#212529' },
                          'custom': { backgroundColor: '#667eea', color: 'white' }
                        };
                        
                        const colors = colorMap[e.target.value] || colorMap.navigation;
                        props.style = { 
                          ...props.style, 
                          backgroundColor: colors.backgroundColor,
                          color: colors.color
                        };
                      });
                    }}
                  >
                    <option value="submit">🟢 Submit - Form Submission with Validation</option>
                    <option value="navigation">🔵 Navigation - Go to Next Step</option>
                    <option value="secondary">⚪ Secondary - Secondary Actions</option>
                    <option value="danger">🔴 Danger - Delete/Cancel Actions</option>
                    <option value="warning">🟡 Warning - Caution Actions</option>
                    <option value="custom">🟣 Custom - Fully Customizable</option>
                  </select>
                </div>

                {/* Action Type Description */}
                <div style={{
                  padding: "12px",
                  background: "rgba(139, 92, 246, 0.1)",
                  borderRadius: "6px",
                  border: "1px solid rgba(139, 92, 246, 0.2)",
                  marginBottom: "15px"
                }}>
                  <div style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#7c3aed",
                    marginBottom: "6px"
                  }}>
                    Selected Action Behavior:
                  </div>
                  <div style={{
                    fontSize: "11px",
                    color: "#6b46c1",
                    lineHeight: "1.4"
                  }}>
                    {(() => {
                      const actionType = selectedNode.data.props.actionType || "navigation";
                      const descriptions = {
                        'submit': '✅ Triggers form validation and submission. On success, navigates to next step.',
                        'navigation': '➡️ Directly navigates to the next step without form processing.',
                        'secondary': '⏭️ Secondary action button for skip/back operations.',
                        'danger': '⚠️ Destructive action styling for delete/cancel operations.',
                        'warning': '⚡ Warning action styling for caution-required operations.',
                        'custom': '🛠️ Custom behavior controlled by onClick handlers.'
                      };
                      return descriptions[actionType] || descriptions.navigation;
                    })()}
                  </div>
                </div>

                {/* Tooltip Configuration */}
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "5px", 
                    fontWeight: "600",
                    color: "#7c3aed",
                    fontSize: "13px"
                  }}>
                    Tooltip (Hover Text):
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g., Click to submit the form"
                    defaultValue={selectedNode.data.props.tooltip || ""}
                    style={{ 
                      width: "100%", 
                      padding: "8px 12px",
                      border: "1px solid #a855f7",
                      borderRadius: "6px",
                      background: "white",
                      color: "#1f2937",
                      fontSize: "13px"
                    }}
                    onChange={(e) => {
                      actions.setProp(selected, (props) => {
                        props.tooltip = e.target.value;
                      });
                    }}
                  />
                </div>

                {/* Disabled State */}
                <div style={{ marginBottom: "15px" }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#7c3aed"
                  }}>
                    <input 
                      type="checkbox" 
                      defaultChecked={selectedNode.data.props.disabled || false}
                      style={{ 
                        marginRight: "8px",
                        width: "16px",
                        height: "16px"
                      }}
                      onChange={(e) => {
                        actions.setProp(selected, (props) => {
                          props.disabled = e.target.checked;
                        });
                      }}
                    />
                    Disabled State
                  </label>
                  <div style={{
                    fontSize: "11px",
                    color: "#8b5cf6",
                    marginTop: "4px",
                    marginLeft: "24px",
                    fontStyle: "italic"
                  }}>
                    Button will be non-interactive when disabled
                  </div>
                </div>

                <div style={{ 
                  fontSize: "11px", 
                  color: "#7c3aed", 
                  marginTop: "12px",
                  textAlign: "center",
                  fontWeight: "600",
                  background: "rgba(139, 92, 246, 0.1)",
                  padding: "8px",
                  borderRadius: "4px"
                }}>
                  🚀 Action type determines button behavior in the flow viewer!
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Button Label:
                </label>
                <input 
                  type="text" 
                  placeholder="Button label (for accessibility)"
                  defaultValue={selectedNode.data.props.label || ""}
                  style={{ 
                    width: "100%", 
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    background: "white",
                    color: "#1f2937",
                    fontSize: "14px"
                  }}
                  onChange={(e) => {
                    actions.setProp(selected, (props) => {
                      props.label = e.target.value;
                    });
                  }}
                />
              </div>
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Button Background Color:
                </label>
                <input 
                  type="color" 
                  defaultValue={selectedNode.data.props.style?.backgroundColor || "#007bff"}
                  style={{ 
                    width: "100%", 
                    height: "40px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px"
                  }}
                  onChange={(e) => {
                    actions.setProp(selected, (props) => {
                      props.style = { ...props.style, backgroundColor: e.target.value };
                    });
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Button Text Color:
                </label>
                <input 
                  type="color" 
                  defaultValue={selectedNode.data.props.style?.color || "#ffffff"}
                  style={{ 
                    width: "100%", 
                    height: "40px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px"
                  }}
                  onChange={(e) => {
                    actions.setProp(selected, (props) => {
                      props.style = { ...props.style, color: e.target.value };
                    });
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Font Size (px):
                </label>
                <input 
                  type="range" 
                  min="10" 
                  max="24" 
                  defaultValue={parseInt(selectedNode.data.props.style?.fontSize) || 14}
                  style={{ 
                    width: "100%",
                    marginBottom: "8px"
                  }}
                  onChange={(e) => {
                    actions.setProp(selected, (props) => {
                      props.style = { ...props.style, fontSize: `${e.target.value}px` };
                    });
                  }}
                />
                <div style={{ fontSize: "12px", color: "#6b7280", textAlign: "center" }}>
                  {selectedNode.data.props.style?.fontSize || "14px"}
                </div>
              </div>

              {/* Button Action Types Quick Reference */}
              <div style={{ 
                marginBottom: "20px", 
                padding: "15px",
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)",
                borderRadius: "8px",
                border: "1px solid rgba(16, 185, 129, 0.2)"
              }}>
                <div style={{ 
                  fontSize: "14px", 
                  fontWeight: "700",
                  color: "#047857",
                  marginBottom: "12px",
                  textAlign: "center"
                }}>
                  📋 Action Types Quick Reference
                </div>
                <div style={{ fontSize: "11px", color: "#065f46", lineHeight: "1.5" }}>
                  <div style={{ marginBottom: "6px" }}>
                    <strong>🟢 Submit:</strong> Validates form → Submits → Navigates
                  </div>
                  <div style={{ marginBottom: "6px" }}>
                    <strong>🔵 Navigation:</strong> Direct navigation (skip form)
                  </div>
                  <div style={{ marginBottom: "6px" }}>
                    <strong>⚪ Secondary:</strong> Back, Cancel, or optional actions
                  </div>
                  <div style={{ marginBottom: "6px" }}>
                    <strong>🔴 Danger:</strong> Delete, Remove destructive actions
                  </div>
                  <div style={{ marginBottom: "6px" }}>
                    <strong>🟡 Warning:</strong> Proceed with caution actions
                  </div>
                  <div>
                    <strong>🟣 Custom:</strong> Full control with onClick handlers
                  </div>
                </div>
                <div style={{
                  fontSize: "10px",
                  color: "#047857",
                  marginTop: "10px",
                  textAlign: "center",
                  fontStyle: "italic",
                  background: "rgba(5, 150, 105, 0.1)",
                  padding: "6px",
                  borderRadius: "4px"
                }}>
                  💡 Colors auto-update when you change action type!
                </div>
              </div>
            </>
          )}

          {selectedNode.data.name === 'TextComponent' && (
            <>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Text Label:
                </label>
                <input 
                  type="text" 
                  placeholder="Text label (for identification)"
                  defaultValue={selectedNode.data.props.label || ""}
                  style={{ 
                    width: "100%", 
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    background: "white",
                    color: "#1f2937",
                    fontSize: "14px"
                  }}
                  onChange={(e) => {
                    actions.setProp(selected, (props) => {
                      props.label = e.target.value;
                    });
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Text Color:
                </label>
                <input 
                  type="color" 
                  defaultValue={selectedNode.data.props.style?.color || "#1f2937"}
                  style={{ 
                    width: "100%", 
                    height: "40px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px"
                  }}
                  onChange={(e) => {
                    actions.setProp(selected, (props) => {
                      props.style = { ...props.style, color: e.target.value };
                    });
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Font Size (px):
                </label>
                <input 
                  type="range" 
                  min="10" 
                  max="32" 
                  defaultValue={parseInt(selectedNode.data.props.style?.fontSize) || 14}
                  style={{ 
                    width: "100%",
                    marginBottom: "8px"
                  }}
                  onChange={(e) => {
                    actions.setProp(selected, (props) => {
                      props.style = { ...props.style, fontSize: `${e.target.value}px` };
                    });
                  }}
                />
                <div style={{ fontSize: "12px", color: "#6b7280", textAlign: "center" }}>
                  {selectedNode.data.props.style?.fontSize || "14px"}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Font Weight:
                </label>
                <select 
                  defaultValue={selectedNode.data.props.style?.fontWeight || "normal"}
                  style={{ 
                    width: "100%", 
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    background: "white",
                    color: "#1f2937",
                    fontSize: "14px"
                  }}
                  onChange={(e) => {
                    actions.setProp(selected, (props) => {
                      props.style = { ...props.style, fontWeight: e.target.value };
                    });
                  }}
                >
                  <option value="300">Light</option>
                  <option value="normal">Normal</option>
                  <option value="500">Medium</option>
                  <option value="600">Semi Bold</option>
                  <option value="bold">Bold</option>
                  <option value="800">Extra Bold</option>
                </select>
              </div>
            </>
          )}

          {selectedNode.data.name === 'Label' && (
            <>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  🏷️ Label For (Input ID):
                </label>
                <input 
                  type="text" 
                  placeholder="Associated input field ID"
                  defaultValue={selectedNode.data.props.htmlFor || ""}
                  style={{ 
                    width: "100%", 
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    background: "white",
                    color: "#1f2937",
                    fontSize: "14px"
                  }}
                  onChange={(e) => {
                    actions.setProp(selected, (props) => {
                      props.htmlFor = e.target.value;
                    });
                  }}
                />
                <div style={{ 
                  fontSize: "11px", 
                  color: "#6b7280", 
                  marginTop: "5px",
                  fontStyle: "italic"
                }}>
                  Connect this label to an input field by providing the input's ID
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Label Text Color:
                </label>
                <input 
                  type="color" 
                  defaultValue={selectedNode.data.props.style?.color || "#374151"}
                  style={{ 
                    width: "100%", 
                    height: "40px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                  onChange={(e) => {
                    actions.setProp(selected, (props) => {
                      props.style = { ...props.style, color: e.target.value };
                    });
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Font Size (px):
                </label>
                <input 
                  type="number" 
                  min="8" 
                  max="72"
                  defaultValue={parseInt(selectedNode.data.props.style?.fontSize) || 14}
                  style={{ 
                    width: "100%", 
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    background: "white",
                    color: "#1f2937",
                    fontSize: "14px"
                  }}
                  onChange={(e) => {
                    actions.setProp(selected, (props) => {
                      props.style = { ...props.style, fontSize: `${e.target.value}px` };
                    });
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Font Weight:
                </label>
                <select 
                  defaultValue={selectedNode.data.props.style?.fontWeight || "500"}
                  style={{ 
                    width: "100%", 
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    background: "white",
                    color: "#1f2937",
                    fontSize: "14px"
                  }}
                  onChange={(e) => {
                    actions.setProp(selected, (props) => {
                      props.style = { ...props.style, fontWeight: e.target.value };
                    });
                  }}
                >
                  <option value="300">Light</option>
                  <option value="normal">Normal</option>
                  <option value="500">Medium</option>
                  <option value="600">Semi Bold</option>
                  <option value="bold">Bold</option>
                  <option value="800">Extra Bold</option>
                </select>
              </div>
            </>
          )}

          {selectedNode.data.name === 'InputField' && (
            <>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Input Label:
                </label>
                <input 
                  type="text" 
                  placeholder="Input field label"
                  defaultValue={selectedNode.data.props.label || ""}
                  style={{ 
                    width: "100%", 
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    background: "white",
                    color: "#1f2937",
                    fontSize: "14px"
                  }}
                  onChange={(e) => {
                    actions.setProp(selected, (props) => {
                      props.label = e.target.value;
                    });
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Field Name (for form data):
                </label>
                <input 
                  type="text" 
                  placeholder="e.g., firstName, email, phone"
                  defaultValue={selectedNode.data.props.name || ""}
                  style={{ 
                    width: "100%", 
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    background: "white",
                    color: "#1f2937",
                    fontSize: "14px"
                  }}
                  onChange={(e) => {
                    actions.setProp(selected, (props) => {
                      props.name = e.target.value;
                    });
                  }}
                />
                <div style={{ 
                  fontSize: "11px", 
                  color: "#6b7280", 
                  marginTop: "5px",
                  fontStyle: "italic"
                }}>
                  Unique identifier for this field in form submissions
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Input Type:
                </label>
                <select 
                  defaultValue={selectedNode.data.props.type || "text"}
                  style={{ 
                    width: "100%", 
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    background: "white",
                    color: "#1f2937",
                    fontSize: "14px"
                  }}
                  onChange={(e) => {
                    actions.setProp(selected, (props) => {
                      props.type = e.target.value;
                    });
                  }}
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="password">Password</option>
                  <option value="number">Number</option>
                  <option value="tel">Phone</option>
                  <option value="url">URL</option>
                  <option value="search">Search</option>
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Helper Text:
                </label>
                <input 
                  type="text" 
                  placeholder="Helpful guidance for the user"
                  defaultValue={selectedNode.data.props.hint || ""}
                  style={{ 
                    width: "100%", 
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    background: "white",
                    color: "#1f2937",
                    fontSize: "14px"
                  }}
                  onChange={(e) => {
                    actions.setProp(selected, (props) => {
                      props.hint = e.target.value;
                    });
                  }}
                />
              </div>

              {/* Validation Section */}
              <div style={{ 
                marginBottom: "25px", 
                padding: "16px",
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)",
                borderRadius: "10px",
                border: "2px solid rgba(16, 185, 129, 0.3)",
                boxShadow: "0 4px 15px rgba(16, 185, 129, 0.2)"
              }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "15px", 
                  fontWeight: "800",
                  color: "#047857",
                  fontSize: "16px",
                  textAlign: "center"
                }}>
                  🛡️ VALIDATION SETTINGS
                </label>

                {/* Required Field Toggle */}
                <div style={{ marginBottom: "15px" }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#047857"
                  }}>
                    <input 
                      type="checkbox" 
                      defaultChecked={selectedNode.data.props.required || false}
                      style={{ 
                        marginRight: "8px",
                        width: "16px",
                        height: "16px"
                      }}
                      onChange={(e) => {
                        actions.setProp(selected, (props) => {
                          props.required = e.target.checked;
                        });
                      }}
                    />
                    Required Field (Mandatory)
                  </label>
                </div>

                {/* Length Validation */}
                {(selectedNode.data.props.type !== 'number') && (
                  <>
                    <div style={{ marginBottom: "15px" }}>
                      <label style={{ 
                        display: "block", 
                        marginBottom: "5px", 
                        fontWeight: "600",
                        color: "#047857",
                        fontSize: "13px"
                      }}>
                        Minimum Length:
                      </label>
                      <input 
                        type="number" 
                        min="0"
                        max="1000"
                        placeholder="e.g., 3"
                        defaultValue={selectedNode.data.props.minLength || ""}
                        style={{ 
                          width: "100%", 
                          padding: "6px 10px",
                          border: "1px solid #10b981",
                          borderRadius: "6px",
                          background: "white",
                          color: "#1f2937",
                          fontSize: "13px"
                        }}
                        onChange={(e) => {
                          actions.setProp(selected, (props) => {
                            props.minLength = e.target.value ? parseInt(e.target.value) : undefined;
                          });
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                      <label style={{ 
                        display: "block", 
                        marginBottom: "5px", 
                        fontWeight: "600",
                        color: "#047857",
                        fontSize: "13px"
                      }}>
                        Maximum Length:
                      </label>
                      <input 
                        type="number" 
                        min="1"
                        max="10000"
                        placeholder="e.g., 50"
                        defaultValue={selectedNode.data.props.maxLength || ""}
                        style={{ 
                          width: "100%", 
                          padding: "6px 10px",
                          border: "1px solid #10b981",
                          borderRadius: "6px",
                          background: "white",
                          color: "#1f2937",
                          fontSize: "13px"
                        }}
                        onChange={(e) => {
                          actions.setProp(selected, (props) => {
                            props.maxLength = e.target.value ? parseInt(e.target.value) : undefined;
                          });
                        }}
                      />
                    </div>
                  </>
                )}

                {/* Numeric Validation */}
                {selectedNode.data.props.type === 'number' && (
                  <>
                    <div style={{ marginBottom: "15px" }}>
                      <label style={{ 
                        display: "block", 
                        marginBottom: "5px", 
                        fontWeight: "600",
                        color: "#047857",
                        fontSize: "13px"
                      }}>
                        Minimum Value:
                      </label>
                      <input 
                        type="number" 
                        placeholder="e.g., 0"
                        defaultValue={selectedNode.data.props.min || ""}
                        style={{ 
                          width: "100%", 
                          padding: "6px 10px",
                          border: "1px solid #10b981",
                          borderRadius: "6px",
                          background: "white",
                          color: "#1f2937",
                          fontSize: "13px"
                        }}
                        onChange={(e) => {
                          actions.setProp(selected, (props) => {
                            props.min = e.target.value ? parseFloat(e.target.value) : undefined;
                          });
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                      <label style={{ 
                        display: "block", 
                        marginBottom: "5px", 
                        fontWeight: "600",
                        color: "#047857",
                        fontSize: "13px"
                      }}>
                        Maximum Value:
                      </label>
                      <input 
                        type="number" 
                        placeholder="e.g., 100"
                        defaultValue={selectedNode.data.props.max || ""}
                        style={{ 
                          width: "100%", 
                          padding: "6px 10px",
                          border: "1px solid #10b981",
                          borderRadius: "6px",
                          background: "white",
                          color: "#1f2937",
                          fontSize: "13px"
                        }}
                        onChange={(e) => {
                          actions.setProp(selected, (props) => {
                            props.max = e.target.value ? parseFloat(e.target.value) : undefined;
                          });
                        }}
                      />
                    </div>
                  </>
                )}

                {/* Regex Validation */}
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "5px", 
                    fontWeight: "600",
                    color: "#047857",
                    fontSize: "13px"
                  }}>
                    Custom Pattern (Regex):
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g., ^[a-zA-Z0-9_]+$ (alphanumeric + underscore)"
                    defaultValue={selectedNode.data.props.regex || ""}
                    style={{ 
                      width: "100%", 
                      padding: "6px 10px",
                      border: "1px solid #10b981",
                      borderRadius: "6px",
                      background: "white",
                      color: "#1f2937",
                      fontSize: "13px"
                    }}
                    onChange={(e) => {
                      actions.setProp(selected, (props) => {
                        props.regex = e.target.value;
                      });
                    }}
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "5px", 
                    fontWeight: "600",
                    color: "#047857",
                    fontSize: "13px"
                  }}>
                    Pattern Error Message:
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g., Only letters, numbers, and underscores allowed"
                    defaultValue={selectedNode.data.props.regexMessage || ""}
                    style={{ 
                      width: "100%", 
                      padding: "6px 10px",
                      border: "1px solid #10b981",
                      borderRadius: "6px",
                      background: "white",
                      color: "#1f2937",
                      fontSize: "13px"
                    }}
                    onChange={(e) => {
                      actions.setProp(selected, (props) => {
                        props.regexMessage = e.target.value;
                      });
                    }}
                  />
                </div>

                {/* Pre-built Validation Rules */}
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "5px", 
                    fontWeight: "600",
                    color: "#047857",
                    fontSize: "13px"
                  }}>
                    Quick Validation Rules:
                  </label>
                  <select 
                    style={{ 
                      width: "100%", 
                      padding: "6px 10px",
                      border: "1px solid #10b981",
                      borderRadius: "6px",
                      background: "white",
                      color: "#1f2937",
                      fontSize: "13px"
                    }}
                    onChange={(e) => {
                      const rule = e.target.value;
                      if (rule) {
                        actions.setProp(selected, (props) => {
                          if (!props.customValidation) {
                            props.customValidation = [];
                          }
                          
                          // Remove existing rule of same type
                          props.customValidation = props.customValidation.filter(v => v.rule !== rule);
                          
                          // Add new rule with appropriate message
                          let message = '';
                          switch(rule) {
                            case 'strongPassword':
                              message = 'Password must contain uppercase, lowercase, number, and special character';
                              break;
                            case 'phone':
                              message = 'Please enter a valid phone number';
                              break;
                            case 'alphanumeric':
                              message = 'Only letters and numbers allowed';
                              break;
                            case 'alphabetic':
                              message = 'Only letters and spaces allowed';
                              break;
                            case 'numeric':
                              message = 'Only numbers allowed';
                              break;
                            case 'noSpaces':
                              message = 'Spaces are not allowed';
                              break;
                          }
                          
                          if (message) {
                            props.customValidation.push({ rule, message });
                          }
                        });
                      }
                      // Reset select
                      e.target.value = '';
                    }}
                  >
                    <option value="">Select a validation rule...</option>
                    <option value="strongPassword">Strong Password</option>
                    <option value="phone">Phone Number</option>
                    <option value="alphanumeric">Alphanumeric Only</option>
                    <option value="alphabetic">Letters Only</option>
                    <option value="numeric">Numbers Only</option>
                    <option value="noSpaces">No Spaces</option>
                  </select>
                </div>

                {/* Display Current Validation Rules */}
                {selectedNode.data.props.customValidation && selectedNode.data.props.customValidation.length > 0 && (
                  <div style={{
                    background: "rgba(5, 150, 105, 0.1)",
                    padding: "10px",
                    borderRadius: "6px",
                    marginTop: "10px"
                  }}>
                    <div style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#047857",
                      marginBottom: "8px"
                    }}>
                      Active Validation Rules:
                    </div>
                    {selectedNode.data.props.customValidation.map((validation, index) => (
                      <div key={index} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "white",
                        padding: "6px 8px",
                        borderRadius: "4px",
                        marginBottom: "4px",
                        fontSize: "11px"
                      }}>
                        <span style={{ color: "#047857", fontWeight: "500" }}>
                          {validation.rule}: {validation.message}
                        </span>
                        <button
                          style={{
                            background: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "3px",
                            padding: "2px 6px",
                            fontSize: "10px",
                            cursor: "pointer"
                          }}
                          onClick={() => {
                            actions.setProp(selected, (props) => {
                              props.customValidation = props.customValidation.filter((_, i) => i !== index);
                            });
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ 
                  fontSize: "11px", 
                  color: "#047857", 
                  marginTop: "10px",
                  textAlign: "center",
                  fontWeight: "600",
                  background: "rgba(5, 150, 105, 0.1)",
                  padding: "8px",
                  borderRadius: "4px"
                }}>
                  💡 Validation rules are saved automatically and will work in the flow viewer!
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Input Field Width (px):
                </label>
                <input 
                  type="range" 
                  min="100" 
                  max="500" 
                  defaultValue={parseInt(selectedNode.data.props.style?.width) || 200}
                  style={{ 
                    width: "100%",
                    marginBottom: "8px"
                  }}
                  onChange={(e) => {
                    actions.setProp(selected, (props) => {
                      props.style = { ...props.style, width: `${e.target.value}px` };
                    });
                  }}
                />
                <div style={{ fontSize: "12px", color: "#6b7280", textAlign: "center" }}>
                  {selectedNode.data.props.style?.width || "200px"}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Border Color:
                </label>
                <input 
                  type="color" 
                  defaultValue={selectedNode.data.props.style?.borderColor || "#d1d5db"}
                  style={{ 
                    width: "100%", 
                    height: "40px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px"
                  }}
                  onChange={(e) => {
                    actions.setProp(selected, (props) => {
                      props.style = { 
                        ...props.style, 
                        borderColor: e.target.value,
                        border: `1px solid ${e.target.value}`
                      };
                    });
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Background Color:
                </label>
                <input 
                  type="color" 
                  defaultValue={selectedNode.data.props.style?.backgroundColor || "#ffffff"}
                  style={{ 
                    width: "100%", 
                    height: "40px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px"
                  }}
                  onChange={(e) => {
                    actions.setProp(selected, (props) => {
                      props.style = { ...props.style, backgroundColor: e.target.value };
                    });
                  }}
                />
              </div>
            </>
          )}

          {(selectedNode.data.name === 'Container' || selectedNode.data.name === 'InnerContainer') && (
            <>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Container Background:
                </label>
                <input 
                  type="color" 
                  defaultValue={selectedNode.data.props.style?.backgroundColor || (selectedNode.data.name === 'Container' ? "#ffffff" : "#f0fdf4")}
                  style={{ 
                    width: "100%", 
                    height: "40px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px"
                  }}
                  onChange={(e) => {
                    actions.setProp(selected, (props) => {
                      props.style = { ...props.style, backgroundColor: e.target.value };
                    });
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Container Height (px):
                </label>
                <input 
                  type="number" 
                  min="50" 
                  max="800" 
                  defaultValue={parseInt(selectedNode.data.props.style?.minHeight) || (selectedNode.data.name === 'Container' ? 400 : 80)}
                  style={{ 
                    width: "100%", 
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    background: "white",
                    color: "#1f2937",
                    fontSize: "14px"
                  }}
                  onChange={(e) => {
                    actions.setProp(selected, (props) => {
                      props.style = { 
                        ...props.style, 
                        minHeight: `${e.target.value}px`,
                        height: selectedNode.data.name === 'Container' ? `${e.target.value}px` : 'auto'
                      };
                    });
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "14px"
                }}>
                  Border Style:
                </label>
                <select 
                  defaultValue={selectedNode.data.props.style?.borderStyle || "dashed"}
                  style={{ 
                    width: "100%", 
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    background: "white",
                    color: "#1f2937",
                    fontSize: "14px"
                  }}
                  onChange={(e) => {
                    const borderColor = selectedNode.data.name === 'Container' ? '#d1d5db' : '#10b981';
                    actions.setProp(selected, (props) => {
                      props.style = { 
                        ...props.style, 
                        borderStyle: e.target.value,
                        border: `1px ${e.target.value} ${borderColor}`
                      };
                    });
                  }}
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="none">None</option>
                </select>
              </div>
            </>
          )}

          {/* Custom CSS Class Section for All Components */}
          <div style={{ 
            marginTop: "30px", 
            padding: "15px",
            background: "rgba(59, 130, 246, 0.1)",
            borderRadius: "8px",
            border: "1px solid rgba(59, 130, 246, 0.2)"
          }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "600",
              color: "#3b82f6",
              fontSize: "14px"
            }}>
              🎨 Custom CSS Class:
            </label>
            
            <div style={{ marginBottom: "10px" }}>
              <input 
                type="text" 
                placeholder="Enter custom CSS class name (e.g., my-custom-class)"
                defaultValue={selectedNode.data.props.customCssClass || ""}
                style={{ 
                  width: "100%", 
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  background: "white",
                  color: "#1f2937",
                  fontSize: "14px"
                }}
                onChange={(e) => {
                  actions.setProp(selected, (props) => {
                    props.customCssClass = e.target.value;
                  });
                }}
              />
              <div style={{ 
                fontSize: "11px", 
                color: "#6b7280", 
                marginTop: "5px",
                fontStyle: "italic"
              }}>
                Add your custom CSS class to apply external styles to this component
              </div>
            </div>
          </div>

          <div style={{ marginTop: "30px" }}>
            <button 
              style={{
                width: "100%",
                padding: "12px",
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                transition: "background-color 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#c82333";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#dc3545";
              }}
              onClick={() => {
                actions.delete(selected);
              }}
            >
              Delete Element
            </button>
          </div>
        </div>
      ) : (
        <div style={{ 
          color: "#4b5563", 
          textAlign: "center",
          padding: "25px",
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)",
          borderRadius: "12px",
          margin: "20px 0",
          border: "2px dashed rgba(59, 130, 246, 0.3)"
        }}>
          <div style={{
            fontSize: "48px",
            marginBottom: "15px"
          }}>
            🎯
          </div>
          <div style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#1e40af",
            marginBottom: "8px"
          }}>
            Select a Component to Edit
          </div>
          <div style={{
            fontSize: "14px",
            color: "#6b7280",
            marginBottom: "15px"
          }}>
            Click on any component in the canvas to edit its text and properties
          </div>
          <div style={{
            fontSize: "12px",
            color: "#059669",
            fontWeight: "600",
            background: "rgba(5, 150, 105, 0.1)",
            padding: "8px 12px",
            borderRadius: "6px",
            display: "inline-block"
          }}>
            💡 Tip: Drag components from the left toolbox first!
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default PropertyPanel;