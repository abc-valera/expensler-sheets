import type { HTTPResponse, URLFetchRequest } from '../../../shared/fetchutil'
import type { Account } from '../interface/account'
import { dateToSheetName } from '../../../shared/sheets_naming'
import { Transaction } from '../../transactions/model/model'

export const sampleName = 'Sample'

const HARDCODED_PREVIOUS_MONTH: Omit<ConstructorParameters<typeof Transaction>[0], 'accountName'>[] = [
	{ id: 'sample-prev-1', time: new Date(0), amount: -120.00, vendor: 'Silpo', category: 'Groceries', comment: 'Sample Transaction' },
	{ id: 'sample-prev-2', time: new Date(0), amount: -45.50, vendor: 'Shell', category: 'Fuel', comment: 'Sample Transaction' },
	{ id: 'sample-prev-3', time: new Date(0), amount: -850.00, vendor: 'Comfy', category: 'Electronics', comment: 'Sample Transaction' },
	{ id: 'sample-prev-4', time: new Date(0), amount: -32.00, vendor: 'McDonald\'s', category: 'Restaurants', comment: 'Sample Transaction' },
	{ id: 'sample-prev-5', time: new Date(0), amount: -5000.00, vendor: 'Kyiv', category: 'Rent', comment: 'Sample Transaction' },
]

const HARDCODED_CURRENT_MONTH: Omit<ConstructorParameters<typeof Transaction>[0], 'accountName'>[] = [
	{ id: 'sample-curr-1', time: new Date(0), amount: -75.00, vendor: 'ATB', category: 'Groceries', comment: 'Sample Transaction' },
	{ id: 'sample-curr-2', time: new Date(0), amount: -200.00, vendor: 'Intertop', category: 'Clothing', comment: 'Sample Transaction' },
	{ id: 'sample-curr-3', time: new Date(0), amount: -18.50, vendor: 'Ukrposhta', category: 'Postal Services', comment: 'Sample Transaction' },
	{ id: 'sample-curr-4', time: new Date(0), amount: -560.00, vendor: 'Booking.com', category: 'Travel', comment: 'Sample Transaction' },
	{ id: 'sample-curr-5', time: new Date(0), amount: -1200.00, vendor: 'Податкова', category: 'Taxes', comment: 'Sample Transaction' },
]

export class SampleAccount implements Account {
	public readonly name: string
	public readonly bankName: string = sampleName
	public readonly addedAt: Date
	public isValid: boolean

	constructor(input: { name: string, addedAt: Date, isValid: boolean }) {
		if (!input.name) {
			throw new Error('Sample account name is missing')
		}
		this.name = input.name

		if (!input.addedAt) {
			throw new Error('Sample account addedAt is missing')
		}
		this.addedAt = input.addedAt

		if (input.isValid === undefined) {
			throw new Error('Sample account isValid is missing')
		}
		this.isValid = input.isValid
	}

	public newGetTransactionsRequest(_from: Date, _to: Date): URLFetchRequest {
		return { url: 'https://example.com' }
	}

	public processGetTransactionsResponse(_response: HTTPResponse): Map<string, Transaction[]> {
		const now = new Date()

		const currentMonthKey = dateToSheetName(now)
		const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
		const prevMonthKey = dateToSheetName(prevMonthDate)

		const result = new Map<string, Transaction[]>()

		result.set(
			prevMonthKey,
			HARDCODED_PREVIOUS_MONTH.map((t, i) => new Transaction({
				...t,
				accountName: this.name,
				time: new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth(), i + 1, 10, 0, 0),
			})),
		)

		result.set(
			currentMonthKey,
			HARDCODED_CURRENT_MONTH.map((t, i) => new Transaction({
				...t,
				accountName: this.name,
				time: new Date(now.getFullYear(), now.getMonth(), i + 1, 10, 0, 0),
			})),
		)

		return result
	}
}
