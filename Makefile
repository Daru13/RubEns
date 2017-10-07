.PHONY: build doc clean test

# General build
all: build doc test

# Build the application
build:
	@echo "Building the application..."
	@mkdir -p build
	@cp -r -u src/css src/js src/index.html build
	@tsc

# Build the web documentation
doc:
	@echo "Building the documentation..."
	@mkdir -p docs
	@typedoc --logger "none" --out docs

# Test the application, to find errors
test:
	@echo "Testing the application..."
	@ts-mocha test/**/*.ts

# Clean files built from the sources
clean:
	rm -rf build
	rm -rf docs
