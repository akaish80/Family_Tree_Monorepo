# Enhanced Button Component Documentation

## Overview
The Button component in CanvasRenderer has been enhanced with configurable action types, allowing a single component to handle different button behaviors through the `actionType` property.

## Features

### Action Types
The `actionType` property determines both the visual styling and behavioral functionality of the button:

#### 1. **submit** 
- **Purpose**: Form submission with validation
- **HTML Type**: `type="submit"`
- **Behavior**: Triggers form validation and submission
- **Default Style**: Green (#28a745)
- **Use Case**: Primary form submission buttons

#### 2. **navigation**
- **Purpose**: Navigate to next step/page
- **HTML Type**: `type="button"`
- **Behavior**: Calls `onNext()` function
- **Default Style**: Blue (#007bff)
- **Use Case**: Navigation, "Continue", "Next Step" buttons

#### 3. **secondary**
- **Purpose**: Secondary actions
- **HTML Type**: `type="button"`
- **Behavior**: Navigation or custom onClick
- **Default Style**: Gray (#6c757d)
- **Use Case**: "Cancel", "Back", "Skip" buttons

#### 4. **danger**
- **Purpose**: Destructive actions
- **HTML Type**: `type="button"`
- **Behavior**: Custom onClick or navigation
- **Default Style**: Red (#dc3545)
- **Use Case**: "Delete", "Remove", "Cancel" buttons

#### 5. **warning**
- **Purpose**: Warning actions
- **HTML Type**: `type="button"`
- **Behavior**: Custom onClick or navigation
- **Default Style**: Yellow (#ffc107) with dark text
- **Use Case**: "Proceed with caution" type actions

#### 6. **custom**
- **Purpose**: Fully customizable behavior
- **HTML Type**: `type="button"`
- **Behavior**: Only executes custom onClick
- **Default Style**: Purple (#667eea)
- **Use Case**: Special actions with custom handlers

## Properties

```typescript
interface ButtonProps {
    text?: string;                    // Button text
    children?: string;                // Alternative to text
    actionType?: 'submit' | 'navigation' | 'secondary' | 'danger' | 'warning' | 'custom';
    onClick?: () => void;             // Custom click handler
    style?: React.CSSProperties;      // Custom styling (overrides defaults)
    tooltip?: string;                 // Hover tooltip
    title?: string;                   // Alternative to tooltip
    disabled?: boolean;               // Disable button
}
```

## Usage Examples

### 1. Form Submission Button
```json
{
  "id": "submit-btn",
  "type": "Button",
  "props": {
    "text": "Submit Form",
    "actionType": "submit",
    "tooltip": "Validate and submit the form"
  }
}
```

### 2. Navigation Button
```json
{
  "id": "next-btn",
  "type": "Button", 
  "props": {
    "text": "Continue",
    "actionType": "navigation",
    "tooltip": "Go to next step"
  }
}
```

### 3. Custom Action Button
```json
{
  "id": "custom-btn",
  "type": "Button",
  "props": {
    "text": "Custom Action",
    "actionType": "custom",
    "style": {
      "background": "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
      "borderRadius": "20px"
    },
    "onClick": "() => alert('Custom logic here!')"
  }
}
```

### 4. Danger Button
```json
{
  "id": "delete-btn",
  "type": "Button",
  "props": {
    "text": "Delete Item",
    "actionType": "danger",
    "tooltip": "This action cannot be undone"
  }
}
```

## Styling System

### Default Styles by Action Type
- **Base Style**: All buttons share consistent padding, border-radius, and hover effects
- **Type-Specific Colors**: Each action type has semantic color defaults
- **Override Capability**: Custom styles in props override defaults
- **Responsive Design**: Buttons scale appropriately across devices

### Style Hierarchy
1. **Base styles** (padding, border-radius, font-size)
2. **Action type styles** (background, color based on actionType)
3. **Custom styles** (from props.style - highest priority)

## Integration with Forms

### Formik Integration
- **Submit buttons** (`actionType: 'submit'`) automatically integrate with Formik forms
- Trigger validation before submission
- Handle loading states during submission
- Navigate after successful submission

### Navigation Integration
- **Navigation buttons** work with the `onNext` callback
- Allow users to skip form submission
- Provide alternative flow paths

## Backward Compatibility

The enhanced Button component maintains full backward compatibility:
- **Default behavior**: Without `actionType`, defaults to 'navigation'
- **Existing props**: All existing button props continue to work
- **Legacy buttons**: SubmitButton, CTAButton, ActionButton remain functional

## Migration Guide

### From Legacy Components
```javascript
// Old way
{
  type: 'SubmitButton',
  props: { text: 'Submit' }
}

// New way (equivalent)
{
  type: 'Button',
  props: { 
    text: 'Submit',
    actionType: 'submit'
  }
}
```

### From CTAButton
```javascript
// Old way
{
  type: 'CTAButton',
  props: { text: 'Continue' }
}

// New way (equivalent)
{
  type: 'Button',
  props: { 
    text: 'Continue',
    actionType: 'navigation'
  }
}
```

## Best Practices

### 1. Semantic Action Types
Choose action types that match the button's purpose:
- Use `submit` for form submissions
- Use `navigation` for flow control
- Use `danger` for destructive actions

### 2. Consistent Styling
- Let action types provide semantic colors
- Use custom styles sparingly for brand consistency
- Consider accessibility when overriding colors

### 3. Clear Labeling
- Use descriptive button text
- Add tooltips for context
- Consider icon integration for better UX

### 4. Form Integration
- Always use `actionType: 'submit'` for form submissions
- Provide alternative navigation paths with secondary buttons
- Handle loading states appropriately

## Advanced Usage

### Custom Click Handlers
```json
{
  "type": "Button",
  "props": {
    "text": "Advanced Action",
    "actionType": "custom",
    "onClick": "() => { /* Complex logic */ }"
  }
}
```

### Conditional Styling
```json
{
  "type": "Button",
  "props": {
    "text": "Dynamic Button",
    "actionType": "secondary",
    "style": {
      "opacity": "/* condition ? 1 : 0.5 */",
      "cursor": "/* condition ? 'pointer' : 'not-allowed' */"
    }
  }
}
```

## Future Enhancements

### Planned Features
- Icon support within buttons
- Loading state indicators
- Disabled state styling
- Size variants (small, medium, large)
- Animation effects

### Extensibility
The action type system is designed to be easily extended with new types as needed for specific use cases.