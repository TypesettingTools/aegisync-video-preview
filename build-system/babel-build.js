const path = require('path');
const gulp = require('gulp');
// eslint-disable-next-line import/no-extraneous-dependencies
const babel = require('gulp-babel');
// eslint-disable-next-line import/no-extraneous-dependencies
const sourceMaps = require('gulp-sourcemaps');

const presetEnv = require.resolve('@babel/preset-env');
const presetExtendScript = require.resolve('babel-preset-extendscript');

const getBabelBuildStream = (sourcesPath, presets) =>
  gulp
    .src(path.join(sourcesPath))
    .pipe(sourceMaps.init())
    .pipe(
      babel({
        presets,
        env: {
          test: {
            plugins: [
              [
                require.resolve('babel-plugin-istanbul'),
                {
                  exclude: '**/*.spec.js',
                },
              ],
            ],
          },
        },
        plugins: [
          [
            require.resolve('@babel/plugin-proposal-decorators'),
            {
              legacy: true,
            },
          ],
          [
            require.resolve('@babel/plugin-proposal-class-properties'),
            {
              loose: true,
            },
          ],
          require.resolve('@babel/plugin-syntax-dynamic-import'),
          require.resolve('babel-plugin-dynamic-import-node'),
          require.resolve('@babel/plugin-proposal-optional-chaining'),
        ],
      })
    )
    .pipe(sourceMaps.write());

const createBabelNodeBuildTask = (basePath = process.cwd(), nodeVersion = '7.7.4') => {
  const babelBuildTask = (sourcesPath, destinationPath) => () =>
    getBabelBuildStream(sourcesPath, [
      [
        presetEnv,
        {
          targets: {
            node: nodeVersion,
          },
        },
      ],
    ]).pipe(gulp.dest(destinationPath));

  const tasks = gulp.series(
    babelBuildTask(path.join(basePath, 'src', '**', '*.js'), path.join(basePath, 'build')),
    babelBuildTask(path.join(basePath, 'test', 'src', '**', '*.js'), path.join(basePath, 'test', 'build'))
  );
  tasks.displayName = `babel-build-node-v${nodeVersion}`;

  return tasks;
};

const createBabelExtendScriptBuildTask = (basePath = process.cwd()) => {
  const babelBuildTask = (sourcesPath, destinationPath) => () =>
    getBabelBuildStream(sourcesPath, [presetExtendScript]).pipe(gulp.dest(destinationPath));

  const tasks = gulp.series(
    babelBuildTask(path.join(basePath, 'src', '**', '*.jsx'), path.join(basePath, 'build')),
    babelBuildTask(path.join(basePath, 'test', 'src', '**', '*.jsx'), path.join(basePath, 'test', 'build'))
  );
  tasks.displayName = `babel-build-extendscript`;

  return tasks;
};

module.exports = {
  createBabelNodeBuildTask,
  createBabelExtendScriptBuildTask,
  getBabelBuildStream,
};
