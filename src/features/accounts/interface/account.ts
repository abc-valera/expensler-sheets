import type { HTTPResponse, URLFetchRequest } from '../../../shared/fetchutil'
import type { Transaction } from '../../transactions/model/model'

export interface Account {
	name: string
	bankName: string
	addedAt: Date

	newGetTransactionsRequest: (from: Date, to: Date) => URLFetchRequest
	processGetTransactionsResponse: (response: HTTPResponse) => Map<string, Transaction[]>

	// If defined, transactions are returned directly without making an HTTP request.
	getTransactionsDirect?: (from: Date, to: Date) => Map<string, Transaction[]>

	// TODO: track the state of the account somehow
	// e.g. if the account is not available anymore (if the api key was revoked for example)
	// then the user should know about it
	// This should be done on creation and on further requests too.
	// isValid: boolean
}
