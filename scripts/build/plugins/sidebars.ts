import type { Plugin } from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import { build } from 'esbuild'
import { solidPlugin } from 'esbuild-plugin-solid'

export function sidebarPlugin(): Plugin {
	return {
		name: 'sidebar-plugin',
		setup(build_context) {
			// Find and iterate over all the HTML files
			build_context.onLoad({ filter: /\.html$/ }, async (args) => {
				const dir = path.dirname(args.path)
				let html = fs.readFileSync(args.path, 'utf8')

				// Replace CSS links with inline styles for the current HTML file
				for (const match of html.matchAll(/<link\s+rel="stylesheet"\s+href="([^"]+\.css)"\s*\/?>/g)) {
					const cssContent = fs.readFileSync(path.resolve(dir, match[1]), 'utf8')
					html = html.replace(match[0], `<style>\n${cssContent}\n\t</style>`)
				}

				// Replace script tags with inline scripts for the current HTML file
				for (const match of html.matchAll(/<script\s+src="([^"]+\.tsx)"><\/script>/g)) {
					const result = await build({
						entryPoints: [path.resolve(dir, match[1])],
						bundle: true,
						write: false,
						format: 'iife',
						target: 'es2016',
						plugins: [solidPlugin()],
					})
					html = html.replace(match[0], `<script>\n${result.outputFiles[0].text}\n</script>`)
				}

				return { contents: html, loader: 'copy' }
			})
		},
	}
}
