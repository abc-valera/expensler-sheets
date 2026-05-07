import type { HTTPResponse, URLFetchRequest } from '../../../shared/fetchutil'
import type { Transaction } from '../../transactions/model/model'
import type { Account } from '../interface/account'

export const privatbankName = 'Privatbank'

export class PrivatbankAccount implements Account {
	public readonly name: string
	public readonly bankName: string = privatbankName
	public readonly addedAt: Date

	constructor(input: { name: string, addedAt: Date }) {
		if (!input.name) {
			throw new Error('Privatbank account name is missing')
		}
		this.name = input.name

		if (!input.addedAt) {
			throw new Error('Privatbank account addedAt is missing')
		}
		this.addedAt = input.addedAt
	}

	public newGetTransactionsRequest(_from: Date, _to: Date): URLFetchRequest {
		throw new Error('Method not implemented.')
	}

	public processGetTransactionsResponse(_response: HTTPResponse): Map<string, Transaction[]> {
		throw new Error('Method not implemented.')
	}
}
