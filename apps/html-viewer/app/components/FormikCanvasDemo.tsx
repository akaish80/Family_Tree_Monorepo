import React from 'react';
import { CanvasRenderer } from './CanvasRenderer';

export const FormikCanvasDemo: React.FC = () => {
    // Sample canvas data with form elements
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
                            text: 'Contact Form'
                        }
                    },
                    {
                        id: 'name-field',
                        type: 'InputField',
                        props: {
                            name: 'fullName',
                            type: 'text',
                            label: 'Full Name',
                            placeholder: 'Enter your full name',
                            required: true
                        }
                    },
                    {
                        id: 'email-field',
                        type: 'InputField',
                        props: {
                            name: 'email',
                            type: 'email',
                            label: 'Email Address',
                            placeholder: 'Enter your email',
                            required: true
                        }
                    },
                    {
                        id: 'phone-field',
                        type: 'InputField',
                        props: {
                            name: 'phone',
                            type: 'tel',
                            label: 'Phone Number',
                            placeholder: 'Enter your phone number',
                            required: false
                        }
                    },
                    {
                        id: 'message-field',
                        type: 'InputField',
                        props: {
                            name: 'message',
                            type: 'text',
                            label: 'Message',
                            placeholder: 'Enter your message',
                            required: true
                        }
                    },
                    {
                        id: 'info-text',
                        type: 'TextComponent',
                        props: {
                            text: 'All required fields must be filled out before submission.'
                        }
                    },
                    {
                        id: 'submit-button',
                        type: 'SubmitButton',
                        props: {
                            text: 'Submit Form',
                            style: {
                                backgroundColor: '#28a745',
                                color: 'white'
                            }
                        }
                    },
                    {
                        id: 'enhanced-submit-button',
                        type: 'Button',
                        props: {
                            text: 'Enhanced Submit',
                            actionType: 'submit',
                            tooltip: 'Submit form with validation'
                        }
                    },
                    {
                        id: 'next-button',
                        type: 'CTAButton',
                        props: {
                            text: 'Skip & Continue',
                            style: {
                                backgroundColor: '#6c757d',
                                color: 'white'
                            }
                        }
                    },
                    {
                        id: 'enhanced-nav-button',
                        type: 'Button',
                        props: {
                            text: 'Enhanced Navigation',
                            actionType: 'navigation',
                            tooltip: 'Navigate to next step'
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
                        text: 'Contact Form'
                    }
                },
                {
                    id: 'name-field',
                    type: 'InputField',
                    props: {
                        name: 'fullName',
                        type: 'text',
                        label: 'Full Name',
                        placeholder: 'Enter your full name',
                        required: true,
                        minLength: 2,
                        maxLength: 50,
                        regex: '^[a-zA-Z\\s]+$',
                        regexMessage: 'Only letters and spaces allowed',
                        hint: 'Enter your first and last name'
                    }
                },
                {
                    id: 'email-field',
                    type: 'InputField',
                    props: {
                        name: 'email',
                        type: 'email',
                        label: 'Email Address',
                        placeholder: 'Enter your email',
                        required: true,
                        hint: 'We\'ll never share your email with anyone'
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
                        regex: '^[\\+]?[0-9\\s\\-\\(\\)]+$',
                        regexMessage: 'Valid phone number format required',
                        minLength: 10,
                        maxLength: 20,
                        hint: 'Include country code if international'
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
                        hint: 'Must be 18 or older'
                    }
                },
                {
                    id: 'username-field',
                    type: 'InputField',
                    props: {
                        name: 'username',
                        type: 'text',
                        label: 'Username',
                        placeholder: 'Choose a username',
                        required: true,
                        minLength: 3,
                        maxLength: 20,
                        regex: '^[a-zA-Z0-9_]+$',
                        regexMessage: 'Only letters, numbers, and underscores allowed',
                        hint: 'Must be unique and 3-20 characters'
                    }
                },
                {
                    id: 'message-field',
                    type: 'InputField',
                    props: {
                        name: 'message',
                        type: 'text',
                        label: 'Message',
                        placeholder: 'Enter your message',
                        required: true,
                        minLength: 10,
                        maxLength: 500,
                        hint: 'Please provide detailed information'
                    }
                },
                {
                    id: 'info-text',
                    type: 'TextComponent',
                    props: {
                        text: 'All required fields must be filled out before submission.'
                    }
                },
                {
                    id: 'cta-button',
                    type: 'CTAButton',
                    props: {
                        text: 'Submit & Continue',
                        style: {
                            backgroundColor: '#28a745',
                            color: 'white'
                        }
                    }
                }
            ]
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Formik Canvas Integration Demo</h1>
            <p>This demo shows how canvas elements are automatically converted to Formik-powered forms:</p>
            
            <CanvasRenderer 
                canvasData={sampleCanvasData} 
                canvasName="Demo Contact Form"
                onNext={() => alert('Demo: Navigating to next node...')}
            />

            <div style={{ 
                marginTop: '40px', 
                padding: '20px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px' 
            }}>
                <h3>Features Demonstrated:</h3>
                <ul>
                    <li>✅ Automatic form field detection from canvas elements</li>
                    <li>✅ Comprehensive validation with Yup schema generation</li>
                    <li>✅ Required/mandatory field validation</li>
                    <li>✅ Regex pattern validation (custom patterns)</li>
                    <li>✅ Length validation (min/max characters)</li>
                    <li>✅ Numeric validation (min/max values)</li>
                    <li>✅ Email and URL validation</li>
                    <li>✅ Custom validation rules (phone, alphanumeric, etc.)</li>
                    <li>✅ HTML5 validation attributes</li>
                    <li>✅ Field hints and validation messages</li>
                    <li>✅ Real-time form state debugging</li>
                    <li>✅ Form submission handling with validation</li>
                    <li>✅ Canvas CTA buttons control flow navigation</li>
                    <li>✅ Multiple button types: Button, CTAButton, SubmitButton, LinkButton</li>
                </ul>
            </div>
        </div>
    );
};