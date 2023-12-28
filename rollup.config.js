import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import typescript from '@rollup/plugin-typescript';
import fs from 'fs';
import path from 'path';

const srcDir = path.resolve(__dirname, 'src');

function findEntryPoints(dir, prefix = '') {
  let entries = {};

  fs.readdirSync(dir).forEach((subdir) => {
    const subPath = path.join(dir, subdir);
    if (fs.statSync(subPath).isDirectory()) {
      // Check if this directory contains an index file
      if (fs.existsSync(path.join(subPath, 'index.tsx')) || fs.existsSync(path.join(subPath, 'index.ts'))) {
        entries[prefix + subdir] = path.join(subPath, 'index.ts');
      } else {
        // Recurse into the directory
        Object.assign(entries, findEntryPoints(subPath, `${prefix}${subdir}/`));
      }
    }
  });

  return entries;
}

const entryPoints = findEntryPoints(srcDir);
console.log(entryPoints);
export default Object.keys(entryPoints).map((name) => ({
  input: entryPoints[name],
  output: {
    file: `dist/${name}/index.js`,
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    postcss({
      modules: true,
      inject: true,
    }),
  ],
  external: ['react', 'react-dom'],
}));
