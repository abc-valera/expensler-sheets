import type { BuildOptions } from 'esbuild'
import fs, { rmSync } from 'node:fs'
import process from 'node:process'
import { build } from 'esbuild'
import { solidPlugin } from 'esbuild-plugin-solid'
import { sidebarPlugin } from './plugins/sidebars'
import { stripExports } from './plugins/strip-exports'

const buildVersion = process.env.EXPENSLER_BUILD_VERSION
if (!buildVersion) {
	throw new Error('EXPENSLER_BUILD_VERSION env var is required')
}

export const tsConfig: BuildOptions = {
	entryPoints: ['src/cmd/main.ts'],
	outfile: 'build/dist/main.js',
	format: 'esm',
	bundle: true,
	target: 'es2016',
	platform: 'node',
	resolveExtensions: ['.ts', '.tsx', '.json'],
	define: {
		EXPENSLER_BUILD_VERSION: JSON.stringify(buildVersion),
	},
	plugins: [
		solidPlugin({ solid: { generate: 'ssr' } }),
		stripExports(),
	],
}

export const solidConfig: BuildOptions = {
	entryPoints: ['src/**/*.html'],
	outdir: 'build/dist',
	outbase: 'src',
	bundle: true,
	target: 'es2016',
	plugins: [
		sidebarPlugin(),
		solidPlugin(),
	],
}

rmSync('build/dist', { recursive: true, force: true })
await build(tsConfig)
await build(solidConfig)

fs.copyFileSync('src/appsscript.json', 'build/dist/appsscript.json')

// Create a .clasp.json with the scriptId from env var
const scriptId = process.env.EXPENSLER_SHEETS_SCRIPT_ID
if (!scriptId) {
	throw new Error('EXPENSLER_SHEETS_SCRIPT_ID env var is required')
}
fs.writeFileSync('build/.clasp.json', JSON.stringify({ scriptId, rootDir: './dist' }, null, '\t'))
