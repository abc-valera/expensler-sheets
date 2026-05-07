#!/usr/bin/env bash

[[ -f ./secrets/prod.env ]] && set -a && source ./secrets/prod.env && set +a

run::login() {
	npx clasp login
}

run::build:release() {
	node --import tsx/esm build/esbuild.config.ts
}

run::deploy:prod() {
	EXPENSLER_VERSION=$(git tag --points-at HEAD | head -n1)
	EXPENSLER_COMMIT_VERSION=$(git rev-parse --short=4 HEAD)
	EXPENSLER_VERSION="${EXPENSLER_VERSION:-$EXPENSLER_COMMIT_VERSION}"
	export EXPENSLER_VERSION
	run::build:release && npx clasp push
}

run::lint() {
	npx eslint
}

run::lint:fix() {
	npx eslint --fix
}

run::prepare-dev() {
	cp .githooks/* .git/hooks/
	npm i
	./run.sh run::login
}

# "$@" represents all the arguments passed to the script
"$@"
