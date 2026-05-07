import type { HTTPResponse, URLFetchRequest } from '../../../shared/fetchutil'
import type { Transaction } from '../../transactions/model/model'
import type { Account } from '../interface/account'

export const raifeissenBankName = 'Raifeissen'

export class RaifeissenAccount implements Account {
	public readonly name: string
	public readonly bankName: string = raifeissenBankName
	public readonly addedAt: Date
	public isValid: boolean

	constructor(input: { name: string, addedAt: Date, isValid: boolean }) {
		if (!input.name) {
			throw new Error('Raifeissen account name is missing')
		}
		this.name = input.name

		if (!input.addedAt) {
			throw new Error('Raifeissen account addedAt is missing')
		}
		this.addedAt = input.addedAt

		if (input.isValid === undefined) {
			throw new Error('Raifeissen account isValid is missing')
		}
		this.isValid = input.isValid
	}

	public newGetTransactionsRequest(_from: Date, _to: Date): URLFetchRequest {
		throw new Error('Method not implemented.')
	}

	public processGetTransactionsResponse(_response: HTTPResponse): Map<string, Transaction[]> {
		throw new Error('Method not implemented.')
	}
}
