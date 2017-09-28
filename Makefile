.PHONY: build doc clean test

# General build
all: build doc

# Build the application
build:
	@mkdir -p build
	@echo "Building the app..."
	@cp -r -u src/html src/css src/js build
	@tsc

# Build the web documentation
doc:
	@echo "Building the documentation..."

# Test the application, to find errors
test:
	@echo "Testing the application (with mocha)..."
	@ts-mocha test/**/*.ts

# Clean files built from the sources
clean:
	rm -rf build/*
