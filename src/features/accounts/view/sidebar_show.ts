export function AccountsSidebar() {
	const htmlContent = HtmlService.createHtmlOutputFromFile('features/accounts/view/sidebar')
		.setTitle('Connected Accounts')
		.setWidth(300)

	SpreadsheetApp.getUi().showSidebar(htmlContent)
}
