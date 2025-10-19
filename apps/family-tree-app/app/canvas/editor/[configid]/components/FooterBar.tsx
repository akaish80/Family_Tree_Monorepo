import React from "react";
import { useEditor } from "@craftjs/core";

interface FooterBarProps {
  configId: string;
  flowId: string;
}

export const FooterBar = ({ configId, flowId }: FooterBarProps) => {
  const { query, actions } = useEditor();

  // Recursive function to group elements based on parent-child relationships
  const groupElementsByParent = (serializedData: any) => {
    const pageElement: any = {
      id: 'root',
      type: 'page',
      children: [],
      elements: {}
    };

    // Helper function to build hierarchical structure
    const buildHierarchy = (nodeId: string, parentElement: any): any => {
      const node = serializedData[nodeId];
      if (!node) return null;

      const element = {
        id: nodeId,
        type: node.type?.resolvedName || node.type || 'unknown',
        displayName: node.displayName || node.type?.resolvedName || 'Element',
        props: node.props || {},
        custom: node.custom || {},
        parent: node.parent || null,
        children: [],
        nodes: node.nodes || [],
        linkedNodes: node.linkedNodes || {}
      };

      // Process regular child nodes
      if (node.nodes && Array.isArray(node.nodes)) {
        element.children = node.nodes
          .map(childId => buildHierarchy(childId, element))
          .filter(child => child !== null);
      }

      // Process linked nodes (like canvas areas)
      if (node.linkedNodes) {
        Object.entries(node.linkedNodes).forEach(([key, linkedNodeId]) => {
          const linkedChild = buildHierarchy(linkedNodeId as string, element);
          if (linkedChild) {
            linkedChild.linkedNodeKey = key;
            element.children.push(linkedChild);
          }
        });
      }

      // Store element in flat structure for easy access
      pageElement.elements[nodeId] = element;

      return element;
    };

    // Find root node (usually has no parent or parent is null)
    const rootNodeId = Object.keys(serializedData).find(id => 
      !serializedData[id].parent || serializedData[id].parent === null
    );

    if (rootNodeId) {
      const rootElement = buildHierarchy(rootNodeId, null);
      if (rootElement) {
        pageElement.children = [rootElement];
        pageElement.rootElement = rootElement;
      }
    }

    // Add metadata
    pageElement.metadata = {
      totalElements: Object.keys(serializedData).length,
      configId,
      flowId,
      createdAt: new Date().toISOString(),
      elementTypes: [...new Set(Object.values(serializedData).map((node: any) => 
        node.type?.resolvedName || node.type || 'unknown'
      ))]
    };

    return pageElement;
  };

  // Function to flatten hierarchy back to parent-child mapping
  const flattenToParentMapping = (pageElement: any) => {
    const parentMapping: { [key: string]: string[] } = {};
    
    const traverse = (element: any, parentId: string | null = null) => {
      if (parentId) {
        if (!parentMapping[parentId]) {
          parentMapping[parentId] = [];
        }
        parentMapping[parentId].push(element.id);
      }

      element.children?.forEach((child: any) => {
        traverse(child, element.id);
      });
    };

    pageElement.children?.forEach((rootChild: any) => {
      traverse(rootChild, 'root');
    });

    return parentMapping;
  };

  // Function to find elements by type
  const findElementsByType = (pageElement: any, elementType: string) => {
    return Object.values(pageElement.elements).filter((element: any) => 
      element.type === elementType
    );
  };

  // Function to find element path from root
  const getElementPath = (pageElement: any, elementId: string) => {
    const path: string[] = [];
    
    const findPath = (element: any, targetId: string, currentPath: string[]): boolean => {
      currentPath.push(element.id);
      
      if (element.id === targetId) {
        path.push(...currentPath);
        return true;
      }

      for (const child of element.children || []) {
        if (findPath(child, targetId, [...currentPath])) {
          return true;
        }
      }

      return false;
    };

    pageElement.children?.forEach((rootChild: any) => {
      findPath(rootChild, elementId, []);
    });

    return path;
  };

  const handleSave = async () => {
    try {
      const json = query.serialize();
      console.log("Canvas JSON:", json);

      const formattedJson = JSON.parse(json)
      
      // Create hierarchical page element structure
      const pageElement = groupElementsByParent(formattedJson);
      console.log("Page Element Structure:", pageElement);
      
      // Additional analysis
      const parentMapping = flattenToParentMapping(pageElement);
      console.log("Parent-Child Mapping:", parentMapping);
      
      // Save both original and structured data
      const response = await fetch(`/api/family-tree/canvas/${configId}?flowId=${flowId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          canvasData: json,
          pageElement: JSON.stringify(pageElement),
          parentMapping: JSON.stringify(parentMapping),
          configId: configId,
          flowId: flowId,
          updatedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        alert(`Canvas saved successfully for flow: ${flowId}`);
      } else {
        throw new Error('Failed to save canvas');
      }
    } catch (error) {
      console.error('Error saving canvas:', error);
      alert("Error saving canvas. Please try again.");
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
      // Clear the canvas by resetting to initial state
      actions.clearEvents();
      window.location.reload(); // Simple way to reset the canvas
    }
  };

  const handleExport = () => {
    const json = query.serialize();
    const pageElement = groupElementsByParent(json);
    const parentMapping = flattenToParentMapping(pageElement);
    
    const exportData = {
      originalCanvas: json,
      pageElement: pageElement,
      parentMapping: parentMapping,
      analysis: {
        totalElements: pageElement.metadata.totalElements,
        elementTypes: pageElement.metadata.elementTypes,
        hierarchyDepth: getMaxDepth(pageElement),
        containers: findElementsByType(pageElement, 'Container'),
        innerContainers: findElementsByType(pageElement, 'InnerContainer'),
        buttons: findElementsByType(pageElement, 'Button'),
        textComponents: findElementsByType(pageElement, 'TextComponent'),
        inputFields: findElementsByType(pageElement, 'InputField')
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `canvas-export-${flowId}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Helper function to calculate maximum depth of hierarchy
  const getMaxDepth = (pageElement: any): number => {
    const calculateDepth = (element: any, currentDepth = 0): number => {
      if (!element.children || element.children.length === 0) {
        return currentDepth;
      }

      return Math.max(
        ...element.children.map((child: any) => 
          calculateDepth(child, currentDepth + 1)
        )
      );
    };

    if (!pageElement.children || pageElement.children.length === 0) {
      return 0;
    }

    return Math.max(
      ...pageElement.children.map((child: any) => calculateDepth(child, 1))
    );
  };

  // Function to analyze element structure
  const analyzePageElement = () => {
    const json = query.serialize();
    const pageElement = groupElementsByParent(json);
    
    console.group("📊 Page Element Analysis");
    console.log("🏗️ Complete Structure:", pageElement);
    console.log("📈 Metadata:", pageElement.metadata);
    console.log("🔗 Parent Mapping:", flattenToParentMapping(pageElement));
    console.log("📏 Hierarchy Depth:", getMaxDepth(pageElement));
    
    // Log element types breakdown
    pageElement.metadata.elementTypes.forEach((type: string) => {
      const elements = findElementsByType(pageElement, type);
      console.log(`🔹 ${type}: ${elements.length} elements`);
    });
    
    console.groupEnd();
    
    return pageElement;
  };

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      height: "70px",
      background: "#ffffff",
      borderTop: "1px solid #ddd",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
      zIndex: 1000,
      padding: "0 20px"
    }}>
      <button
        onClick={handleSave}
        style={{
          padding: "10px 20px",
          background: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "14px",
          boxShadow: "0 2px 4px rgba(40, 167, 69, 0.2)"
        }}
      >
        💾 Save Canvas
      </button>

      <button
        onClick={analyzePageElement}
        style={{
          padding: "10px 20px",
          background: "#6f42c1",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "14px",
          boxShadow: "0 2px 4px rgba(111, 66, 193, 0.2)"
        }}
      >
        📊 Analyze Structure
      </button>

      <button
        onClick={handleExport}
        style={{
          padding: "10px 20px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "14px",
          boxShadow: "0 2px 4px rgba(0, 123, 255, 0.2)"
        }}
      >
        📤 Export JSON
      </button>

      <button
        onClick={handleCancel}
        style={{
          padding: "10px 20px",
          background: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "14px",
          boxShadow: "0 2px 4px rgba(220, 53, 69, 0.2)"
        }}
      >
        ❌ Cancel
      </button>
    </div>
  );
};

export default FooterBar;