import type { Account } from '../interface/account'
import { createSignal, For, Show } from 'solid-js'
import { monobankName } from './monobank'

// Step represents the stages of the form.
type Step = 'api-key' | 'select-account'

export function MonobankAccountAddForm(props: {
	onSubmit: (account: Account) => void
	onCancel: () => void
	isProcessing: boolean
	existingAccounts: { name: string, bankName: string }[]
}) {
	const [step, setStep] = createSignal<Step>('api-key')
	const [apiKey, setApiKey] = createSignal('')
	const [isFetching, setIsFetching] = createSignal(false)
	const [fetchError, setFetchError] = createSignal<string | null>(null)
	const [availableAccounts, setAvailableAccounts] = createSignal<{ accountId: string, name: string }[]>([])
	const [selectedName, setSelectedName] = createSignal<string | null>(null)

	const existingMonobankNames = () =>
		new Set(
			props.existingAccounts
				.filter(a => a.bankName === monobankName)
				.map(a => a.name),
		)

	const handleFetchAccounts = async () => {
		const key = apiKey().trim()
		if (!key)
			return

		setIsFetching(true)
		setFetchError(null)

		try {
			const response = await fetch('https://api.monobank.ua/personal/client-info', {
				method: 'GET',
				headers: { 'X-Token': key },
			})

			if (!response.ok) {
				const text = await response.text()
				throw new Error(`Monobank API error ${response.status}: ${text}`)
			}

			const data: MonobankClientInfo = await response.json()
			const taken = existingMonobankNames()

			const accounts = data.accounts
				.map(a => ({ accountId: a.id, name: buildAccountName(a) }))
				.filter(a => !taken.has(a.name))

			setAvailableAccounts(accounts)
			setStep('select-account')
		}
		catch (err: any) {
			setFetchError(err?.message ?? 'Unknown error')
		}
		finally {
			setIsFetching(false)
		}
	}

	const handleConfirm = () => {
		const name = selectedName()
		if (!name)
			return

		const selected = availableAccounts().find(a => a.name === name)
		if (!selected)
			return

		// Note: MonobankAccount's constructor is not imported here to avoid bundling the MCC map into the sidebar.
		props.onSubmit({
			name,
			bankName: monobankName,
			addedAt: new Date().toISOString(),
			accountId: selected.accountId,
			apiKey: apiKey().trim(),
			isValid: true,
		} as unknown as Account)
	}

	return (
		<Show
			when={step() === 'select-account'}
			fallback={(
				<div>
					<div class="form-group">
						<label for="apiKey">API Key:</label>
						<input
							type="text"
							id="apiKey"
							name="apiKey"
							required
							disabled={isFetching() || props.isProcessing}
							value={apiKey()}
							onInput={e => setApiKey(e.currentTarget.value)}
						/>
					</div>

					<Show when={fetchError()}>
						<div class="form-error">{fetchError()}</div>
					</Show>

					<div class="form-buttons">
						<button
							type="button"
							class="submit-btn"
							disabled={isFetching() || props.isProcessing || !apiKey().trim()}
							onClick={handleFetchAccounts}
						>
							{isFetching() ? 'Loading...' : 'Next'}
						</button>
						<button
							type="button"
							onClick={props.onCancel}
							disabled={isFetching() || props.isProcessing}
						>
							Cancel
						</button>
					</div>
				</div>
			)}
		>
			<div>
				<Show
					when={availableAccounts().length > 0}
					fallback={<div class="empty-state">No new accounts available.</div>}
				>
					<div class={`account-picker${availableAccounts().length > 5 ? ' account-picker--scroll' : ''}`}>
						<For each={availableAccounts()}>
							{item => (
								<button
									type="button"
									class={`picker-item${selectedName() === item.name ? ' selected' : ''}`}
									onClick={() => setSelectedName(item.name)}
									disabled={props.isProcessing}
								>
									{item.name}
								</button>
							)}
						</For>
					</div>
				</Show>

				<div class="form-buttons">
					<button
						type="button"
						class="submit-btn"
						disabled={!selectedName() || props.isProcessing}
						onClick={handleConfirm}
					>
						{props.isProcessing ? 'Saving...' : 'Add'}
					</button>
					<button
						type="button"
						onClick={() => {
							setStep('api-key')
							setSelectedName(null)
						}}
						disabled={props.isProcessing}
					>
						Back
					</button>
				</div>
			</div>
		</Show>
	)
}

function buildAccountName(account: MonobankApiAccount): string {
	const pan = account.maskedPan?.[0]
	const suffix = pan ? pan.slice(-4) : account.iban.slice(-4)
	return `${account.type} ${suffix}`
}

interface MonobankClientInfo {
	accounts: MonobankApiAccount[]
}

interface MonobankApiAccount {
	id: string
	type: string
	currencyCode: number
	maskedPan: string[]
	iban: string
}
