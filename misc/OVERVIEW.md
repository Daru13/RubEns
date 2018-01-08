# Code overview

This file describes the main parts of RubEns' code, and how they relate and depend on each other. We recommended any developer who would like to contribute to the project to start here, in order to better grasp the global logic of the code.

See also the [development guidelines](../CONTRIBUTING.md), for more on project organization and stylistic rules to follow.

## A document-based app
In RubEns language, a **document** is an image with all the metadata used by the app, such as its name, layers and history.

RubEns is not a document itself: it is the software — the *app* — which handles them, and provide means to interact with them. Most of RubEns features thus relate to the **currently open document**, which is known and managed by the app.

`RubEns` class represents the **root of the app**, and is intended to be used as a singleton: there is only one running instance at a time.
`Document` class represents a document, open or not. A document is considered **open** when it is the one referenced and known by the app.

Besides, note that there exist **parameters for the app** itself (`RubEnsParameters`), as well as **parameters for each document** (`DocumentParameters`). The former is designed to configure general behaviors, common to every document; while the latter contains document-specific data (e.g. its name, the last saved drawing parameters, etc).

Furthermore, a document is split in several parts, which handle different tasks. For instance, it contains an **history** of reversible actions (`History` instance), a **workspace** containing the actual image (`ImageWorkspace` instance), etc.

Most of the app and documents represent the **model** in the MVC pattern.

## Image workspace
The image workspace, or just workspace, aggregates every part of a document which has to do with the image itself.

It contains the **layers** forming the actual image, the current **selection** (if any); and it provides properties and method to get information about the image, and to interact with it.


## Event system
Since Javascript provides a powerful asynchronous event system, RubEns extensively uses it to handle interactions between both (1) the user and the app, and (2) different parts of the app.

1. Actions taken by the user, such as moving the cursor, clicking, or pressing a key, are accessed via the event system. All the actions made by the user are thus recorded, and handled in the form of **standardized events**.

2. In order to avoid complex internal dependencies, which would make the code harder to set up, to read and to maintain, different unrelated modules can communicate through this system, by spawning and listening for **custom events**. You can spot the difference with regular event, as their names all start with `rubens_`, followed by a description of the event.

All the event system is managed by another singleton provided by the app: the **event manager** (`EventManager`). It works by registering and unregistering **event handlers** (`EventHandler`), which contain a callback function, and conditions under which it should be executed (such as a particular event type).

The event manager represents the **controller** in the MVC pattern.


## Tools, effects and primitives
Drawing on the image or selecting a part of it is done by using a **tool** (`Tool`); while blurring it or sharpening it is done by using an **effect** (`VisualEffect`). Those two concepts describe and encode actions, which are then made available to the user.

They are respectively implemented by classes which all respectively extend `Tool` and `Effect` classes. They are not static, but singletons, instanciated only once during the app initialization, and given to whatever part of the code needs them.

Besides, since certain drawing primitives (simple, generic actions on the image) can be re-used, they should and have been defined only once. The classes under the `DrawingPrimitives` directory are made for this purpose.


## User interface
Finally, all this would not provide anything to the end user, if there was no graphical interface for them to interact with an image, and actually *draw* things!

This is where the whole **UI** module comes, by providing and assembling various classes which represent different parts of the interface, themselves related to different parts of the model. All the user interface is built **programmatically**, by editing the DOM of the single HTML document of the project, which is just an empty root (`index.html`). For this purpose, it requires an **app to display**.

For instance, a layer manager (`LayerManager`) can be *bound* to a layer list (`LayerList`): it will display updated information about layers of the document to the user, and allow them to use features provided by the layer manager (add or remove a layer, move them around, etc.)

The **binding** operation is entirely done by the UI, given a model. Most of the UI is thus bound to parts of the currently open document; and they are updated whenever the latter changes. Therefore, when the UI modify the model, it does not immediately modify itself as well: instead, it waits for the model to signal the changes through meaningful events, caught by the UI, which only updates at this moment.

The UI is built in a **tree-like fashion**: it starts from the root layout (`RootLayout`), which attaches itself to the DOM, and creates the different main parts of the interface:
* The top main menu (`MainMenu`);
* The visual workspace (`DrawingDisplay`);
* The left tool menu (`ToolMenu`);
* The right sidebar (`Sidebar`);
* The bottom status bar (`StatusBar`).

Recursively, those set up the underlying modules they need, and so on, until the whole interface is created and ready. Note that the UI only add classes and IDs to mark the HTML nodes it handles: the actual styling is purely done with CSS.

The UI represents the **view** in the MVC pattern.
