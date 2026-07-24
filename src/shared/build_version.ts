// The EXPENSLER_BUILD_VERSION constant is defined in src/globals.d.ts
// and is injected at build time by esbuild.

export function getBuildVersion(): string {
	return EXPENSLER_BUILD_VERSION
}
