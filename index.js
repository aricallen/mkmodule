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
const args = require('minimist')(process.argv)

const usage = `
  Usage: mkdir --name=<module-name> [--scope=scope]
`;

const templateDir = 'templates';
const templates = recursiveReadDirSync(path.resolve(__dirname, `./${templateDir}`));

if (args.name === undefined) {
  console.log(usage);
  process.exit(1);
}

const moduleName = changeCase.paramCase(args.name);
const moduleNamePascal = changeCase.pascalCase(moduleName);
const moduleDir = path.join(process.cwd(), moduleName);
const { scope } = args;

// create module dir
if (fs.existsSync(moduleDir) === false) {
  fs.mkdirSync(moduleDir);
}
// create vscode dir
if (fs.existsSync(path.join(moduleDir, '.vscode')) === false) {
  fs.mkdirSync(path.join(moduleDir, '.vscode'));
}

for (const templateFilePath of templates) {
  const content = fs.readFileSync(templateFilePath, { encoding: 'utf8' });
  const scrubbed = content
    .replace('{{scope}}', scope || '')
    .replace('{{moduleName}}', moduleName)
    .replace('{{moduleNamePascal}}', moduleNamePascal);
  const relativeDest = templateFilePath
    .replace(__dirname, '')
    .replace(`/${templateDir}/`, '')
    .replace(/_/g, '');
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