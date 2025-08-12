// @ts-ignore
import fg from 'fast-glob';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { hsFieldkitPlugin } from 'hs-fieldkit/vitePlugin';
import uploadToHubSpot from 'vite-plugin-upload-to-hubspot';

interface WatchOptions {
  glob?: string;
  ignore?: string[];
  absolute?: boolean;
}

export function watchGlob(watchOptions: WatchOptions): Plugin {
  return {
    name: 'watchGlob',
    buildStart() {
      const { glob, absolute } = watchOptions;
      if (!glob) return;

      const filesToWatch = fg.sync(glob, { absolute, ignore: watchOptions.ignore || [] });
      filesToWatch.forEach((file: any) => this.addWatchFile(file));
      console.log(
        `\n[watchGlob*] Watching "${glob}" - ${filesToWatch.length} total files - for changes.\n`
      );
    },
  };
}

export default defineConfig(({ command, mode }) => {
  const isBuild = command === 'build';

  const plugins = isBuild
    ? [
        watchGlob({
          glob: 'src/**/*.{html,ts}',
          ignore: ['src/modules/**/fields.json'],
          absolute: true,
        }),
        svelte(),
        tailwindcss(),
        viteStaticCopy({
          targets: [
            { src: 'src/modules/*', dest: 'modules' },
            { src: 'src/templates/*', dest: 'templates' },
            { src: 'src/fields.json', dest: '' },
            { src: 'src/theme.json', dest: '' },
          ],
        }),
        hsFieldkitPlugin(['src/modules/**/fields.ts']),
        uploadToHubSpot({
          src: 'dist',
          dest: 'TosohTheme2025',
          account: mode || 'develop',
        }),
      ]
    : [tailwindcss(), svelte()];

  return {
    mode: 'production',
    publicDir: false,
    build: {
      minify: false,
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'lib/main.ts'),
        },
        output: {
          format: 'es',
          assetFileNames: ({ name }) =>
            name?.includes('.css') ? 'build/css/[name][extname]' : 'build/js/[name][extname]',
          entryFileNames: ({ name }) =>
            name?.includes('module') ? '[name].js' : 'build/js/[name].js',
          chunkFileNames: 'build/js/[name].js',
        },
      },
      target: 'baseline-widely-available',
    },
    plugins,
    resolve: {
      extensions: ['.js', '.ts'],
    },
  };
});
