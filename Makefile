.PHONY: clean test

#Build the application
build:
	@echo "Building the app"

#Build the html documentation
doc:
	@echo "Building the documentation"

#Test the application, to find errors
test:
	@echo "Testing the application with mocha:"
	@ts-mocha test/**/*.ts

#Build the application, and the documentation
all: build doc

clean:
	rm -rf build/*