#!/usr/bin/env bash

# Load env
set -a 
[[ -f ./secrets/prod.env ]] && source ./secrets/prod.env
set +a
source ./scripts/export-build-version.bash && export-build-version

run::login() {
	npx clasp login
}

run::build:release() {
	node --import tsx/esm scripts/build/esbuild.config.ts
}

run::deploy:prod() {
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
