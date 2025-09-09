# Frontend Scripts

This directory contains utility scripts for the app-template frontend.

## sync-components.ts

A TypeScript script that automatically syncs UI components from the Appsmith UI Components Registry to the frontend project.

### What it does

1. **Downloads Registry Contents**: Fetches the list of all available component JSON files from `http://localhost:4000`
2. **Syncs Components**: For each component JSON file from the registry, runs `pnpm dlx shadcn@latest add <component-url> --overwrite` to add/update the component

### Usage

```bash
# Make sure you're in the app-template/frontend directory
cd app-template/frontend

# Install dependencies (if not already done)
pnpm install

# Test fetch - see what components are available without adding them
pnpm run sync-components:test

# Run a limited sync (first 10 components only) for testing
pnpm run sync-components:limited

# Run the full sync script to add/update all components
pnpm run sync-components
```

### Prerequisites

1. **Registry Server Running**: The UI components registry must be running at `http://localhost:4000`

   ```bash
   cd ui-components-registry
   pnpm install
   pnpm registry:serve  # Serves the registry at localhost:4000
   ```

2. **Dependencies**: The script requires `tsx` for running TypeScript files directly (already included in package.json)

### How it works

1. **Fetches Component List**: The script attempts to get the list of available components from the registry server by parsing the HTML directory listing

2. **Parallel Processing**: Components are processed in parallel batches of 15 for optimal performance while being respectful to the server

3. **Verifies Components**: Before attempting to add each component, it verifies the component URL is accessible

4. **Adds Components**: Uses the shadcn CLI to add each component with the `--overwrite` flag to update existing components

5. **Progress Tracking**: Provides detailed logging with timing information for each component and batch

6. **Error Handling**: Continues processing other components if one fails, with comprehensive error reporting

### Configuration

You can modify the following constants in the script:

- `REGISTRY_URL`: The base URL of the registry server (default: `http://localhost:4000`)
- `BATCH_SIZE`: Number of components to process in parallel (default: `5`)
- `BATCH_DELAY`: Delay between batches in milliseconds (default: `200`)

### Output

The script provides detailed console output showing:

- 📦 Batch processing progress with component names
- ✅ Successfully processed components with timing
- ⚠️ Skipped components (if not accessible)
- ❌ Failed components with error details
- ⏱️ Performance metrics and timing information
- 📊 Final summary with success/skip counts and total time

### Troubleshooting

**Registry not accessible**: Make sure the registry server is running at `http://localhost:4000`

**Component not found**: Some components might not be available in the registry - the script will skip these with a warning

**Permission errors**: Make sure you have write permissions to the components directory

**Network issues**: The script includes small delays between requests and proper error handling for network issues
