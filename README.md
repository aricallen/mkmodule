# mkmodule

Setup scaffolding for a npm or yarn module with some base rules/settings I've found useful.
Also places the module name in important areas (scope currently not supported).

Files include:

* .vscode/launch.json
* .eslintrc.json
* .gitignore
* LICENSE
* package.json
* README.md

## Usage

```sh
yarn global add @solstice.sebastian/mkmodule
cd <path/to/parent/dir>
mkdir <module-name>
```