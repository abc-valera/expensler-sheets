import type { Transaction } from '../../transactions/model/model'
import { loadAccounts, updateAccount } from '../data/property_storage'

export function getTransactionsFromAllAccounts(from: Date, to: Date): Map<string, Transaction[]> {
	const accounts = loadAccounts()

	const directAccounts = accounts.filter(a => a.getTransactionsDirect !== undefined)
	const httpAccounts = accounts.filter(a => a.getTransactionsDirect === undefined)

	const allTransactions = new Map<string, Transaction[]>()

	function mergeIn(source: Map<string, Transaction[]>) {
		source.forEach((transactions, key) => {
			if (!allTransactions.has(key)) {
				allTransactions.set(key, [])
			}
			allTransactions.set(key, allTransactions.get(key)!.concat(transactions))
		})
	}

	for (const account of directAccounts) {
		mergeIn(account.getTransactionsDirect!(from, to))
	}

	if (httpAccounts.length > 0) {
		const requests = httpAccounts.map(account => account.newGetTransactionsRequest(from, to))
		const responses = UrlFetchApp.fetchAll(requests)
		responses.forEach((response, index) => {
			const account = httpAccounts[index]
			try {
				mergeIn(account.processGetTransactionsResponse(response))
			}
			catch (error) {
				const message = error instanceof Error ? error.message : String(error)
				if (message.includes('"errorDescription":"Unknown \'X-Token\'"') || message.includes('"errorDescription":"invalid account"')) {
					account.isValid = false
					updateAccount(account)
				}
				throw error
			}
		})
	}

	// Sort transactions by time for each month (newest first)
	allTransactions.forEach((transactions) => {
		transactions.sort((a, b) => b.time.getTime() - a.time.getTime())
	})

	return allTransactions
}
