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

  if (args.typescript) {
    const { dependencies, devDependencies } = typescript;
    if (dependencies.length > 0) {
      commands.push(`yarn add ${dependencies.join(' ')}`);
    }

    if (devDependencies.length > 0) {
      commands.push(`yarn add --dev ${devDependencies.join(' ')}`);
    }
  }
  return commands.join(' && ');
};

const trasnformContent = (content, filePath) => {
  if (!args.typescript || !filePath.includes('package.json')) {
    return content;
  }

  const data = JSON.parse(content);
  data.main = 'dist/index.js';
  data.types = 'dist/index.d.ts';
  data.husky = {
    hooks: {
      'pre-commit': 'npm run build',
    },
  };
  data.scripts.build = 'tsc';
  data.scripts.dev = 'tsc --watch';
  return JSON.stringify(data, null, 2);
};

const transformTemplateList = (templates) => {
  if (!args.typescript) {
    return templates.filter((t) => t.includes('tsconfig.json') === false);
  }
  return templates;
}

module.exports = { getDependencyStr, trasnformContent, transformTemplateList };
