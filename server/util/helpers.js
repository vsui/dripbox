const getRelativeUrl = (path, fileName) => {
  if (!fileName.startsWith(`${path}`)) {
    throw new Error('Cannot get relative url: prefix does not match');
  }
  const relative = fileName.substring(path.length - 1);
  return relative;
};

const isInPath = (path, fileName) => {
  if (!fileName.startsWith(path)) {
    return false;
  }
  const relative = getRelativeUrl(path, fileName);
  const withoutSlash = relative.substring(1);
  if (withoutSlash === '') {
    // Ignore folder marker
    return false;
  }
  if (withoutSlash.indexOf('/') === withoutSlash.length - 1 || withoutSlash.indexOf('/') === -1) {
    // Match for folders and files
    return true;
  }
  return false;
};

const splitOnSlash = (path) => {
  const slashIndex = path.indexOf('/');
  if (slashIndex === -1) {
    return [path, ''];
  }
  return [path.substring(0, slashIndex), path.substring(slashIndex)];
};

module.exports = {
  getRelativeUrl,
  isInPath,
  splitOnSlash,
};
