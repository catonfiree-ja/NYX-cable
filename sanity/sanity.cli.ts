import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '30wikoy9',
    dataset: 'production',
  },
  studioHost: 'nyx-cable',
})
