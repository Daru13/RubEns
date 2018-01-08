# Development guidelines

This file describes various guidelines to follow in order to contribute to RubEns. They aim to keep the project tidy, and help making the code clear and easy to understand for everyone.

See also the [code overview](misc/OVERVIEW.md), for a better understanding of the different parts of the code.


## Project structure
RubEns sources follows a precise and common hierarchy.
This sections provides general rules to follow when working on the project structure; then, it explicits the role of the main files and directories.

* All the content of a directory must match the meaning of its path.
* Use simple and short names, but avoid abbreviations.
* Use file extensions whenever possible.
* Split large files into smaller ones whenever possible.
* Group files of large directories into meaningful subdirectories.


### Root directory
The entry point of the project.
Avoid adding anything here at all cost; existing directories are likely to cover most of your needs.

#### Directories
| Path           | Role                   | Notes                                                    |
|----------------|------------------------|----------------------------------------------------------|
| `build`        | Build output.          | Created by `make build`. Excluded from commits.          |
| `docs`         | Documentation.         | Created by `make doc`. Excluded from commits.            |
| `misc`         | Miscellaneous content. |                                                          |
| `node_modules` | Local dependencies.    | Created by `npm` on `make setup`. Excluded from commits. |
| `src`          | Build sources.         | See related subsection.                                  |
| `test`         | Test sources.          | See related subsection.                                  |


#### Files
| Path            | Role                                       | Notes                                             |
|-----------------|--------------------------------------------|---------------------------------------------------|
| `LICENCE`       | Licence of the project.                    | Used by GitHub.                                   |
| `Makefile`      | Makefile of the project.                   | See `README.md` for available commands.           |
| `package.json`  | `npm` package description.                 | Used by `npm` to install and update dependencies. |
| `README.md`     | General information and help.              | Used by GitHub.                                   |
| `tsconfig.json` | Typescript compiler (`tsc`) configuration. | Used by `make build`.                             |



### Build sources (`src`)
The sources used by the building process.
When building the project, all directories but `ts` are simply copied to `build`; the former is handled by the Typescript compiler, which outputs plain Javascript in `build/js`.

#### Directories
| Path  | Role             | Notes                              |
|-------|------------------|------------------------------------|
| `css` | CSS code.        |                                    |
| `img` | Images.          |                                    |
| `js`  | Javascript code. | Only meant for external libraries. |
| `ts`  | Typescript code. |                                    ||


#### File
| Path         | Role                | Notes |
|--------------|---------------------|-------|
| `index.html` | The main HTML file. |       ||



### Test sources (`test`)
The sources used by the testing framework.

TODO: update and clean up the test directory organization.

#### Directories
| Path | Role | Notes |
| ---- | ---- | ----- |

#### File
| Path         | Role                          | Notes |
|--------------|-------------------------------|-------|
| `mocha.opts` | Test framework configuration. |       ||



## Code structure
RubEns is coded in an object-oriented style, powered by Typescript and modern web development features. It relies on several common design pattern, the most important one to bear in mind beeing MVC.

This section clarifies how you should organize and design your code, and how should different modules and classes relate.


### Modularity
The code of RubEns must be designed to be modular!

As explained in the previous section, related files should be grouped in a dedicated directory, which we call *module* (not as in `npm`, but as a logical code unit with one purpose). Besides, using Typescript **imports** and **exports** , large files can be split into several smaller code units, and then to recomposed when needed. Not only this makes the files shorter and easier to read, but it also encourages re-use of already coded concepts.

* In most cases, one file should only expose one object (class, interface, type), in a Java-like fashion.
* Exposing several related objets in a single file can be done, but should be motivated by clarity and ease of use (e.g. a helper object meant to be used along with the main exposed class).
* Keep the code as generic as possible, to encourage re-use.

In order to interact with different parts of the code, RubEns mainly relies on **events**. Avoid actual links between completely different parts of the app; instead, use custom events to allow two distinct modules to communicate in an asynchronous fashion. Read more on the event manager for details.


### Object-oriented design
Even though the Typescript code is compiled to Javascript, which does not natively implements concepts such as *interfaces*, the code must be designed to use all the useful concepts brought by the use of Typescript, when they can help you.

It is expected to follow somehow traditional object-oriented patterns, in a Java-like fashion: small losses in performance and simplicity are acceptable, in regards to the advantages of abstractions.

* Prefer interfaces and enumerations over meaningless, generic types (e.g. `object`, `any`).
* By default, keep fields and methods *private*.
* Always aim to respect the [MVC pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller).

Even though there are no exact design rules, we encourage you to follow general object-oriented programming guidelines, such as the [SOLID principles](https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)). Simply keep the code clean, understandable and easy to maintain and extend!


## Style conventions
This section highlights several code styling rules, which concern the code of the whole project. It makes it more consistent, and simplify reading and editing it, across different contributors, as well as over time.

