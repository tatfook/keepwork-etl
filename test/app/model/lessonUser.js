'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/model/lessonUser.test.js', () => {
  let ctx;
  beforeEach(async () => {
    ctx = app.mockContext();
    await ctx.model.user.createWithEvent({ id: 123 });
  });

  it('should create lesson user with valid event data', async () => {
    const data = {
      id: 12345,
      userId: 123,
    };

    const res = await ctx.model.LessonUser.createWithEvent(data);
    assert(res);
  });

  it('should not create lesson user without id', async () => {
    const data = {
      userId: 123,
    };

    const res = await ctx.model.LessonUser.createWithEvent(data);
    assert(!res);
  });

  it('should not create lesson user without user id', async () => {
    const data = {
      id: 12345,
    };

    const res = await ctx.model.LessonUser.createWithEvent(data);
    assert(!res);
  });

});
