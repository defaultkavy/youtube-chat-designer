import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: './docs',
        target: 'es2022'
    },
})