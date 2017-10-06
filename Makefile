.PHONY: build doc clean test

# General build
all: build

# Build the application
build:
	@echo "Building the application..."
	@mkdir -p build
	@cp -r -u src/html src/css src/js build
	@cp src/index.html build/index.html	
	@tsc

# Build the web documentation
doc:
	@echo "Building the documentation..."
	@mkdir -p doc
	@typedoc --out doc

# Test the application, to find errors
test:
	@echo "Testing the application..."
	@ts-mocha test/**/*.ts

# Clean files built from the sources
clean:
	rm -rf build/*
