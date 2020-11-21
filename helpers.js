const args = require('minimist')(process.argv);
const { dependencies, typescript, devDependencies } = require('./deps.js');

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

const trasnformContent = (content, filePath) => {
  return content;
};

const transformTemplateList = (templates) => {
  if (!args.typescript) {
    return templates.filter((t) => t.includes('tsconfig.json') === false);
  }
  return templates;
}

module.exports = { getDependencyStr, trasnformContent, transformTemplateList };
