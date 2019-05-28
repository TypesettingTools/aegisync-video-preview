// eslint-disable-next-line import/no-extraneous-dependencies
const del = require('del');

module.exports = (paths, title = 'files', force = true) => {
  if (typeof paths == 'string') paths = [paths];

  const delTask = () => del(paths, {force});
  delTask.displayName = `del-${title}`;
  return delTask;
};
