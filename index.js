#!/usr/bin/env node

/**
 * usage:
 * node make-module moduleName echo pwd
 */

const fs = require('fs');
const path = require('path');
const shelljs = require('shelljs');
const { promisify } = require('util');
const recursiveReadDirSync = require('recursive-readdir-sync');
const changeCase = require('change-case');

const templateDir = 'templates';
const templates = recursiveReadDirSync(path.resolve(__dirname, `./${templateDir}`));

const moduleName = changeCase.paramCase(process.argv[2]);
const moduleNamePascal = changeCase.pascalCase(moduleName);
const moduleDir = path.join(process.cwd(), moduleName);

// create module dir
if (fs.existsSync(moduleDir) === false) {
  fs.mkdirSync(moduleDir);
}
// create vscode dir
if (fs.existsSync(path.join(moduleDir, '.vscode')) === false) {
  fs.mkdirSync(path.join(moduleDir, '.vscode'));
}

for (const filePath of templates) {
  const content = fs.readFileSync(filePath, { encoding: 'utf8' });
  const scrubbed = content
    .replace('{{moduleName}}', moduleName)
    .replace('{{moduleNamePascal}}', moduleNamePascal);
  const relativeDest = filePath
    .replace(__dirname, '')
    .replace(`/${templateDir}/`, '');
  const dest = path.join(process.cwd(), moduleName, relativeDest);
  console.log(`writing ${relativeDest} -> ${dest}`);
  fs.writeFileSync(dest, scrubbed, { encoding: 'utf8' });
}

// cd into the module dir
const modulePath = path.join(process.cwd(), moduleName);
shelljs.cd(modulePath);

const exec = promisify(shelljs.exec);

// install packages
exec('yarn install')
  .then(() => exec('git init'))
  .then(() => exec('git add .'))
  .then(() => exec('git commit -am "initial commit"'));