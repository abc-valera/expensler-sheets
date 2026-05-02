// Use HTML dialogs instead of built-in alerts to avoid the stuck "Working..." spinner in Sheets.
import { messageDialogHtml } from './html'

export function showHtmlDialog({ message, type }: { message: string, type: 'info' | 'error' }) {
	SpreadsheetApp.getUi().showModalDialog(
		HtmlService.createHtmlOutput(messageDialogHtml({ message, type }))
			.setWidth(360)
			.setHeight(140),
		'Expensler💸',
	)
}
