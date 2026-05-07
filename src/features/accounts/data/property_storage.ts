import type { Account } from '../interface/account'
import { MonobankAccount, monobankName } from '../providers/monobank'
import { PrivatbankAccount, privatbankName } from '../providers/privatbank'
import { RaifeissenAccount, raifeissenBankName } from '../providers/raifeisen'
import { SampleAccount, sampleName } from '../providers/sample'

const PROPERTY_KEY = 'accounts'

function saveAccounts(accounts: Account[]): void {
	const serialized = JSON.stringify(accounts)
	PropertiesService.getDocumentProperties().setProperty(PROPERTY_KEY, serialized)
}

export function loadAccounts(): Account[] {
	const serialized = PropertiesService.getDocumentProperties().getProperty(PROPERTY_KEY)
	if (!serialized) {
		return []
	}

	try {
		const parsed = JSON.parse(serialized)
		return parsed.map((item: any) => {
			switch (item.bankName) {
				case monobankName:
					return new MonobankAccount({ name: item.name, accountId: item.accountId, apiKey: item.apiKey, addedAt: new Date(item.addedAt), isValid: item.isValid })
				case privatbankName:
					return new PrivatbankAccount({ name: item.name, addedAt: new Date(item.addedAt), isValid: item.isValid })
				case raifeissenBankName:
					return new RaifeissenAccount({ name: item.name, addedAt: new Date(item.addedAt), isValid: item.isValid })
				case sampleName:
					return new SampleAccount({ name: item.name, addedAt: new Date(item.addedAt), isValid: item.isValid })
				default:
					throw new Error(`Unknown bank: ${item.bankName}`)
			}
		})
	}
	catch (error) {
		Logger.log(`Error loading accounts: ${error}`)
		return []
	}
}

export function addAccount(account: Account): void {
	const accounts = loadAccounts()

	const existingIndex = accounts.findIndex(a => a.name === account.name)
	if (existingIndex !== -1) {
		accounts[existingIndex] = account
	}
	else {
		accounts.push(account)
	}

	saveAccounts(accounts)
}

export function updateAccount(updatedAccount: Account): void {
	const accounts = loadAccounts()
	const index = accounts.findIndex(a => a.name === updatedAccount.name)
	if (index === -1) {
		throw new Error('Account not found')
	}
	accounts[index] = updatedAccount
	saveAccounts(accounts)
}

export function deleteAccount(accountName: string): void {
	const accounts = loadAccounts()
	const filtered = accounts.filter(a => a.name !== accountName)
	saveAccounts(filtered)
}

export function readAccountsArray(): { name: string, bankName: string, addedAt: string, isValid: boolean }[] {
	return loadAccounts().map(a => ({
		name: a.name,
		bankName: a.bankName,
		addedAt: a.addedAt.toISOString(),
		isValid: a.isValid,
	}))
}
