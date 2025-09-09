#!/usr/bin/env tsx

/// <reference types="node" />

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

// Configuration
const REGISTRY_URL = process.env.REGISTRY_URL || 'http://localhost:4000';
const BATCH_SIZE = 15; // Number of components to process in parallel
const BATCH_DELAY = 200; // Delay between batches in milliseconds

interface ComponentFile {
  name: string;
  url: string;
}

/**
 * Attempts to fetch component list from directory listing
 */
async function fetchFromDirectoryListing(): Promise<ComponentFile[]> {
  try {
    const response = await fetch(`${REGISTRY_URL}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch registry: ${response.status} ${response.statusText}`
      );
    }

    const html = await response.text();

    // Extract .json file names from the HTML directory listing
    const jsonFiles: ComponentFile[] = [];
    const jsonFilePattern = /href="([^"]+\.json)"/g;
    let match;

    while ((match = jsonFilePattern.exec(html)) !== null) {
      let filename = match[1];

      // Decode HTML entities
      filename = filename.replace(/&#47;/g, '/').replace(/&amp;/g, '&');

      // Skip any path traversal or unwanted files, and skip instruction files
      if (
        filename.includes('../') ||
        (!filename.endsWith('.json') && !filename.startsWith('/'))
      ) {
        continue;
      }

      // Clean filename - remove leading slash if present
      const cleanFilename = filename.startsWith('/')
        ? filename.substring(1)
        : filename;
      const componentName = cleanFilename.replace('.json', '');

      jsonFiles.push({
        name: componentName,
        url: `${REGISTRY_URL}/${cleanFilename}`,
      });
    }

    if (jsonFiles.length > 0) {
      console.log(
        `✅ Found ${jsonFiles.length} components from directory listing`
      );
    }

    return jsonFiles;
  } catch (error) {
    console.warn('⚠️  Could not fetch from directory listing:', error);
    return [];
  }
}

/**
 * Fetches the list of available component JSON files from the registry
 */
async function fetchComponentsList(): Promise<ComponentFile[]> {
  try {
    console.log(`🔍 Fetching component list from ${REGISTRY_URL}...`);

    // First, try to fetch the registry directory listing
    const directoryComponents = await fetchFromDirectoryListing();
    if (directoryComponents.length > 0) {
      return directoryComponents;
    }
    throw new Error('❗ Failed to fetch components list');
  } catch (error) {
    console.error('❌ Error fetching components list:', error);
    throw error;
  }
}

/**
 * Verifies that a component URL is accessible
 */
async function verifyComponentExists(componentUrl: string): Promise<boolean> {
  try {
    const response = await fetch(componentUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Adds/updates a component using shadcn CLI
 */
async function addComponent(
  componentName: string,
  componentUrl: string
): Promise<void> {
  const startTime = Date.now();

  try {
    console.log(`📦 [${componentName}] Starting component sync...`);

    // Verify component exists before attempting to add it
    const exists = await verifyComponentExists(componentUrl);
    if (!exists) {
      console.warn(
        `⚠️  [${componentName}] Component not accessible at ${componentUrl}, skipping...`
      );
      return;
    }

    const command = `pnpm dlx shadcn@latest add ${componentUrl} --overwrite`;

    console.log(`🔧 [${componentName}] Running: ${command}`);
    const { stdout } = await execAsync(command);

    if (stdout) {
      console.log(`📝 ${componentName}: ${stdout.trim()}`);
    }

    const duration = Date.now() - startTime;
    console.log(
      `✅ [${componentName}] Successfully processed in ${duration}ms`
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [${componentName}] Error after ${duration}ms:`, error);
    throw error; // Re-throw to be caught in the batch handler
  }
}

/**
 * Ensures we're in the correct working directory (app-template/frontend)
 */
function ensureCorrectWorkingDirectory(): void {
  const currentDir = process.cwd();

  // Check if we're already in the app-template/frontend directory
  if (currentDir.endsWith('app-template/frontend')) {
    console.log(`📁 Working directory: ${currentDir}`);
    return;
  }

  // Try to find and change to the app-template/frontend directory
  const targetDir = path.resolve('app-template/frontend');

  if (fs.existsSync(targetDir)) {
    process.chdir(targetDir);
    console.log(`📁 Changed working directory to: ${process.cwd()}`);
    return;
  }

  throw new Error(
    `Could not find app-template/frontend directory. ` +
      `Please run this script from the project root or from app-template/frontend. ` +
      `Current directory: ${currentDir}`
  );
}

/**
 * Main function to sync all components
 */
async function syncComponents(): Promise<void> {
  console.log('🚀 Starting component sync process...\n');

  try {
    // Ensure we're working in the correct directory
    ensureCorrectWorkingDirectory();

    // Fetch list of available components
    const components = await fetchComponentsList();

    if (components.length === 0) {
      console.log('❌ No components found to sync');
      return;
    }

    console.log(
      `\n📋 Components to sync: ${components.map(c => c.name).join(', ')}\n`
    );

    // Process components in parallel batches
    let successCount = 0;
    let skipCount = 0;
    const startTime = Date.now();

    console.log(
      `🚀 Processing ${components.length} components in parallel batches of ${BATCH_SIZE}...\n`
    );

    for (let i = 0; i < components.length; i += BATCH_SIZE) {
      const batch = components.slice(i, i + BATCH_SIZE);
      console.log(
        `📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(components.length / BATCH_SIZE)}: ${batch.map(c => c.name).join(', ')}`
      );

      // Process batch in parallel
      const batchPromises = batch.map(async component => {
        try {
          await addComponent(component.name, component.url);
          return { success: true, component: component.name };
        } catch (error) {
          console.error(`❌ Failed to add ${component.name}:`, error);
          return { success: false, component: component.name, error };
        }
      });

      // Wait for all components in this batch to complete
      const batchResults = await Promise.all(batchPromises);

      // Count results
      batchResults.forEach(result => {
        if (result.success) {
          successCount++;
        } else {
          skipCount++;
        }
      });

      console.log(
        `✅ Batch completed. Success: ${batchResults.filter(r => r.success).length}, Failed: ${batchResults.filter(r => !r.success).length}\n`
      );

      // Small delay between batches to be nice to the server
      if (i + BATCH_SIZE < components.length) {
        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
      }
    }

    const totalTime = Date.now() - startTime;
    const avgTimePerComponent = totalTime / components.length;

    console.log('\n🎉 Component sync completed!');
    console.log(`✅ Successfully processed: ${successCount} components`);
    if (skipCount > 0) {
      console.log(`⚠️  Skipped: ${skipCount} components`);
    }
    console.log(
      `⏱️  Total time: ${Math.round(totalTime / 1000)}s (avg: ${Math.round(avgTimePerComponent)}ms per component)`
    );
    console.log(
      `🚀 Parallel batching processes ${BATCH_SIZE} components simultaneously vs 1 at a time`
    );
  } catch (error) {
    console.error('❌ Fatal error during sync:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  // Support test mode to just fetch and log the components list
  if (process.argv.includes('--test-fetch')) {
    fetchComponentsList()
      .then(components => {
        console.log('\n📋 Available components:');
        components.forEach(component => {
          console.log(`  • ${component.name} -> ${component.url}`);
        });
        console.log(`\n✅ Total: ${components.length} components`);
      })
      .catch(error => {
        console.error('❌ Test failed:', error);
        process.exit(1);
      });
  } else {
    syncComponents().catch(error => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
  }
}

export { syncComponents, fetchComponentsList, addComponent };
