export-build-version() {
	dirtySuffix=$([[ -n "$(git status --porcelain)" ]] && echo "+dirty")
	tagVersion=$(git tag --points-at HEAD | head -n1)
	commitVersion=$(git rev-parse --short=4 HEAD)

	if [[ -n "$tagVersion" ]]; then
		export EXPENSLER_BUILD_VERSION="${tagVersion}${dirtySuffix}"
	else
		export EXPENSLER_BUILD_VERSION="${commitVersion}${dirtySuffix}"
	fi
}
