test: node_modules
	npm test

eslint: node_modules/eslint/bin/eslint
	npm run-script eslint

node_modules:
	npm install

node_modules/eslint/bin/eslint:
	npm install eslint --prefix .

clean:
	rm -rf node_modules
