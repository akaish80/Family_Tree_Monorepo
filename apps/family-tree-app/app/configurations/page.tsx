'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './configurations.module.scss';

interface Configuration {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function ConfigurationsPage() {
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id:'', name: '', description: '' });
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      const response = await fetch('/api/family-tree/configurations');
      if (response.ok) {
        const data = await response.json();
        setConfigurations(data);
      } else {
        console.error('Failed to fetch configurations');
      }
    } catch (error) {
      console.error('Error fetching configurations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConfiguration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showNotification('Configuration name is required', 'error');
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await fetch('/api/family-tree/configurations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setConfigurations([result.configuration, ...configurations]);
        setFormData({ id: '', name: '', description: '' });
        setShowForm(false);
        showNotification('Configuration created successfully!', 'success');
      } else {
        const error = await response.json();
        showNotification(error.error || 'Failed to create configuration', 'error');
      }
    } catch (error) {
      showNotification('An error occurred while creating the configuration', 'error');
      console.error('Error creating configuration:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Loading configurations...</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Notification */}
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      <div className={styles.mainContent}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Configurations</h1>
            <p>Manage your family tree project configurations</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className={styles.createButton}
          >
            + Create Configuration
          </button>
        </div>

        {/* Configurations List */}
        {configurations.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📁</div>
            <h3>No configurations yet</h3>
            <p>Get started by creating your first family tree configuration</p>
            <button
              onClick={() => setShowForm(true)}
              className={styles.emptyStateButton}
            >
              Create Your First Configuration
            </button>
          </div>
        ) : (
          <div className={styles.configurationsGrid}>
            {configurations.map((config) => (
              <div key={config.id} className={styles.configurationCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardContent}>
                    <h3>{config.name}</h3>
                    <p className={styles.description}>
                      {config.description || 'No description provided'}
                    </p>
                    <p className={styles.createdDate}>
                      Created: {formatDate(config.createdAt)}
                    </p>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <Link
                    href={`/canvas/editor/${config.id}`}
                    className={styles.primaryAction}
                  >
                    Open Editor
                  </Link>
                  <button className={styles.secondaryAction}>
                    Settings
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Configuration Modal */}
      {showForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Create New Configuration</h2>
              <button
                onClick={() => setShowForm(false)}
                className={styles.closeButton}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateConfiguration} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">
                  Configuration Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, id: e.target.value })}
                  placeholder="Enter configuration name"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Enter configuration description (optional)"
                />
              </div>
              
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={styles.submitButton}
                >
                  {submitting ? 'Creating...' : 'Create Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}