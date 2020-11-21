const args = require('minimist')(process.argv);
const { dependencies, devDependencies } = require('./deps.js');

const getDependencyStr = () => {
  const commands = [];
  if (dependencies.length > 0) {
    commands.push(`yarn add ${dependencies.join(' ')}`);
  }

  if (devDependencies.length > 0) {
    commands.push(`yarn add --dev ${devDependencies.join(' ')}`);
  }
  return commands.join(' && ');
};

module.exports = { getDependencyStr, trasnformContent, transformTemplateList };
