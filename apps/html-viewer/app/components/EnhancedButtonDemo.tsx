import React from 'react';
import { CanvasRenderer } from './CanvasRenderer';

export const EnhancedButtonDemo: React.FC = () => {
    // Sample canvas data showcasing all button action types
    const sampleCanvasData = {
        elements: {
            ROOT: {
                id: 'ROOT',
                type: 'Container',
                parent: null,
                props: {
                    style: {
                        backgroundColor: '#ffffff',
                        padding: '20px',
                        borderRadius: '8px'
                    }
                },
                children: [
                    {
                        id: 'title',
                        type: 'TextComponent',
                        props: {
                            text: 'Enhanced Button Component Demo'
                        }
                    },
                    {
                        id: 'description',
                        type: 'TextComponent',
                        props: {
                            text: 'This demo showcases the enhanced Button component with different actionType properties.'
                        }
                    },
                    {
                        id: 'name-field',
                        type: 'InputField',
                        props: {
                            name: 'fullName',
                            type: 'text',
                            label: 'Full Name',
                            placeholder: 'Enter your name',
                            required: true
                        }
                    },
                    {
                        id: 'email-field',
                        type: 'InputField',
                        props: {
                            name: 'email',
                            type: 'email',
                            label: 'Email',
                            placeholder: 'Enter your email',
                            required: true
                        }
                    },
                    {
                        id: 'buttons-section',
                        type: 'TextComponent',
                        props: {
                            text: '--- Button Action Types Demo ---'
                        }
                    },
                    {
                        id: 'submit-button',
                        type: 'Button',
                        props: {
                            text: 'Submit Form',
                            actionType: 'submit',
                            tooltip: 'Submit the form with validation'
                        }
                    },
                    {
                        id: 'navigation-button',
                        type: 'Button',
                        props: {
                            text: 'Navigate Next',
                            actionType: 'navigation',
                            tooltip: 'Navigate to next step'
                        }
                    },
                    {
                        id: 'secondary-button',
                        type: 'Button',
                        props: {
                            text: 'Secondary Action',
                            actionType: 'secondary',
                            tooltip: 'Secondary button style'
                        }
                    },
                    {
                        id: 'danger-button',
                        type: 'Button',
                        props: {
                            text: 'Delete/Cancel',
                            actionType: 'danger',
                            tooltip: 'Dangerous action'
                        }
                    },
                    {
                        id: 'warning-button',
                        type: 'Button',
                        props: {
                            text: 'Warning Action',
                            actionType: 'warning',
                            tooltip: 'Warning style button'
                        }
                    },
                    {
                        id: 'custom-button',
                        type: 'Button',
                        props: {
                            text: 'Custom Style',
                            actionType: 'custom',
                            tooltip: 'Custom styled button',
                            style: {
                                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '20px'
                            },
                            onClick: () => {
                                alert('Custom button clicked with custom styling!');
                            }
                        }
                    }
                ]
            }
        },
        rootElement: {
            id: 'ROOT',
            type: 'Container',
            parent: null,
            props: {
                style: {
                    backgroundColor: '#ffffff',
                    padding: '20px',
                    borderRadius: '8px'
                }
            },
            children: [
                {
                    id: 'title',
                    type: 'TextComponent',
                    props: {
                        text: 'Enhanced Button Component Demo'
                    }
                },
                {
                    id: 'description',
                    type: 'TextComponent',
                    props: {
                        text: 'This demo showcases the enhanced Button component with different actionType properties.'
                    }
                },
                {
                    id: 'name-field',
                    type: 'InputField',
                    props: {
                        name: 'fullName',
                        type: 'text',
                        label: 'Full Name',
                        placeholder: 'Enter your name',
                        required: true
                    }
                },
                {
                    id: 'email-field',
                    type: 'InputField',
                    props: {
                        name: 'email',
                        type: 'email',
                        label: 'Email',
                        placeholder: 'Enter your email',
                        required: true
                    }
                },
                {
                    id: 'buttons-section',
                    type: 'TextComponent',
                    props: {
                        text: '--- Button Action Types Demo ---'
                    }
                },
                {
                    id: 'submit-button',
                    type: 'Button',
                    props: {
                        text: 'Submit Form',
                        actionType: 'submit',
                        tooltip: 'Submit the form with validation'
                    }
                },
                {
                    id: 'navigation-button',
                    type: 'Button',
                    props: {
                        text: 'Navigate Next',
                        actionType: 'navigation',
                        tooltip: 'Navigate to next step'
                    }
                },
                {
                    id: 'secondary-button',
                    type: 'Button',
                    props: {
                        text: 'Secondary Action',
                        actionType: 'secondary',
                        tooltip: 'Secondary button style'
                    }
                },
                {
                    id: 'danger-button',
                    type: 'Button',
                    props: {
                        text: 'Delete/Cancel',
                        actionType: 'danger',
                        tooltip: 'Dangerous action'
                    }
                },
                {
                    id: 'warning-button',
                    type: 'Button',
                    props: {
                        text: 'Warning Action',
                        actionType: 'warning',
                        tooltip: 'Warning style button'
                    }
                },
                {
                    id: 'custom-button',
                    type: 'Button',
                    props: {
                        text: 'Custom Style',
                        actionType: 'custom',
                        tooltip: 'Custom styled button',
                        style: {
                            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px'
                        },
                        onClick: () => {
                            alert('Custom button clicked with custom styling!');
                        }
                    }
                }
            ]
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <CanvasRenderer
                canvasData={sampleCanvasData}
                canvasName="Enhanced Button Demo"
                onNext={() => alert('Navigation triggered!')}
            />
            
            <div style={{
                marginTop: '30px',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #dee2e6'
            }}>
                <h3 style={{ color: '#495057', marginBottom: '15px' }}>
                    📋 Button Action Types
                </h3>
                <ul style={{ lineHeight: '1.6', color: '#6c757d' }}>
                    <li><strong>submit:</strong> Green button that triggers form validation and submission</li>
                    <li><strong>navigation:</strong> Blue button for navigation actions</li>
                    <li><strong>secondary:</strong> Gray button for secondary actions</li>
                    <li><strong>danger:</strong> Red button for dangerous actions (delete, cancel)</li>
                    <li><strong>warning:</strong> Yellow button for warning actions</li>
                    <li><strong>custom:</strong> Fully customizable button with custom onClick handlers</li>
                </ul>
                
                <h4 style={{ color: '#495057', marginTop: '20px', marginBottom: '10px' }}>
                    Usage Example:
                </h4>
                <pre style={{
                    backgroundColor: '#f1f3f4',
                    padding: '15px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    overflow: 'auto'
                }}>
{`{
  id: 'my-button',
  type: 'Button',
  props: {
    text: 'Submit Form',
    actionType: 'submit',        // Defines the button behavior
    tooltip: 'Submit with validation',
    style: {                     // Optional custom styling
      backgroundColor: '#custom-color'
    },
    onClick: () => {             // Optional custom handler
      // Custom logic here
    }
  }
}`}
                </pre>
            </div>
        </div>
    );
};