import { showHtmlDialog } from '../../../shared/message_dialog'
import { updateStatsSheet } from '../../stats/data/sheet_update'
import { updateWithNewTransactions } from '../../transactions/data/sheet_update'
import { getTransactionsFromAllAccounts } from './get_transactions'

export function syncTransactionsForLast30days() {
	const now = new Date()
	const fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

	const allTransactions = getTransactionsFromAllAccounts(fromDate, now)

	try {
		let totalNew = 0
		allTransactions.forEach((transactions, monthKey) => {
			const newCount = updateWithNewTransactions(monthKey, transactions)
			totalNew += newCount
			if (newCount > 0) {
				updateStatsSheet(monthKey)
			}
		})
		showHtmlDialog({
			message: `Синхронізовано ${totalNew} нових транзакцій`,
			type: 'info',
		})
	}
	catch (e) {
		Logger.log(`Error: ${e}`)
		showHtmlDialog({
			message: `Помилка: ${e}`,
			type: 'error',
		})
	}
}
