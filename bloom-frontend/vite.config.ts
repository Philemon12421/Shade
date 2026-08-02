import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: /^react-native\/Libraries\/Utilities\/codegenNativeComponent$/,
        replacement: path.resolve(__dirname, './src/mockCodegenNativeComponent.ts'),
      },
      {
        find: /^react-native-web\/Libraries\/Utilities\/codegenNativeComponent$/,
        replacement: path.resolve(__dirname, './src/mockCodegenNativeComponent.ts'),
      },
      {
        find: /^react-native-svg$/,
        replacement: path.resolve(__dirname, './src/mockSvg.ts'),
      },
      {
        find: /^react-native$/,
        replacement: 'react-native-web',
      },
      {
        find: /^@\//,
        replacement: path.resolve(__dirname, './src') + '/',
      },
    ],
  },
});
