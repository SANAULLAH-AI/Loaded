
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a8d5f6bcfa9f4fce8eede8ba68a4e1f6',
  appName: 'e-commerce-app-swiftshop',
  webDir: 'dist',
  server: {
    url: 'https://a8d5f6bc-fa9f-4fce-8eed-e8ba68a4e1f6.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP"
    }
  }
};

export default config;
