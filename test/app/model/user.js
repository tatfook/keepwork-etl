'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/model/user.test.js', () => {
  let ctx;
  beforeEach(() => {
    ctx = app.mockContext();
  });

  it('should create user with valid event data', async () => {
    const data = {
      id: 12345,
      email: 'hello@example.com',
      mobile: '123456789',
    };

    const res = await ctx.model.user.createWithEvent(data);
    assert(res);
  });

  it('should not create user with invalid event data', async () => {
    const data = {
      email: 'hello@example.com',
      mobile: '123456789',
    };

    const res = await ctx.model.user.createWithEvent(data);
    assert(!res);
  });

});
