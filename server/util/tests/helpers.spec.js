const { getRelativeUrl, isInPath } = require('../helpers');

describe('getRelativeUrl', () => {
  it('throws if prefix does not match', () => {
    expect(() => getRelativeUrl('/something/else/', '/nothing/more')).toThrow();
  });

  it('should return the correct relative url (1)', () => {
    expect(getRelativeUrl('/folder/child/', '/folder/child/ramda.hs')).toBe('/ramda.hs');
  });

  it('should return the correct relative url (2)', () => {
    expect(getRelativeUrl('/folder/child/', '/folder/child/grandchild/ramda.hs')).toBe('/grandchild/ramda.hs');
  });

  it('should return the correct relative url (3)', () => {
    expect(getRelativeUrl('/', '/folder/child/ramda.hs')).toBe('/folder/child/ramda.hs');
  });

  it('should return the correct relative url (4)', () => {
    expect(getRelativeUrl('/folder/child/', '/folder/child/grandchild/')).toBe('/grandchild/');
  });
});

describe('isInPath', () => {
  const inPath = file => isInPath('/path/', file);

  it('should not accept \'/\'', () => {
    expect(inPath('/path/')).toBe(false);
  });

  it('should accept \'file.txt\'', () => {
    expect(getRelativeUrl('/path/', '/path/file.txt')).toBe('/file.txt');
    expect(getRelativeUrl('/path/', '/path/file.txt').substring(1)).toBe('file.txt');
    expect(inPath('/path/file.txt')).toBe(true);
  });

  it('should accept \'folder/\'', () => {
    expect(getRelativeUrl('/path/', '/path/folder/')).toBe('/folder/');
    expect(getRelativeUrl('/path/', '/path/folder/').substring(1)).toBe('folder/');
    expect(inPath('/path/folder/')).toBe(true);
  });

  it('should not accept \'folder/child\'', () => {
    expect(inPath('/path/folder/child/')).toBe(false);
  });

  it('should not accept \'folder/file.txt\'', () => {
    expect(inPath('/path/folder/file.txt')).toBe(false);
  });

  it('should not accept \'folder/child/file.txt\'', () => {
    expect(inPath('/path/folder/child/file.txt')).toBe(false);
  });

  it('should not accept if prefixes do not match', () => {
    expect(inPath('/applebutter')).toBe(false);
  });

  it('should accept a file in the root folder', () => {
    expect(isInPath('/', '/file.txt')).toBe(true);
  });
  it('should accept a folder in the root folder', () => {
    expect(isInPath('/', '/folder/')).toBe(true);
  });
  it('should not accept a file in a folder in the root folder', () => {
    expect(isInPath('/', '/folder/file.txt')).toBe(false);
  });
});
