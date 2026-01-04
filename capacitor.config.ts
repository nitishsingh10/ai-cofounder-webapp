import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.foundingai.app',
    appName: 'Founding AI',
    webDir: 'dist',
    server: {
        // For development: use your computer's IP address
        // url: 'http://YOUR_IP:5173',
        // cleartext: true,
        androidScheme: 'https'
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            backgroundColor: '#0a0a0f',
            showSpinner: false
        }
    }
};

export default config;
