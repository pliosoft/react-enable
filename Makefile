SHELL := /bin/sh
PATH := ./node_modules/.bin:$(PATH)

.PHONY: build
build: build-css build-js
	
.PHONY: build-js
build-js:
	npm run build-js

.PHONY: build-css
build-css:
	npm run build-css

.PHONY: watch-js
watch-js:
	npm run watch-js
	

.PHONY: watch-css
watch-css:
	npm run watch-css

.PHONY: watch
watch:
	npm run watch

