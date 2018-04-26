import { pathToList } from './path';

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
