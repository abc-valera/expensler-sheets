// The EXPENSLER_TAG_VERSION and EXPENSLER_COMMIT_VERSION constants are defined in src/globals.d.ts
// and are injected at build time by esbuild.

export function getBuildVersion(): string {
	return typeof EXPENSLER_TAG_VERSION !== 'undefined' ? EXPENSLER_TAG_VERSION : EXPENSLER_COMMIT_VERSION
}
