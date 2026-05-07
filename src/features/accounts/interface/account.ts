import type { HTTPResponse, URLFetchRequest } from '../../../shared/fetchutil'
import type { Transaction } from '../../transactions/model/model'

export interface Account {
	name: string
	bankName: string
	addedAt: Date

	// isValid tracks if the account is valid and can be used to fetch transactions.
	// Account can become invalid if, for example, the API key is revoked or if the account is deleted.
	isValid: boolean

	newGetTransactionsRequest: (from: Date, to: Date) => URLFetchRequest
	processGetTransactionsResponse: (response: HTTPResponse) => Map<string, Transaction[]>
}
