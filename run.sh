#!/usr/bin/env bash

[[ -f ./secrets/.env ]] && set -a && source ./secrets/.env && set +a

run::login() {
	npx clasp login
}

run::build() {
	node --import tsx/esm build/esbuild.config.ts
}

run::deploy() {
	run::build && npx clasp push
}

run::lint() {
	npx eslint
}

run::lint:fix() {
	npx eslint --fix
}

# "$@" represents all the arguments passed to the script
"$@"
