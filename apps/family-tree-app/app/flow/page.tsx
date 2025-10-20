"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./flow.module.scss";
import { describe } from "node:test";

interface Configuration {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface AppFlow {
  id: string;
  flowName: string;
  description: string;
  configId: string;
  createdAt: string;
}

interface FormData {
  id: string;
  name: string;
  description: string;
}

export default function FlowLandingPage() {
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [appFlows, setAppFlows] = useState<AppFlow[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<string>("");
  const [selectedFlowId, setSelectedFlowId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [flowsLoading, setFlowsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({ id: "", name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchConfigurations();
  }, []);

  useEffect(() => {
    if (selectedConfigId) {
      fetchAppFlows(selectedConfigId);
    } else {
      setAppFlows([]);
      setSelectedFlowId("");
    }
  }, [selectedConfigId]);

  const fetchConfigurations = async () => {
    try {
      const response = await fetch('/api/family-tree/configurations');
      if (response.ok) {
        const data = await response.json();
        setConfigurations(data || []);
      } else {
        console.error('Failed to fetch configurations');
      }
    } catch (error) {
      console.error('Error fetching configurations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppFlows = async (configId: string) => {
    setFlowsLoading(true);
    try {
      const response = await fetch(`/api/family-tree/flows?configId=${configId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched flows data:', data);
        // Ensure flows is an array and each flow has required properties
        const validFlows = (data.flows || []).filter((flow: any) => {
          console.log('Validating flow:', flow);
          return flow && typeof flow === 'object' && flow.id && flow.flowName;
        });
        console.log('Valid flows:', validFlows);
        setAppFlows(validFlows);
      } else {
        console.error('Failed to fetch app flows');
        setAppFlows([]);
      }
    } catch (error) {
      console.error('Error fetching app flows:', error);
      setAppFlows([]);
    } finally {
      setFlowsLoading(false);
    }
  };

  const handleCreateAppFlow = async (e: React.FormEvent) => {
    console.log('handleCreateAppFlow called', { formData, selectedConfigId });
    e.preventDefault();
    
    if (!formData.name.trim()) {
      console.log('Validation failed: name is empty');
      showNotification('App flow name is required', 'error');
      return;
    }

    if (!selectedConfigId) {
      console.log('Validation failed: no config selected');
      showNotification('Please select a configuration first', 'error');
      return;
    }

    console.log('Setting submitting to true...');
    setSubmitting(true);
    
    try {
      console.log('Making API request to /api/family-tree/flows with data:', {
        id: formData.id.trim(),
        flowName: formData.name.trim(),
        description: formData.description.trim(),
        configId: selectedConfigId,
      });
      
      const response = await fetch('/api/family-tree/flows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: formData.id.trim(),
          flowName: formData.name.trim(),
          description: formData.description.trim(),
          configId: selectedConfigId,
        }),
      });
      
      console.log('API response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('API response data:', result);
        
        // Validate the created flow before adding to state
        if (result.flow && result.flow.id && result.flow.flowName) {
          console.log('Adding flow to state:', result.flow);
          setAppFlows([...appFlows, result.flow]);
        } else {
          console.log('Flow validation failed:', result);
        }
        
        console.log('Resetting form and closing modal...');
        setFormData({ id: "", name: "", description: "" });
        fetchAppFlows(selectedConfigId);
        setShowModal(false);
        showNotification('App flow created successfully!', 'success');
      } else {
        console.log('API request failed with status:', response.status);
        const error = await response.json();
        console.log('Error response:', error);
        showNotification(error.error || 'Failed to create app flow', 'error');
      }
    } catch (error) {
      console.error('Error creating app flow:', error);
      showNotification('An error occurred while creating the app flow', 'error');
    } finally {
      console.log('Setting submitting to false...');
      setSubmitting(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const filteredAppFlows = appFlows.filter(flow => {
    // Ensure flow exists and has required properties
    if (!flow || !flow.id) return false;
    
    // If no search term, include all valid flows
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const flowName = (flow.flowName || '').toLowerCase();
    const description = (flow.description || '').toLowerCase();
    
    return flowName.includes(searchLower) || description.includes(searchLower);
  });

  const selectedConfiguration = configurations.find(config => config.id === selectedConfigId);
  const selectedFlow = appFlows.find(flow => flow.id === selectedFlowId);

  // Spinner Component
  const Spinner = ({ size = 'normal', className = '' }: { size?: 'normal' | 'large'; className?: string }) => (
    <div className={`${styles.spinner} ${size === 'large' ? styles.largeSpinner : ''} ${className}`}></div>
  );

  // Loading Container Component
  const LoadingContainer = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className={styles.loadingContainer}>
      <Spinner size="large" />
      <p className={styles.loadingText}>{title}</p>
      {subtitle && <p className={styles.loadingSubtext}>{subtitle}</p>}
    </div>
  );

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <LoadingContainer 
            title="Loading Configurations..." 
            subtitle="Please wait while we fetch your configurations"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Notification */}
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      <div className={styles.container}>
        <h1 className={styles.heading}>App Flow Management</h1>
        <p className={styles.subheading}>Select a configuration and manage its app flows</p>

        {/* Configuration Dropdown */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Select Configuration:</label>
          <select
            value={selectedConfigId}
            onChange={(e) => setSelectedConfigId(e.target.value)}
            className={styles.dropdown}
            disabled={configurations.length === 0}
          >
            <option value="">
              {configurations.length === 0 
                ? "-- No configurations available --" 
                : "-- Select Configuration --"
              }
            </option>
            {configurations.map((config) => (
              <option key={config.id} value={config.id}>
                {config.name}
              </option>
            ))}
          </select>
        </div>

        {/* App Flow Section */}
        {selectedConfigId && (
          <>
            <div className={styles.flowSection}>
              <div className={styles.flowHeader}>
                <h3 className={styles.sectionTitle}>App Flows for: {selectedConfiguration?.name}</h3>
                <button
                  onClick={() => setShowModal(true)}
                  className={styles.createBtn}
                >
                  + Create New App Flow
                </button>
              </div>

              {/* Search */}
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search app flows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              {/* App Flow Dropdown */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Select App Flow:</label>
                {flowsLoading ? (
                  <div className={styles.inlineSpinner}>
                    <Spinner />
                    Loading related flows...
                  </div>
                ) : (
                  <select
                    value={selectedFlowId}
                    onChange={(e) => setSelectedFlowId(e.target.value)}
                    className={styles.dropdown}
                    disabled={filteredAppFlows.length === 0}
                  >
                    <option value="">-- Select App Flow --</option>
                    {filteredAppFlows.map((flow) => (
                      <option key={flow.id} value={flow.id}>
                        {flow.flowName || 'Unnamed Flow'} - {flow.description || 'No description'}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* App Flow List */}
              {flowsLoading ? (
                <LoadingContainer 
                  title="Loading App Flows..." 
                  subtitle="Fetching flows for the selected configuration"
                />
              ) : filteredAppFlows.length > 0 ? (
                <div className={styles.flowList}>
                  <h4 className={styles.listTitle}>Available App Flows:</h4>
                  {filteredAppFlows.map((flow) => (
                    <div key={flow.id} className={styles.flowItem}>
                      <div className={styles.flowInfo}>
                        <h5>{flow.flowName || 'Unnamed Flow'}</h5>
                        <p>{flow.description || 'No description'}</p>
                        <span className={styles.flowDate}>
                          Created: {flow.createdAt ? new Date(flow.createdAt).toLocaleDateString() : 'Unknown date'}
                        </span>
                      </div>
                      <Link href={`/flow/editor/${flow.id}/?configId=${selectedConfigId}`}>
                        <button className={styles.ctaBtn}>Edit Appflow</button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p>No app flows found for this configuration.</p>
                  <button
                    onClick={() => setShowModal(true)}
                    className={styles.ctaBtn}
                  >
                    Create Your First App Flow
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          {selectedFlowId && (
            <Link href={`/canvas/editor/${selectedConfigId}/${selectedFlowId}`}>
              <button className={styles.primaryBtn}>Open Selected Flow Canvas</button>
            </Link>
          )}
          <Link href="/configurations">
            <button className={styles.secondaryBtn}>Manage Configurations</button>
          </Link>
        </div>
      </div>

      {/* Create App Flow Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Create New App Flow</h2>
              <button
                onClick={() => setShowModal(false)}
                className={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <form 
              onSubmit={handleCreateAppFlow} 
              className={styles.form}
              onInvalid={(e) => console.log('Form invalid:', e)}
              onChange={(e) => console.log('Form changed:', e.target.value)}
            >
              <div className={styles.formGroup}>
                <label htmlFor="flowName">
                  App Flow Name *
                </label>
                <input
                  type="text"
                  id="flowName"
                  value={formData.name}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    name: e.target.value, 
                    id: e.target.value.replace(/\s+/g, '_') 
                  })}
                  placeholder="Enter app flow name"
                  className={styles.input}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="flowDescription">
                  Description
                </label>
                <textarea
                  id="flowDescription"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Enter app flow description (optional)"
                  className={styles.textarea}
                />
              </div>
              
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={styles.saveButton}
                  onClick={(e) => {
                    console.log('Submit button clicked', { submitting, formData });
                  }}
                >
                  {submitting && <Spinner />}
                  {submitting ? 'Creating...' : 'Save App Flow'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
