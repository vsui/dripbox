import { pathToList, pathJoin } from './path';

describe('pathToList', () => {
  it('should work for root', () => {
    expect(pathToList('/')).toEqual([{
      absolute: '/',
      relative: 'Squidbox',
    }]);
  });

  it('should work for one level', () => {
    expect(pathToList('/folders')).toEqual([
      { absolute: '/', relative: 'Squidbox' },
      { absolute: '/folders', relative: 'folders' },
    ]);
  });

  it('should work for three levels', () => {
    expect(pathToList('/folders/fruits/apples')).toEqual([
      { absolute: '/', relative: 'Squidbox' },
      { absolute: '/folders', relative: 'folders' },
      { absolute: '/folders/fruits', relative: 'fruits' },
      { absolute: '/folders/fruits/apples', relative: 'apples' },
    ]);
  });

  it('should work for one level and ends with /', () => {
    expect(pathToList('/folders/')).toEqual([
      { absolute: '/', relative: 'Squidbox' },
      { absolute: '/folders', relative: 'folders' },
    ]);
  });

  it('should work for three levels and ends with /', () => {
    expect(pathToList('/folders/fruits/apples/')).toEqual([
      { absolute: '/', relative: 'Squidbox' },
      { absolute: '/folders', relative: 'folders' },
      { absolute: '/folders/fruits', relative: 'fruits' },
      { absolute: '/folders/fruits/apples', relative: 'apples' },
    ]);
  });

  it('should work for root when it does not start with /', () => {
    expect(pathToList('')).toEqual([{
      absolute: '/',
      relative: 'Squidbox',
    }]);
  });

  it('should work for one level when it does not start with /', () => {
    expect(pathToList('folders')).toEqual([
      { absolute: '/', relative: 'Squidbox' },
      { absolute: '/folders', relative: 'folders' },
    ]);
  });

  it('should work for three levels when it does not start with /', () => {
    expect(pathToList('folders/fruits/apples')).toEqual([
      { absolute: '/', relative: 'Squidbox' },
      { absolute: '/folders', relative: 'folders' },
      { absolute: '/folders/fruits', relative: 'fruits' },
      { absolute: '/folders/fruits/apples', relative: 'apples' },
    ]);
  });
});

describe('pathJoin', () => {
  it('should remove duplicate /\'s (root)', () => {
    expect(pathJoin('/', '/folder')).toBe('/folder');
  });

  it('should remove duplicate /\'s', () => {
    expect(pathJoin('/home/', '/folder')).toBe('/home/folder');
  });

  it('should add slash when necessary', () => {
    expect(pathJoin('folder', 'child')).toBe('folder/child');
  });

  it('should just concatenate when the slashes are ok (1)', () => {
    expect(pathJoin('folder/', 'child')).toBe('folder/child');
  });

  it('should just concatenate when the slashes are ok (2)', () => {
    expect(pathJoin('folder', '/child')).toBe('folder/child');
  });
});
