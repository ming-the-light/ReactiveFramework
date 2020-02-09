// uglify handles only es5 code, so this also acts as smoke test against shipping es2015+ syntax
var uglify = require('rollup-plugin-uglify').uglify;
var pkg = require('./package.json');
var input = 'src/index.ts';
var resolve = require('rollup-plugin-node-resolve');
var babel = require('rollup-plugin-babel');
var typescript = require('rollup-plugin-typescript');

var config = {
  input,
  output: {
    file: './dist/index.js',
    format: 'umd',
    name: 'RF',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    typescript({ lib: ["es5", "es6", "dom"], target: "es5" }),
    babel()
  ]
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
      },
      warnings: false
    })
  );
}

module.exports = config;