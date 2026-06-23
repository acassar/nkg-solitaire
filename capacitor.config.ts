import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'fr.adrien-cassar.nkg-solitaire',
  appName: 'NKG Solitaire',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
}

export default config
