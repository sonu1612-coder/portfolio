import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schemas'

// Extract project ID and dataset from environment variables.
// In development, import.meta.env is used by Vite.
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'your_project_id'
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'

export default defineConfig({
  basePath: '/admin', // The route where the studio will be mounted
  name: 'Portfolio_CMS',
  title: 'Portfolio Admin',
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
})
