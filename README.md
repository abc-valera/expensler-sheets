# Expensler💸 Apps Script

[![#StandWithUkraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://vshymanskyy.github.io/StandWithUkraine)
[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)

## About

Expensler is an apps-script google sheets addon for tracking personal finance.

## Development

Clone the repo and install dependencies, authenticate with Google, build and deploy the script:

```bash
npm i
npm run authenticate
npm run deploy
```

### Notes

To remove all document properties:

```javascript
function deleteAllDocumentProperties() {
	PropertiesService.getDocumentProperties().deleteAllProperties()
	Logger.log('All document properties deleted.')
}
```

The logs can be seen in the Executions page of the Apps Script dashboard: https://script.google.com/home/executions

### Deployment explanation

TBD
