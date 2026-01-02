import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/infra/http/server.ts'],
    clean: true,
    format: 'esm',
    outDir: 'dist',
    external: ['lightningcss'],
    noExternal: ['csv-stringify'],
    tsconfig: './tsconfig.json',
    esbuildOptions(options) {
        options.alias = {
            '@': './src',
        }
    },
})