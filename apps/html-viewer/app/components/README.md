# Flow Viewer Components

This directory contains all the componentized parts of the Flow Viewer application, broken down for better maintainability and reusability.

## Component Structure

### 📁 **Types & Services**
- **`types.ts`** - TypeScript interfaces and type definitions
- **`CanvasDataService.ts`** - Service for fetching canvas data from APIs

### 🎣 **Custom Hooks**
- **`useFlowData.ts`** - Hook for fetching and managing flow data
- **`useDecisionMaker.ts`** - Hook for flow navigation and decision logic

### 🎨 **UI Components**

#### Layout Components
- **`FlowViewerHeader.tsx`** - Header with title and flow information
- **`FlowViewerFooter.tsx`** - Footer with app information and links

#### Content Components
- **`FlowContent.tsx`** - Main content area that handles flow rendering
- **`ViewNodePage.tsx`** - Renders VIEW type nodes with text content
- **`CanvasNodePage.tsx`** - Renders CANVAS type nodes with canvas content
- **`CanvasRenderer.tsx`** - Renders canvas components from JSON data

#### Utility Components
- **`LoadingSpinner.tsx`** - Reusable loading indicator
- **`ErrorDisplay.tsx`** - Error message display component
- **`NoContentMessage.tsx`** - Message for empty/no content states
- **`FlowInformation.tsx`** - Collapsible flow details and debug info

## Component Hierarchy

```
FlowViewer (page.tsx)
├── FlowViewerHeader
├── Content Area
│   ├── LoadingSpinner (when loading)
│   ├── ErrorDisplay (when error)
│   └── FlowContent (when loaded)
│       ├── CanvasNodePage (for CANVAS nodes)
│       │   └── CanvasRenderer
│       ├── ViewNodePage (for VIEW nodes)
│       └── NoContentMessage (when no content)
├── FlowInformation
└── FlowViewerFooter
```

## Key Features

### 🔄 **Flow Navigation**
- `useDecisionMaker` handles all flow logic and navigation
- Supports VIEW, CANVAS, DECISION, START, and END node types
- Automatic progression through connected nodes

### 🎨 **Canvas Rendering**
- `CanvasRenderer` converts CraftJS JSON to HTML
- Supports all canvas components (Button, Label, TextComponent, etc.)
- Recursive rendering for nested containers

### 📡 **Data Management**
- `CanvasDataService` handles API communication
- `useFlowData` manages flow state and loading
- Proper error handling and loading states

### 🎯 **Type Safety**
- Full TypeScript support with comprehensive interfaces
- Proper type checking for all components and hooks

## Usage

Import components from the index file:

```tsx
import { 
  FlowContent, 
  CanvasRenderer, 
  useDecisionMaker 
} from '../../components';
```

## Benefits of Componentization

1. **Maintainability** - Each component has a single responsibility
2. **Reusability** - Components can be reused across different parts of the app
3. **Testing** - Easier to unit test individual components
4. **Debugging** - Easier to isolate and fix issues
5. **Collaboration** - Team members can work on different components independently
6. **Performance** - Better code splitting and lazy loading possibilities