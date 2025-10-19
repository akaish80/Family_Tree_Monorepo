'use client';

import React, { useState, useEffect } from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { 
  Button, 
  TextComponent, 
  InputField, 
  Label,
  Container, 
  InnerContainer 
} from '../components/EditorComponents';
import Toolbox from '../components/Toolbox';
import PropertyPanel from '../components/PropertyPanel';
import { FooterBar } from '../components/FooterBar';
import styles from './canvas-editor.module.scss';

interface CanvasEditorProps {
  params: Promise<{
    configid: string;
    flowid: string;
  }>;
}

export default function CanvasEditor({ params }: CanvasEditorProps) {
  const [savedCanvas, setSavedCanvas] = useState<string | null>(null);
  const [configData, setConfigData] = useState<any>(null);
  const [flowData, setFlowData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [configId, setConfigId] = useState<string>('');
  const [flowId, setFlowId] = useState<string>('');

  useEffect(() => {
    // Load existing canvas data for this config and flow
    const loadCanvas = async () => {
      try {
        setLoading(true);
        
        // Await the params Promise
        const resolvedParams = await params;
        setConfigId(resolvedParams.configid);
        setFlowId(resolvedParams.flowid);

        // Load canvas data
        const canvasResponse = await fetch(`/api/family-tree/canvas/${resolvedParams.configid}?flowId=${resolvedParams.flowid}`);
        if (canvasResponse.ok) {
          const canvasData = await canvasResponse.json();
          if (canvasData.canvasData) {
            setSavedCanvas(canvasData.canvasData);
          }
        }
      } catch (error) {
        console.error('Error loading canvas data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCanvas();
  }, [params]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <div className={styles.loadingTitle}>Loading Canvas Editor...</div>
          <div className={styles.loadingSubtitle}>Preparing your creative workspace</div>
          <div className={styles.loadingDots}>
            <div className={styles.pulseDot}></div>
            <div className={styles.pulseDot}></div>
            <div className={styles.pulseDot}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.canvasEditorContainer}>
      {/* Enhanced Header with glass effect */}
      <div className={styles.headerGlass}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <div className={styles.headerTitleSection}>
              <div className={styles.floatingBadge}>
                <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h1 className={styles.gradientText}>
                Canvas Editor
              </h1>
            </div>
            <div className={styles.statusSection}>
              <div className={styles.statusBadge}>
                <div className={`${styles.statusDot} ${styles.green}`}></div>
                <span className={styles.statusLabel}>Config:</span> 
                <span className={styles.statusValue}>{configData?.name || configId}</span>
              </div>
              <div className={styles.statusBadge}>
                <div className={`${styles.statusDot} ${styles.blue}`}></div>
                <span className={styles.statusLabel}>Flow:</span> 
                <span className={`${styles.statusValue} ${styles.purple}`}>{flowData?.name || flowId}</span>
              </div>
            </div>
          </div>
          <div className={styles.headerRight}>
            <button
              onClick={() => window.history.back()}
              className={styles.glassButton}
            >
              <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        <Editor 
          resolver={{ 
            Button, 
            TextComponent, 
            InputField, 
            Label,
            Container, 
            InnerContainer 
          }}
          onRender={({ render }) => render}
        >
          <div className={styles.mainContent}>
            {/* Enhanced Toolbox with glass effect */}
            <div className={styles.toolboxPanel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>
                <div className={styles.panelIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                  </svg>
                </div>
                <span>Component Toolbox</span>
              </h2>
              <p className={styles.panelSubtitle}>Drag components to build your canvas</p>
            </div>
            <div className={styles.panelContent}>
              <Toolbox />
            </div>
          </div>

          {/* Enhanced Canvas Area */}
          <div className={styles.canvasArea}>
            <div className={styles.canvasWorkspace}>
              <div>
                <Frame data={savedCanvas || ''}>
                  <Element 
                    is={Container} 
                    canvas
                    custom={{
                      className: styles.canvasFrame
                    }}
                  >
                    {/* Empty container ready for drag and drop */}
                  </Element>
                </Frame>
              </div>
            </div>

            {/* Enhanced Footer Bar */}
            <div className={styles.footerEnhanced}>
              <FooterBar 
                configId={configId} 
                flowId={flowId}
              />
            </div>
          </div>

          {/* Enhanced Property Panel */}
          <div className={styles.propertyPanel}>
            <div className={styles.propertyPanelHeader}>
              <h2 className={styles.panelTitle}>
                <div className={styles.propertyPanelIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <span>Properties</span>
              </h2>
              <p className={styles.panelSubtitle}>Customize selected components</p>
            </div>
            <div className={styles.panelContent}>
              <PropertyPanel />
            </div>
          </div>
        </div>
      </Editor>
      </div>
    </div>
  );
}