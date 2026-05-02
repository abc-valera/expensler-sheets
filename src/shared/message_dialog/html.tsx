import type { JSX } from 'solid-js'
import { renderToString } from 'solid-js/web'

// Disable the setTimeout() js function used by Solid, since GAS has no event loop.
// eslint-disable-next-line import/newline-after-import
;(globalThis as any).setTimeout ??= (fn: () => void) => fn()

function escapeHtml(input: string) {
	return input
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
}

export function messageDialogHtml({ message, type }: { message: string, type: 'info' | 'error' }) {
	const colors = type === 'error'
		? { border: '#d93025', background: '#fce8e6' }
		: { border: '#1a73e8', background: '#e8f0fe' }

	const containerStyle: JSX.CSSProperties = {
		'padding': '16px',
		'border-radius': '6px',
		'border-left': `4px solid ${colors.border}`,
		'background': colors.background,
		'color': '#2d3748',
	}

	const messageStyle: JSX.CSSProperties = {
		'font-size': '15px',
		'font-weight': '600',
		'margin-bottom': '14px',
	}

	const buttonStyle: JSX.CSSProperties = {
		'padding': '6px 16px',
		'background': colors.border,
		'color': '#fff',
		'border': 'none',
		'border-radius': '4px',
		'font-size': '14px',
		'font-weight': '600',
		'cursor': 'pointer',
	}

	return renderToString(() => (
		<div style={containerStyle}>
			<div style={messageStyle}>
				{escapeHtml(message)}
			</div>
			<button
				// @ts-expect-error onclick is a raw string attribute for the rendered HTML
				onclick="google.script.host.close()"
				style={buttonStyle}
			>
				OK
			</button>
		</div>
	))
}
