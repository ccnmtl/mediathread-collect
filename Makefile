test: node_modules
	npm test

jshint: node_modules/jshint/bin/jshint
	npm run-script jshint

jscs: node_modules/jscs/bin/jscs
	npm run-script jscs

node_modules:
	npm install

node_modules/jshint/bin/jshint:
	npm install jshint --prefix .

node_modules/jscs/bin/jscs:
	npm install jscs --prefix .

clean:
	rm -rf node_modules
