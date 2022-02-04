import { CheckUserMiddleware } from './checkuser.middleware';

describe('CheckuserMiddleware', () => {
  it('should be defined', () => {
    expect(new CheckUserMiddleware()).toBeDefined();
  });
});
