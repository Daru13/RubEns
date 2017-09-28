.PHONY: build doc clean test

# General build
all: build doc

# Build the application
build:
	@echo "Building the app..."
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
