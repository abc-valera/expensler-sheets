# Expensler💸 Sheets

[![#StandWithUkraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://vshymanskyy.github.io/StandWithUkraine)
[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)

## About

Expensler is an apps-script google sheets addon for tracking personal finance.

## Client deployment and usage

### Deployment

1. Create and open a new spreadsheet in Google Sheets.
2. Go to `Extensions` -> `Apps Script` to open the Apps Script editor.
3. Edit the Apps Script project name.
4. Copy the script id from the URL and insert to either `./secrets/prod.env` or `./template.env` file with a `EXPENSLER_SHEETS_SCRIPT_ID` key.
5. Run the `./run.sh run::login` command to login to google.
6. Run the `./run.sh run::deploy:prod` command to deploy the script to google.

### Usage

The accounts can be added via the `Expensler` menu button. Currently only Monobank is supported. To enable the API key is required, it can be obtained in the https://api.monobank.ua/ personal cabinet.

![Usage Demo](.meta/expensler_demo.gif)

## Tech Stack

| Component | Technology |
|---|---|
| Runtime | [Google Apps Script](https://developers.google.com/apps-script) |
| Language | TypeScript |
| UI framework (used for sidebars) | [Solid.js](https://www.solidjs.com/) |
| Bundler (with couple of custom plugins) | [esbuild](https://esbuild.github.io/) with [esbuild-plugin-solid](https://github.com/solidjs/esbuild-plugin-solid) |
| Deployment | [clasp](https://github.com/google/clasp) (Google's CLI for Apps Script) |
| Linting | [ESLint](https://eslint.org/) with [@antfu/eslint-config](https://github.com/antfu/eslint-config) |

## Development

Run the following commands to prepare the project:

```bash
git clone git@github.com:abc-valera/expensler-sheets.git
./run.sh run::prepare-dev
```

Deployment is performed by the `clasp` tool. Before using it the authentication is required via the `./run.sh run::login` command. When used it creates a `./secrets/.clasprc.json` file containing a secret token from google.

After the login the `clasp` tool can deploy the appscript: `./run.sh run::deploy:prod`. This command will build and deploy the code to google using the script id from the `env` file.

The project also contains github actions for the deployment. It builds and deploys the script on tagged (`v*.*.*`) commits using the secrets from the github repository.

### Useful appscript references

To remove all document properties:

```javascript
function deleteAllDocumentProperties() {
	PropertiesService.getDocumentProperties().deleteAllProperties()
	Logger.log('All document properties deleted.')
}
```

The logs can be seen in the Executions page of the Apps Script dashboard: https://script.google.com/home/executions
