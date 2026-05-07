import type { BuildOptions } from 'esbuild'
import { execSync } from 'node:child_process'
import fs, { rmSync } from 'node:fs'
import process from 'node:process'
import { build } from 'esbuild'
import { solidPlugin } from 'esbuild-plugin-solid'
import { sidebarPlugin } from './plugins/sidebars'
import { stripExports } from './plugins/strip-exports'

function getBuildVersion(): string {
	const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
	const commit = execSync('git rev-parse --short=4 HEAD').toString().trim()
	const dirty = execSync('git status --porcelain').toString().trim() !== '' ? 'dirty' : 'clean'
	return `${branch}:${commit} (${dirty})`
}

export const tsConfig: BuildOptions = {
	entryPoints: ['src/cmd/main.ts'],
	outfile: 'output/dist/main.js',
	format: 'esm',
	bundle: true,
	target: 'es2016',
	platform: 'node',
	resolveExtensions: ['.ts', '.tsx', '.json'],
	define: {
		EXPENSLER_TAG_VERSION: JSON.stringify(process.env.EXPENSLER_TAG_VERSION ?? getBuildVersion()),
		EXPENSLER_COMMIT_VERSION: JSON.stringify(getBuildVersion()),
	},
	plugins: [
		solidPlugin({ solid: { generate: 'ssr' } }),
		stripExports(),
	],
}

export const solidConfig: BuildOptions = {
	entryPoints: ['src/**/*.html'],
	outdir: 'output/dist',
	outbase: 'src',
	bundle: true,
	target: 'es2016',
	plugins: [
		sidebarPlugin(),
		solidPlugin(),
	],
}

rmSync('output/dist', { recursive: true, force: true })
await build(tsConfig)
await build(solidConfig)

fs.copyFileSync('src/appsscript.json', 'output/dist/appsscript.json')

// Create a .clasp.json with the scriptId from env var
const scriptId = process.env.EXPENSLER_SHEETS_SCRIPT_ID
if (!scriptId) {
	throw new Error('EXPENSLER_SHEETS_SCRIPT_ID env var is required')
}
fs.writeFileSync('output/.clasp.json', JSON.stringify({ scriptId, rootDir: './dist' }, null, '\t'))
