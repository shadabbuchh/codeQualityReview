# Feature-Sliced Design (FSD) Architecture

This document describes the abstract architectural pattern of Feature-Sliced Design - a methodology for organizing frontend applications into hierarchical layers with strict dependency rules.

## 📐 Core Principles

Feature-Sliced Design enforces:

- **Vertical slicing** — Functionality grouped by business domain
- **Unidirectional dependencies** — Higher layers depend on lower ones
- **Public APIs** — Each slice exposes only necessary interfaces
- **Isolation** — Business logic separated from infrastructure

## 🏗️ Layer Architecture

```
src/
├── app/                    # Application shell
│   ├── providers/          # Global application context
│   ├── routing/            # Route configuration
│   └── index.ts            # Public API
│
├── pages/                  # Route endpoints
│   ├── [slice]/            # Page-level slices
│   │   ├── ui/             # Page components
│   │   └── index.ts        # Slice public API
│   └── index.ts            # Layer public API
│
├── widgets/                # Composite UI blocks
│   ├── [slice]/            # Widget slices
│   │   ├── ui/             # Widget components
│   │   └── index.ts        # Slice public API
│   └── index.ts            # Layer public API
│
├── features/               # User interactions
│   ├── [slice]/            # Feature slices
│   │   ├── ui/             # Feature UI
│   │   ├── api/            # External communications
│   │   ├── model/          # State & logic
│   │   └── index.ts        # Slice public API
│   └── index.ts            # Layer public API
│
├── entities/               # Domain models
│   ├── [slice]/            # Entity slices
│   │   ├── model/          # Data structures
│   │   ├── api/            # CRUD operations
│   │   ├── @x/             # Cross-references
│   │   └── index.ts        # Slice public API
│   └── index.ts            # Layer public API
│
└── shared/                 # Infrastructure
    ├── ui/                 # Design system
    ├── api/                # Transport layer
    ├── lib/                # Helpers
    ├── config/             # Settings
    ├── types/              # Common contracts
    └── index.ts            # Layer public API
```

## 🔗 Dependency Rules

### Layer Hierarchy

Each layer has strict import constraints:

| Layer        | Can Import From                     | Purpose                   |
| ------------ | ----------------------------------- | ------------------------- |
| **app**      | All layers below                    | Bootstrap & configuration |
| **pages**    | widgets, features, entities, shared | Route composition         |
| **widgets**  | features, entities, shared          | Complex UI assemblies     |
| **features** | entities, shared                    | Business operations       |
| **entities** | shared, other entities via @x       | Domain logic              |
| **shared**   | None                                | Foundation utilities      |

### Cross-Slice Communication

- **Within layer**: Slices are isolated - no direct imports
- **Between layers**: Only through public APIs (index.ts)
- **Cross-entity**: Special @x notation for entity relationships

## 📦 Slice Anatomy

Each slice follows a consistent internal structure:

```
[slice-name]/
├── ui/         # Presentation layer
├── model/      # Business logic & state
├── api/        # External integrations
├── lib/        # Slice-specific utilities
├── @x/         # Cross-slice contracts (entities only)
└── index.ts    # Public API declaration
```

### Segment Purposes

- **ui**: React components, hooks, styles
- **model**: State management, business rules, events
- **api**: HTTP requests, WebSocket, external services
- **lib**: Helper functions, formatters, validators
- **@x**: Re-exported types for cross-entity references

## 🎯 Implementation Patterns

### Public API Design

```typescript
// Only export what's needed by other layers
export { ComponentName } from './ui/ComponentName';
export type { EntityType } from './model/types';
export { actionName } from './model/actions';
```

### Cross-Entity References

```ts
// entities/order/@x/customer.ts
export type { Customer } from 'entities/customer';

// entities/order/model/types.ts
import type { Customer } from '../@x/customer';
```

### Page Title Management

Use `react-helmet-async` to set page titles in page components. This ensures proper page titles and user experience by dynamically updating the document title based on the current page.

#### Usage

```typescript
// pages/product-catalog/ui/ProductCatalogPage.tsx
import { Helmet } from 'react-helmet-async';

export const ProductCatalogPage = () => {
  return (
    <>
    <Helmet>
        <title>Product Catalog | App Name</title>
    </Helmet>

    {/* Page content */}
    </>
  );
};
```

#### Title Pattern

Follow a consistent pattern: `Page Name | App Name`

- **Home page**: `App Name`
- **Dynamic titles**: `{data.name} | App Name`
