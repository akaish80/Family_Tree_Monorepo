# Formik Canvas Integration

This implementation integrates Formik with the Canvas renderer to provide powerful form handling capabilities for canvas-based UI elements.

## Features

### 🚀 Automatic Form Detection
- Automatically detects `InputField` elements in canvas data
- Generates form fields with proper names, types, and validation
- Supports nested containers and complex layouts

### 📋 Advanced Form Validation
- **Yup Schema Generation**: Automatic validation schema based on field properties
- **Required Fields**: `required` or `mandatory` properties for mandatory validation
- **Type Validation**: Automatic validation for email, URL, number, and password fields
- **Length Constraints**: `minLength` and `maxLength` for text fields
- **Numeric Ranges**: `min` and `max` values for number inputs
- **Regex Patterns**: Custom `regex` patterns with custom error messages
- **Custom Rules**: Pre-built rules (phone, alphanumeric, strongPassword, etc.)
- **HTML5 Attributes**: Automatic HTML5 validation attributes
- **Real-time Feedback**: Instant validation feedback as users type
- **Field Hints**: Helpful hints and formatting guidance

### 🎨 Field Types Supported
- `text` - Standard text input
- `email` - Email input with validation
- `tel` - Phone number input
- `password` - Password input
- More types can be easily added

### 🔧 Canvas Element Support
- `InputField` - Converts to Formik Field with validation
- `Label` - Renders as form labels
- `Button` - Interactive buttons with navigation capability
- `CTAButton` - Call-to-action buttons (enhanced styling)
- `SubmitButton` - Submit buttons for forms
- `ActionButton` - Action buttons for interactions
- `Link` / `LinkButton` - Link-style navigation buttons
- `TextComponent` - Static text elements
- `Container` - Layout containers
- `InnerContainer` - Nested containers

### 🎯 Navigation & CTA Integration
All button-type elements automatically trigger navigation to the next flow node when clicked:
- Custom `onClick` handlers execute first (if defined)
- Navigation to next node happens automatically
- No separate "Continue" button needed - canvas design controls UX

## Usage

### Basic Implementation

```tsx
import { CanvasRenderer } from './components';

const MyComponent = () => {
  const canvasData = {
    rootElement: {
      type: 'Container',
      children: [
        {
          type: 'InputField',
          props: {
            name: 'email',
            type: 'email',
            label: 'Email Address',
            placeholder: 'Enter your email',
            required: true
          }
        }
      ]
    }
  };

  return (
    <CanvasRenderer 
      canvasData={canvasData} 
      canvasName="My Form" 
    />
  );
};
```

### Field Properties

```tsx
{
  type: 'InputField',
  props: {
    name: 'fieldName',        // Required: Field identifier
    type: 'text',             // Input type (text, email, tel, number, password, url)
    label: 'Field Label',     // Optional: Field label
    placeholder: 'Hint text', // Optional: Placeholder text
    required: true,           // Optional: Makes field required (or use 'mandatory')
    hint: 'Help text',        // Optional: Helper text shown below label
    
    // Length Validation
    minLength: 3,             // Minimum character length
    maxLength: 50,            // Maximum character length
    
    // Numeric Validation (for type: 'number')
    min: 0,                   // Minimum numeric value
    max: 100,                 // Maximum numeric value
    
    // Regex Validation
    regex: '^[a-zA-Z]+$',     // Custom regex pattern
    regexMessage: 'Letters only', // Custom error message for regex
    
    // Custom Validation Rules
    customValidation: [
      {
        rule: 'strongPassword',  // Pre-built rule name
        message: 'Password must be strong'
      },
      {
        rule: '^(?=.*[A-Z]).*$', // Custom regex as rule
        message: 'Must contain uppercase letter'
      }
    ]
  }
}
```

### Pre-built Validation Rules

The system includes several pre-built validation rules:

```typescript
// Available custom validation rules:
'noSpaces'       // No whitespace characters allowed
'alphanumeric'   // Only letters and numbers
'alphabetic'     // Only letters and spaces
'numeric'        // Only numbers
'phone'          // Phone number format
'strongPassword' // Strong password requirements
```

### CTA Button Types

The renderer supports multiple button types for different use cases:

```tsx
// Standard button
{
  type: 'Button',
  props: {
    text: 'Click Me',
    onClick: () => console.log('Custom action')
  }
}

// Call-to-action button (enhanced styling)
{
  type: 'CTAButton',
  props: {
    text: 'Get Started',
    style: {
      backgroundColor: '#28a745',
      color: 'white'
    }
  }
}

// Submit button for forms
{
  type: 'SubmitButton',
  props: {
    text: 'Submit Form'
  }
}

// Link-style button
{
  type: 'LinkButton',
  props: {
    text: 'Learn More',
    style: {
      borderColor: '#007bff',
      color: '#007bff'
    }
  }
}
```

All button types automatically navigate to the next flow node when clicked.

## Form Submission

The form automatically handles submission with validation:

```javascript
// Form values are collected and validated
const handleSubmit = (values, { setSubmitting }) => {
  console.log('Form submitted:', values);
  // Process form data here
  setSubmitting(false);
};
```

## Validation Schema

Validation is automatically generated based on field properties:

```javascript
// Generated schema example:
{
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  
  phone: Yup.string(),
  
  name: Yup.string()
    .required('Name is required')
}
```

## Debug Information

Each form includes a collapsible debug section showing:
- Current form values
- Validation errors
- Form state

## Canvas Data Structure

The renderer expects canvas data in this format:

```typescript
interface CanvasData {
  elements?: {
    ROOT: CanvasElement;
    [key: string]: CanvasElement;
  };
  rootElement?: CanvasElement;
}

interface CanvasElement {
  id?: string;
  type: string;
  props?: {
    [key: string]: any;
  };
  children?: CanvasElement[];
}
```

## Dependencies

- `formik` - Form library
- `yup` - Validation schema
- `react` - React framework

## Installation

```bash
npm install formik yup
npm install --save-dev @types/yup
```

## Examples

See `FormikCanvasDemo.tsx` for a complete working example with:
- Multiple field types
- Validation rules
- Form submission
- Error handling

## Extending

To add new field types:

1. Add a new case in the `renderElement` switch statement
2. Add field extraction logic in `extractFormFields`
3. Add validation rules in `generateValidationSchema`

```tsx
case 'MyCustomField':
  return (
    <div key={key}>
      <Field name={fieldName} component={MyCustomComponent} />
      <ErrorMessage name={fieldName}>
        {msg => <div className="error">{msg}</div>}
      </ErrorMessage>
    </div>
  );
```