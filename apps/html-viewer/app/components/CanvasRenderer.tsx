import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface CanvasRendererProps {
    canvasData: any;
    canvasName: string;
    onNext?: () => void;
}

interface ButtonProps {
    text?: string;
    children?: string;
    actionType?: 'submit' | 'navigation' | 'secondary' | 'danger' | 'warning' | 'custom';
    onClick?: () => void;
    style?: React.CSSProperties;
    tooltip?: string;
    title?: string;
    disabled?: boolean;
}

interface FormField {
    name: string;
    type: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    validation?: {
        regex?: string;
        regexMessage?: string;
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
        customRules?: Array<{
            rule: string;
            message: string;
        }>;
    };
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({ canvasData, canvasName, onNext }) => {
    // Extract form fields from canvas data
    const extractFormFields = (element: any, fields: FormField[] = []): FormField[] => {
        if (!element) return fields;

        // Check if current element is a form field
        if (element.type === 'InputField') {
            const fieldName = element.props?.name || `field_${fields.length}`;
            
            // Extract validation rules from element props
            const validation: any = {};
            
            // Regex validation
            if (element.props?.regex) {
                validation.regex = element.props.regex;
                validation.regexMessage = element.props?.regexMessage || 'Invalid format';
            }
            
            // Length validations
            if (element.props?.minLength !== undefined) {
                validation.minLength = element.props.minLength;
            }
            if (element.props?.maxLength !== undefined) {
                validation.maxLength = element.props.maxLength;
            }
            
            // Numeric validations (for number inputs)
            if (element.props?.min !== undefined) {
                validation.min = element.props.min;
            }
            if (element.props?.max !== undefined) {
                validation.max = element.props.max;
            }
            
            // Custom validation rules
            if (element.props?.customValidation) {
                validation.customRules = element.props.customValidation;
            }
            
            fields.push({
                name: fieldName,
                type: element.props?.type || 'text',
                label: element.props?.label || element.props?.placeholder,
                placeholder: element.props?.placeholder,
                required: element.props?.required || element.props?.mandatory || false,
                validation: Object.keys(validation).length > 0 ? validation : undefined,
            });
        }

        // Recursively check children
        if (element.children && Array.isArray(element.children)) {
            element.children.forEach((child: any) => {
                extractFormFields(child, fields);
            });
        }

        return fields;
    };

    // Generate initial values for Formik
    const generateInitialValues = (fields: FormField[]) => {
        const values: { [key: string]: string } = {};
        fields.forEach(field => {
            values[field.name] = '';
        });
        return values;
    };

    // Generate validation schema
    const generateValidationSchema = (fields: FormField[]) => {
        const schemaFields: { [key: string]: any } = {};
        
        fields.forEach(field => {
            let validator: any;
            
            // Determine base validator type
            if (field.type === 'number') {
                validator = Yup.number().typeError(`${field.label || field.name} must be a number`);
            } else if (field.type === 'email') {
                validator = Yup.string().email('Invalid email address');
            } else if (field.type === 'url') {
                validator = Yup.string().url('Invalid URL format');
            } else {
                validator = Yup.string();
            }
            
            // Required field validation
            if (field.required) {
                validator = validator.required(`${field.label || field.name} is required`);
            }
            
            // Apply validation rules if they exist
            if (field.validation) {
                const rules = field.validation;
                
                // Regex validation
                if (rules.regex) {
                    try {
                        const regexPattern = new RegExp(rules.regex);
                        validator = validator.matches(
                            regexPattern, 
                            rules.regexMessage || 'Invalid format'
                        );
                    } catch (e) {
                        console.warn(`Invalid regex pattern for field ${field.name}:`, rules.regex);
                    }
                }
                
                // Length validations (for strings)
                if (field.type !== 'number') {
                    if (rules.minLength !== undefined) {
                        validator = validator.min(
                            rules.minLength, 
                            `${field.label || field.name} must be at least ${rules.minLength} characters`
                        );
                    }
                    if (rules.maxLength !== undefined) {
                        validator = validator.max(
                            rules.maxLength, 
                            `${field.label || field.name} must not exceed ${rules.maxLength} characters`
                        );
                    }
                }
                
                // Numeric validations (for numbers)
                if (field.type === 'number') {
                    if (rules.min !== undefined) {
                        validator = validator.min(
                            rules.min, 
                            `${field.label || field.name} must be at least ${rules.min}`
                        );
                    }
                    if (rules.max !== undefined) {
                        validator = validator.max(
                            rules.max, 
                            `${field.label || field.name} must not exceed ${rules.max}`
                        );
                    }
                }
                
                // Custom validation rules
                if (rules.customRules && Array.isArray(rules.customRules)) {
                    rules.customRules.forEach(customRule => {
                        if (customRule.rule && customRule.message) {
                            try {
                                // Support for common validation patterns
                                switch (customRule.rule) {
                                    case 'noSpaces':
                                        validator = validator.test(
                                            'no-spaces',
                                            customRule.message,
                                            (value: string) => !value || !/\s/.test(value)
                                        );
                                        break;
                                    case 'alphanumeric':
                                        validator = validator.matches(
                                            /^[a-zA-Z0-9]*$/,
                                            customRule.message
                                        );
                                        break;
                                    case 'alphabetic':
                                        validator = validator.matches(
                                            /^[a-zA-Z\s]*$/,
                                            customRule.message
                                        );
                                        break;
                                    case 'numeric':
                                        validator = validator.matches(
                                            /^[0-9]*$/,
                                            customRule.message
                                        );
                                        break;
                                    case 'phone':
                                        validator = validator.matches(
                                            /^[\+]?[0-9\s\-\(\)]+$/,
                                            customRule.message
                                        );
                                        break;
                                    case 'strongPassword':
                                        validator = validator.matches(
                                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                                            customRule.message
                                        );
                                        break;
                                    default:
                                        // Try to use the rule as a regex pattern
                                        try {
                                            const customRegex = new RegExp(customRule.rule);
                                            validator = validator.matches(customRegex, customRule.message);
                                        } catch (e) {
                                            console.warn(`Invalid custom rule for field ${field.name}:`, customRule.rule);
                                        }
                                        break;
                                }
                            } catch (e) {
                                console.warn(`Error applying custom rule for field ${field.name}:`, e);
                            }
                        }
                    });
                }
            }
            
            schemaFields[field.name] = validator;
        });
        
        return Yup.object(schemaFields);
    };

    // Helper function to render element as React component
    const renderElement = (element: any, formFields: FormField[]): React.ReactNode => {
        if (!element) return null;

        const key = element.id || Math.random().toString(36);

        switch (element.type) {
            case 'Label':
                return (
                    <label
                        key={key}
                        style={{
                            display: 'block',
                            margin: '10px 0',
                            fontWeight: 'bold',
                            color: '#333'
                        }}
                    >
                        {element.props?.text || element.props?.label || 'Label'}
                    </label>
                );

            case 'Button':
                // Enhanced Button component with configurable action types
                const actionType = element.props?.actionType || 'navigation'; // 'submit', 'navigation', 'custom'
                const buttonType = actionType === 'submit' ? 'submit' : 'button';
                
                // Style based on action type
                const getButtonStyle = () => {
                    const baseStyle = {
                        padding: '12px 24px',
                        margin: '10px 5px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s ease'
                    };

                    // Default colors based on action type
                    let typeStyle = {};
                    switch (actionType) {
                        case 'submit':
                            typeStyle = {
                                background: '#28a745',
                                color: 'white'
                            };
                            break;
                        case 'navigation':
                            typeStyle = {
                                background: '#007bff',
                                color: 'white'
                            };
                            break;
                        case 'secondary':
                            typeStyle = {
                                background: '#6c757d',
                                color: 'white'
                            };
                            break;
                        case 'danger':
                            typeStyle = {
                                background: '#dc3545',
                                color: 'white'
                            };
                            break;
                        case 'warning':
                            typeStyle = {
                                background: '#ffc107',
                                color: '#212529'
                            };
                            break;
                        case 'custom':
                        default:
                            typeStyle = {
                                background: '#667eea',
                                color: 'white'
                            };
                            break;
                    }

                    // Allow style overrides from props
                    return {
                        ...baseStyle,
                        ...typeStyle,
                        ...element.props?.style
                    };
                };

                return (
                    <button
                        key={key}
                        type={buttonType}
                        style={getButtonStyle()}
                        onClick={(e) => {
                            // Execute custom onClick if defined
                            if (element.props?.onClick) {
                                element.props.onClick();
                            }
                            
                            // Handle different action types
                            switch (actionType) {
                                case 'submit':
                                    // For submit buttons, let the form handle submission naturally
                                    // Don't prevent default - let the form's onSubmit handle it
                                    console.log('Submit button clicked - letting form handle submission');
                                    break;
                                
                                case 'navigation':
                                    // Prevent default and navigate to next node
                                    e.preventDefault();
                                    if (onNext) {
                                        onNext();
                                    }
                                    break;
                                
                                case 'custom':
                                    // Custom actions are handled entirely by the onClick prop
                                    // No default behavior unless specified
                                    break;
                                
                                default:
                                    // Default to navigation behavior
                                    e.preventDefault();
                                    if (onNext) {
                                        onNext();
                                    }
                                    break;
                            }
                        }}
                        title={element.props?.tooltip || element.props?.title}
                    >
                        {element.props?.text || element.props?.children || 'Button'}
                    </button>
                );

            case 'TextComponent':
                return (
                    <div
                        key={key}
                        style={{
                            margin: '10px 0',
                            color: '#333'
                        }}
                    >
                        {element.props?.text || 'Text Component'}
                    </div>
                );

            case 'InputField':
                const fieldName = element.props?.name || `field_${key}`;
                const isRequired = element.props?.required || element.props?.mandatory;
                const fieldValidation = element.props?.validation || {};
                
                // Generate input attributes based on validation rules
                const inputAttributes: any = {
                    name: fieldName,
                    type: element.props?.type || 'text',
                    placeholder: element.props?.placeholder,
                };
                
                // Add HTML5 validation attributes
                if (element.props?.minLength) inputAttributes.minLength = element.props.minLength;
                if (element.props?.maxLength) inputAttributes.maxLength = element.props.maxLength;
                if (element.props?.min) inputAttributes.min = element.props.min;
                if (element.props?.max) inputAttributes.max = element.props.max;
                if (element.props?.regex) inputAttributes.pattern = element.props.regex;
                if (isRequired) inputAttributes.required = true;
                
                return (
                    <div key={key} style={{ margin: '10px 0' }}>
                        {element.props?.label && (
                            <label
                                htmlFor={fieldName}
                                style={{
                                    display: 'block',
                                    marginBottom: '5px',
                                    fontWeight: 'bold',
                                    color: '#333'
                                }}
                            >
                                {element.props.label}
                                {isRequired && <span style={{ color: 'red' }}> *</span>}
                            </label>
                        )}
                        
                        {/* Validation hints */}
                        {(element.props?.hint || fieldValidation || element.props?.regex) && (
                            <div style={{
                                fontSize: '12px',
                                color: '#666',
                                marginBottom: '4px',
                                fontStyle: 'italic'
                            }}>
                                {element.props?.hint && <div>{element.props.hint}</div>}
                                {element.props?.minLength && (
                                    <div>Min length: {element.props.minLength} characters</div>
                                )}
                                {element.props?.maxLength && (
                                    <div>Max length: {element.props.maxLength} characters</div>
                                )}
                                {element.props?.regex && element.props?.regexMessage && (
                                    <div>Format: {element.props.regexMessage}</div>
                                )}
                            </div>
                        )}
                        
                        <Field
                            {...inputAttributes}
                            style={{
                                padding: '8px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                width: '100%',
                                maxWidth: '300px',
                                fontSize: '14px'
                            }}
                        />
                        <ErrorMessage name={fieldName}>
                            {msg => <div style={{
                                color: '#dc3545',
                                fontSize: '12px',
                                marginTop: '4px',
                                fontWeight: '500'
                            }}>{msg}</div>}
                        </ErrorMessage>
                    </div>
                );
            case 'Container':
                const containerStyle: React.CSSProperties = {
                    padding: '15px',
                    margin: '10px 0',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    background: '#fff',
                    ...element.props?.style
                };

                return (
                    <div key={key} style={containerStyle}>
                        {element.children && element.children.length > 0 ? (
                            element.children.map((child: any, index: number) =>
                                renderElement(child, formFields)
                            )
                        ) : (
                            <div style={{
                                color: '#666',
                                fontStyle: 'italic',
                                textAlign: 'center',
                                padding: '20px'
                            }}>
                                Empty Container
                            </div>
                        )}
                    </div>
                );

            case 'InnerContainer':
                return (
                    <div
                        key={key}
                        style={{
                            padding: '10px',
                            margin: '5px 0',
                            border: '1px dashed #bbb',
                            borderRadius: '6px',
                            background: '#f9f9f9'
                        }}
                    >
                        {element.children && element.children.length > 0 ? (
                            element.children.map((child: any, index: number) =>
                                renderElement(child, formFields)
                            )
                        ) : (
                            <div style={{
                                color: '#999',
                                fontStyle: 'italic',
                                textAlign: 'center',
                                padding: '15px'
                            }}>
                                Inner Container
                            </div>
                        )}
                    </div>
                );
            case 'div':
                const divStyle: React.CSSProperties = {
                    margin: '5px 0',
                    ...element.props?.style
                };

                return (
                    <div key={key} style={divStyle}>
                        {element.props?.children && typeof element.props.children === 'string' && (
                            element.props.children
                        )}
                        {element.children && element.children.length > 0 && (
                            element.children.map((child: any) =>
                                renderElement(child, formFields)
                            )
                        )}
                    </div>
                );

            case 'SubmitButton':
                // Handle form submission button - triggers validation and submission
                return (
                    <button
                        key={key}
                        type="submit"
                        style={{
                            padding: '12px 24px',
                            margin: '10px 5px',
                            background: element.props?.style?.backgroundColor || '#28a745',
                            color: element.props?.style?.color || 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '600',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            ...element.props?.style
                        }}
                        onClick={(e) => {
                            console.log('🎯 SubmitButton clicked - will trigger form submission');
                            // Execute custom onClick if defined
                            if (element.props?.onClick) {
                                element.props.onClick();
                            }
                            // Don't prevent default - let the form handle submission
                        }}
                    >
                        {element.props?.text || element.props?.children || 'Submit'}
                    </button>
                );

            case 'CTAButton':
            case 'ActionButton':
                // Handle specialized button types that are specifically for navigation
                return (
                    <button
                        key={key}
                        type="button"
                        style={{
                            padding: '12px 24px',
                            margin: '10px 5px',
                            background: element.props?.style?.backgroundColor || '#28a745',
                            color: element.props?.style?.color || 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '600',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            ...element.props?.style
                        }}
                        onClick={() => {
                            // Execute custom onClick if defined
                            if (element.props?.onClick) {
                                element.props.onClick();
                            }
                            
                            // Navigate to next node - this is the primary purpose of CTA buttons
                            if (onNext) {
                                onNext();
                            }
                        }}
                    >
                        {element.props?.text || element.props?.children || 'Continue'}
                    </button>
                );

            case 'Link':
            case 'LinkButton':
                // Handle link-style CTAs
                return (
                    <button
                        key={key}
                        type="button"
                        style={{
                            padding: '8px 16px',
                            margin: '5px',
                            background: 'transparent',
                            color: element.props?.style?.color || '#667eea',
                            border: `2px solid ${element.props?.style?.borderColor || '#667eea'}`,
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            textDecoration: 'none',
                            ...element.props?.style
                        }}
                        onClick={() => {
                            if (element.props?.onClick) {
                                element.props.onClick();
                            }
                            if (onNext) {
                                onNext();
                            }
                        }}
                    >
                        {element.props?.text || element.props?.children || 'Next'}
                    </button>
                );

            default:
                return (
                    <div
                        key={key}
                        style={{
                            margin: '10px 0',
                            padding: '10px',
                            background: '#e9ecef',
                            borderRadius: '4px',
                            color: '#666'
                        }}
                    >
                        [{element.displayName || element.type}]
                    </div>
                );
        }
    };

    // Extract form fields from canvas data
    let formFields: FormField[] = [];
    let rootElement = null;

    if (canvasData?.elements) {
        if (canvasData.rootElement) {
            rootElement = canvasData.rootElement;
        } else if (canvasData.elements.ROOT) {
            rootElement = canvasData.elements.ROOT;
        } else {
            // Find root elements
            const rootElements = Object.values(canvasData.elements).filter((element: any) =>
                element.parent === null || element.parent === 'ROOT'
            );
            if (rootElements.length > 0) {
                rootElement = rootElements[0];
            }
        }

        if (rootElement) {
            formFields = extractFormFields(rootElement);
            console.log('📋 Extracted form fields:', formFields);
            console.log('🌳 Root element:', rootElement);
        }
    }

    // Check if there are any submit buttons in the canvas
    const hasSubmitButtons = (element: any): boolean => {
        if (!element) return false;
        
        if (element.type === 'SubmitButton' || 
            (element.type === 'Button' && element.props?.actionType === 'submit')) {
            return true;
        }
        
        if (element.children) {
            return element.children.some((child: any) => hasSubmitButtons(child));
        }
        
        return false;
    };

    const needsFormWrapper = formFields.length > 0 || hasSubmitButtons(rootElement);
    console.log('🔧 Form wrapper needed?', needsFormWrapper, '| Form fields:', formFields.length, '| Has submit buttons:', hasSubmitButtons(rootElement));

    const initialValues = generateInitialValues(formFields);
    const validationSchema = generateValidationSchema(formFields);

    const handleSubmit = (values: any, { setSubmitting }: any) => {
        console.log('🎯 handleSubmit called with values:', values);
        console.log('📝 Form fields extracted:', formFields);
        
        // Handle form submission here
        setTimeout(() => {
            console.log('✅ Form submission completed');
            alert(`Form Submitted Successfully!\n\n${JSON.stringify(values, null, 2)}`);
            setSubmitting(false);
            
            // Navigate to next node if onNext is available
            if (onNext) {
                console.log('🔄 Navigating to next node...');
                onNext();
            }
        }, 400);
    };

    if (!canvasData) {
        return (
            <div style={{
                fontSize: '1rem',
                color: '#333',
                marginBottom: '32px'
            }}>
                <p style={{ color: '#666', fontStyle: 'italic' }}>
                    Empty canvas - no components found.
                </p>
            </div>
        );
    }

    return (
        <div style={{
            fontSize: '1rem',
            color: '#333',
            marginBottom: '32px'
        }}>
            <div style={{
                background: '#f5f5f5',
                padding: '20px',
                borderRadius: '8px'
            }}>
                <h2 style={{
                    color: '#764ba2',
                    marginBottom: '20px'
                }}>
                    🎨 {canvasName}
                </h2>

                {needsFormWrapper ? (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, values, errors, touched }) => {
                            console.log('📝 Formik form rendered with fields:', formFields.length);
                            console.log('🎛️ Current form values:', values);
                            return (
                                <Form>
                                    {rootElement && renderElement(rootElement, formFields)}

                                {/* Debug information */}
                                <details style={{ marginTop: '20px' }}>
                                    <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                        Debug: Form State
                                    </summary>
                                    <pre style={{
                                        background: '#f8f9fa',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        marginTop: '10px'
                                    }}>
                                        Values: {JSON.stringify(values, null, 2)}
                                        {Object.keys(errors).length > 0 && (
                                            `\nErrors: ${JSON.stringify(errors, null, 2)}`
                                        )}
                                    </pre>
                                </details>
                            </Form>
                            );
                        }}
                    </Formik>
                ) : (
                    <div>
                        {rootElement ? renderElement(rootElement, formFields) : (
                            <p style={{ color: '#666', fontStyle: 'italic' }}>
                                Empty canvas - no components found.
                            </p>
                        )}
                        
                        {/* Canvas buttons handle navigation through their onClick events */}
                        {/* No separate Continue button needed - use canvas-designed CTAs */}
                    </div>
                )}
            </div>
        </div>
    );
};