### General conventions
* The code is indented with **4 spaces**.
* End all instructions with a semi-colon.
* Only use `let` and `const` keywords to declare variables (no `var`).
* Variable names must be written in `camelCase`.
* Constant names must be written in `CAPITALS`.
* Strings must be defined using (double) quotation marks.
* There must be **one space** on the outer side of brackets, and **no space** on the inner side (except for imports, as explained below).
* There must be **one space** after the following keywords: `if`, `else`, `while`, `for`, `switch`, `try`, `catch`, `finally`.
* There must be **no space** before a colon, except when aligning several of them; and at least **one space** after.
* Never omit brackets, even if there is only one instruction.
* Brackets should be opened at the end of a non-empty line, and be closed on an empty line.
* There should be space around math operators, except when it makes the code harder to read.
* By default, use **strict comparators** (e.g. `===` instead of `==`).
* When testing for `null` or `undefined`, prefer testing the variable value directly, without any comparison.

#### Example
```typescript
// Constants
const PI     = 3.14;
const FRUITS = ["apple", "banana", "cherry"];

// Regular variables
let randomValue         = (Math.random() * 3) + 1;
let typedString: string = "Hello world!";

// Standard structures
if (randomValue < PI) {
  throw new SomeException();
}
else if (typedString.endsWith("!")) {
  for (let fruit of FRUITS) {
    console.log(fruit);
  }
}
```

### Imports and exports
* Use the Typescript `export` and `import` keywords for modules.
* Start any file with all its imports, with **no blank line before** and at least **two blank lines after**.
* Put spaces **before and after each bracket** in an import.
* Import aliases (using `as`) must be written in `PascalCase`.

#### Example
```typescript
// External module
import * as $ from "jquery";

// Internal modules
import { SomeClass } from "subdirectory/SomeClass";
import { MyClass, RelatedInterface } from "GreatModule";
```


### Classes and interfaces
* Class and interface names must be written in `PascalCase`.
* Property and method names must be written in `camelCase`.
* There must be **one blank line** between properties, **two blank lines** between methods.
* If a class relies on some interfaces or types defined in the same file, they must be defined **before** the class, with at least two spaces in between each.
* Non-static class properties should be initialized in the constructor, not when they are declared.
* The interrogation mark for an optional interface property must appear after the property name, and before the colon, with **no space around**.
* A class definition must follow the following order:
  1. Properties.
  2. Constructor(s).
  3. Other methods.

#### Example
```typescript
/**
 * This class represents a soldier, which is a special type of character.
 * It thus extends the Character class, and offers additional methods for shooting.
 */
class Soldier extends Character {
  /**
   * The soldier name.
   */
  name: string;

  /**
   * The soldier money.
   */
  ammunitions: number;

  /**
   * Instanciates and initializes a new Soldier object.
   * @param  {string}  name The name of the soldier.
   * @return {Soldier}      Fresh instance of Soldier.
   *
   * @author Camille Gobert
   */
  constructor (name: string) {
    this.name        = name;
    this.ammunitions = 0;
  }


  /**
   * Shoot another character, which consumes one ammunition.
   * Nothing happens if there is no ammunitions.
   * @param  {Character} target The character to hit.
   * @return {boolean}          `true` if it worked, `false` otherwise.
   *
   * @author Camille Gobert
   */
  shoot (target: Character) {
    if (this.ammunitions === 0) {
      return false;
    }

    let damage = Math.random() * 100;
    target.hit(damage);
    this.ammunitions--;

    return true;
  }
}
```


### Enumerations and types
* Enumeration and type names must be written in `PascalCase`.
* There should be **no blank line between enumerated types**, except if types are assigned long values (e.g. object literals with several fields).

#### Example
```typescript
// Eumeration
enum Directions {
  North = "N",
  South = "S",
  East  = "E",
  West  = "W"
}

// Custom type
type HashFunction = (data: Hashable) => string;
```


### Documentation
In addition to regular comments inside the code, several parts of the code are expected to be documented, including private ones (using [`typedoc`](http://typedoc.org/guides/doccomments/) syntax). Every documentation block must appear right before the declaration of the what it comments, with **no space in between**.

#### Documentation targets
* Classes.
* Interfaces.
* Properties (classes and interfaces).
* Methods and constructors.
* Enumerations and their values.
* Types.

In addition, the documentation of **methods and constructors** is expected to contain some specific **tags**: `@param` (to describe their parameters, if any); `@return` (to describe their return value, if any); and `@author`, with **one blank line** before (to list the contributors).

#### Example
```typescript
/**
 * This is what a Typedoc comment looks like.
 * For instance, it can document a dummy class!
 */
class Foo {

  /**
   * This is what a method comment looks like.
   * It checks whether the given string matches the given regex.
   * @param  {string} parameter1 The string to test.
   * @param  {RegExp} parameter2 The regex to match.
   * @return {boolean}           `true` if there is at least one match, `false` otherwise.
   *
   * @author Camille Gobert
   */
  static bar (parameter1: string, parameter2: RegExp) {
    let matches = parameter1.match(parameter2);
    if (matches) {
      return true;
    }
    else {
      return false;
    }
  }
}
```
