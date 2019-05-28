require('source-map-support').install();

const gulp = require('gulp');
const path = require('path');

// eslint-disable-next-line no-unused-vars
const requireDefault = modulePath => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const obj = require(modulePath);
  // eslint-disable-next-line no-underscore-dangle
  return obj && obj.__esModule ? obj.default : obj;
};

const buildCleanTask = done => {
  // eslint-disable-next-line global-require
  const delTask = require('./build-system/del');
  gulp.series(
    delTask(path.join(__dirname, 'client/build/**/*'), 'client-src-build'),
    delTask(path.join(__dirname, 'client/test/build/**/*'), 'client-test-build'),
    delTask(path.join(__dirname, 'host/build/**/*'), 'host-src-build'),
    delTask(path.join(__dirname, 'host/test/build/**/*'), 'host-test-build')
  )(done);
};
buildCleanTask.description = 'Deletes existing build artifacts.';
gulp.task('build-clean', buildCleanTask);

const buildTask = gulp.series('build-clean', async () => {
  // eslint-disable-next-line global-require
  const {createBabelNodeBuildTask, createBabelExtendScriptBuildTask} = require('./build-system/babel-build');
  await new Promise((resolve, reject) =>
    createBabelNodeBuildTask(path.join(__dirname, 'client'))(err => (err ? reject(err) : resolve()))
  );
  await new Promise((resolve, reject) =>
    createBabelExtendScriptBuildTask(path.join(__dirname, 'host'))(err => (err ? reject(err) : resolve()))
  );
});
buildTask.description = 'Builds the source code using the Babel transpiler.';
gulp.task('build', buildTask);
