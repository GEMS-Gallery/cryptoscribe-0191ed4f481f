import { defineConfig } from 'vite';
import environment from 'vite-plugin-environment';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [
    environment('all', { prefix: 'VITE_' }),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.BACKEND_CANISTER_ID': JSON.stringify(process.env.BACKEND_CANISTER_ID),
  },
});