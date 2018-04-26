const isInPath = (path, fileName) => {
  if (!fileName.startsWith(path)) {
    return false;
  }
  const relative = fileName.substring(path.length);
  if (relative.indexOf('/') === relative.length - 1 || relative.indexOf('/') === -1) {
    // Match for folders and files
    return true;
  }
  return false;
};

/**
 * Takes a path and returns a list of tuples (absolute, name)
 * @param {String} path
 */
const pathToList = (path) => {
  const soFar = [];
  let newPath = path;
  if (newPath === '/' || newPath === '') {
    return [{ absolute: '/', relative: 'Squidbox' }];
  }
  if (newPath.startsWith('/')) {
    newPath = newPath.substring(1);
  }
  if (newPath.endsWith('/')) {
    newPath = newPath.slice(0, newPath.length - 1);
  }
  const split = newPath.split('/');
  soFar.push({ absolute: '', relative: 'Squidbox' });
  split.forEach((name, i) =>
    soFar.push({ absolute: `${soFar[i].absolute}/${name}`, relative: name }));
  soFar[0].absolute = '/';
  return soFar;
};

export default isInPath;
export { pathToList };

