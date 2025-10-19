import React from 'react';
import { CanvasRenderer } from './CanvasRenderer';

export const AdvancedValidationDemo: React.FC = () => {
    // Advanced validation demo with comprehensive examples
    const advancedCanvasData = {
        elements: {
            ROOT: {
                id: 'ROOT',
                type: 'Container',
                parent: null,
                props: {
                    style: {
                        backgroundColor: '#ffffff',
                        padding: '30px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }
                },
                children: [
                    {
                        id: 'title',
                        type: 'TextComponent',
                        props: {
                            text: '<h2 style="color: #2c3e50; margin-bottom: 20px;">Advanced Form Validation Demo</h2>'
                        }
                    },
                    {
                        id: 'username-field',
                        type: 'InputField',
                        props: {
                            name: 'username',
                            type: 'text',
                            label: 'Username',
                            placeholder: 'Enter username (3-20 chars, alphanumeric + underscore)',
                            required: true,
                            minLength: 3,
                            maxLength: 20,
                            regex: '^[a-zA-Z0-9_]+$',
                            regexMessage: 'Username can only contain letters, numbers, and underscores',
                            hint: 'Choose a unique username for your account'
                        }
                    },
                    {
                        id: 'email-field',
                        type: 'InputField',
                        props: {
                            name: 'email',
                            type: 'email',
                            label: 'Business Email',
                            placeholder: 'name@company.com',
                            required: true,
                            regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
                            regexMessage: 'Please enter a valid business email address',
                            hint: 'Corporate email addresses preferred'
                        }
                    },
                    {
                        id: 'password-field',
                        type: 'InputField',
                        props: {
                            name: 'password',
                            type: 'password',
                            label: 'Strong Password',
                            placeholder: 'Create a strong password',
                            required: true,
                            minLength: 8,
                            maxLength: 128,
                            customValidation: [
                                {
                                    rule: 'strongPassword',
                                    message: 'Password must contain uppercase, lowercase, number, and special character'
                                }
                            ],
                            hint: 'Minimum 8 characters with mixed case, numbers, and symbols'
                        }
                    },
                    {
                        id: 'phone-field',
                        type: 'InputField',
                        props: {
                            name: 'phone',
                            type: 'tel',
                            label: 'Phone Number',
                            placeholder: '+1 (555) 123-4567',
                            required: false,
                            customValidation: [
                                {
                                    rule: 'phone',
                                    message: 'Please enter a valid phone number'
                                }
                            ],
                            hint: 'International format preferred (+country code)'
                        }
                    },
                    {
                        id: 'age-field',
                        type: 'InputField',
                        props: {
                            name: 'age',
                            type: 'number',
                            label: 'Age',
                            placeholder: 'Enter your age',
                            required: true,
                            min: 18,
                            max: 120,
                            hint: 'Must be 18 or older to register'
                        }
                    },
                    {
                        id: 'website-field',
                        type: 'InputField',
                        props: {
                            name: 'website',
                            type: 'url',
                            label: 'Company Website',
                            placeholder: 'https://www.example.com',
                            required: false,
                            regex: '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$',
                            regexMessage: 'Please enter a valid URL starting with http:// or https://',
                            hint: 'Include full URL with protocol (http/https)'
                        }
                    },
                    {
                        id: 'employee-id',
                        type: 'InputField',
                        props: {
                            name: 'employeeId',
                            type: 'text',
                            label: 'Employee ID',
                            placeholder: 'EMP-12345',
                            required: true,
                            regex: '^EMP-[0-9]{5}$',
                            regexMessage: 'Employee ID must be in format: EMP-12345',
                            minLength: 9,
                            maxLength: 9,
                            hint: 'Format: EMP- followed by 5 digits'
                        }
                    },
                    {
                        id: 'bio-field',
                        type: 'InputField',
                        props: {
                            name: 'bio',
                            type: 'text',
                            label: 'Professional Bio',
                            placeholder: 'Tell us about your professional background...',
                            required: true,
                            minLength: 50,
                            maxLength: 1000,
                            hint: 'Minimum 50 characters, maximum 1000 characters'
                        }
                    },
                    {
                        id: 'validation-info',
                        type: 'TextComponent',
                        props: {
                            text: '<div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;"><strong>Validation Features:</strong><ul><li>Real-time validation as you type</li><li>Custom regex patterns</li><li>Length and numeric constraints</li><li>HTML5 validation attributes</li><li>Custom validation rules</li><li>Helpful hints and error messages</li></ul></div>'
                        }
                    },
                    {
                        id: 'submit-button',
                        type: 'SubmitButton',
                        props: {
                            text: 'Validate & Submit',
                            style: {
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                fontSize: '16px',
                                padding: '12px 24px'
                            }
                        }
                    }
                ]
            }
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ 
                marginBottom: '30px', 
                padding: '20px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px',
                border: '1px solid #dee2e6'
            }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '15px' }}>🛡️ Advanced Form Validation Demo</h1>
                <p style={{ color: '#6c757d', marginBottom: '15px' }}>
                    This demo showcases comprehensive validation capabilities including regex patterns, 
                    custom rules, length constraints, and real-time feedback.
                </p>
                <div style={{ 
                    background: '#fff3cd', 
                    padding: '10px 15px', 
                    borderRadius: '6px', 
                    border: '1px solid #ffeaa7',
                    fontSize: '14px',
                    color: '#856404'
                }}>
                    <strong>Try it:</strong> Fill out the form to see validation in action. 
                    Each field has specific requirements and will show real-time feedback.
                </div>
            </div>
            
            <CanvasRenderer 
                canvasData={advancedCanvasData} 
                canvasName="Advanced Validation Form"
                onNext={() => alert('Form validated successfully! Proceeding to next step...')}
            />

            <div style={{ 
                marginTop: '40px', 
                padding: '20px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px',
                border: '1px solid #dee2e6'
            }}>
                <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>Validation Types Demonstrated:</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                    <div>
                        <h4 style={{ color: '#495057', marginBottom: '10px' }}>📝 Field Constraints</h4>
                        <ul style={{ color: '#6c757d', fontSize: '14px' }}>
                            <li>Required/mandatory fields</li>
                            <li>Minimum/maximum length</li>
                            <li>Numeric min/max values</li>
                            <li>Field type validation</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: '#495057', marginBottom: '10px' }}>🔍 Pattern Matching</h4>
                        <ul style={{ color: '#6c757d', fontSize: '14px' }}>
                            <li>Custom regex validation</li>
                            <li>Email format validation</li>
                            <li>URL format validation</li>
                            <li>Phone number patterns</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: '#495057', marginBottom: '10px' }}>🛡️ Security Rules</h4>
                        <ul style={{ color: '#6c757d', fontSize: '14px' }}>
                            <li>Strong password requirements</li>
                            <li>Alphanumeric constraints</li>
                            <li>No spaces validation</li>
                            <li>Custom business rules</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};