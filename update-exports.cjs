const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const packageJsonPath = path.join(__dirname, 'package.json');

function findComponents(dir, prefix = '') {
  let components = [];

  fs.readdirSync(dir).forEach((subdir) => {
    const subPath = path.join(dir, subdir);
    if (fs.statSync(subPath).isDirectory()) {
      // Check if this directory contains an index file (e.g., index.tsx)
      if (fs.existsSync(path.join(subPath, 'index.tsx')) || fs.existsSync(path.join(subPath, 'index.ts'))) {
        components.push(prefix + subdir);
      } else {
        // Recurse into the directory
        components = components.concat(findComponents(subPath, `${prefix}${subdir}/`));
      }
    }
  });

  return components;
}

const components = findComponents(srcDir);

// Read and parse the package.json file
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Update the exports field
packageJson.exports = packageJson.exports || {};
components.forEach((component) => {
  packageJson.exports[`./${component}`] = `./dist/${component}/index.js`;
});

// Write the updated package.json back to disk
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
