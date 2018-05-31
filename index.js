#!/usr/bin/env node

/**
 * usage:
 * node make-module moduleName echo pwd
 */

const fs = require('fs');
const path = require('path');
const recursiveReadDirSync = require('recursive-readdir-sync');
const changeCase = require('change-case');

const templates = recursiveReadDirSync(path.resolve(__dirname, './templates'));

const moduleName = process.argv[2];
const moduleNamePascal = changeCase.pascalCase(moduleName);

for (const filePath of templates) {
  const content = fs.readFileSync(filePath, { encoding: 'utf8' });
  const scrubbed = content
    .replace('{{moduleName}}', moduleName)
    .replace('{{moduleNamePascal}}', moduleNamePascal);
  const relativeDest = filePath.replace(__dirname, '');
  const dest = path.join(process.cwd(), changeCase.paramCase(moduleName), relativeDest);
  console.log(`writing ${relativeDest} -> ${dest}`);
  // fs.writeFileSync(dest, scrubbed, { encoding: 'utf8' });
}
