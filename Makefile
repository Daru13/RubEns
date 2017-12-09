.PHONY: build doc clean test

# General build
all: build doc test

# Prepare for developing by installing dependencies
# Some are required to be globally installed; others are local
setup:
	@echo "Installing dependencies..."
	@npm install -g typescript
	@npm install -g mocha@3.2.0
	@npm install -g ts-mocha
	@npm install

# Build the application
build:
	@echo "Building the application..."
	@mkdir -p build
	@cp -r -u src/css src/js src/img src/index.html build
	@node_modules/typescript/bin/tsc

# Build the web documentation
doc:
	@echo "Building the documentation..."
	@mkdir -p docs
	@node_modules/typedoc/bin/typedoc --logger "none" --out docs --name "RubEns" src

# Test the application, to find errors
test:
	@echo "Testing the application..."
	@ts-mocha test/**/*.ts

# Clean files built from the sources
clean:
	rm -rf build
	rm -rf docs
