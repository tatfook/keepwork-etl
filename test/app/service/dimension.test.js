'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/dimension.test.js', () => {
  let ctx;
  beforeEach(() => {
    ctx = app.mockContext();
  });

  it('should create valid dimension', async () => {
    const data = {
      id: 12345,
      email: 'hello@example.com',
      mobile: '123456789',
    };

    const event = {
      category: 'keepwork',
      action: 'create_user',
      data,
    };
    const res = await ctx.service.dimension.create(event);
    assert(res);
  });

  it('should not create invalid dimension', async () => {
    const data = { hello: 'www' };
    const event = {
      category: 'keepwork',
      action: 'create_monster',
      data,
    };
    const res = await ctx.service.dimension.create(event);
    assert(!res);
  });
});
