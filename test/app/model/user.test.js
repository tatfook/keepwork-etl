'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/model/user.test.js', () => {
  let ctx;
  let error;
  beforeEach(() => {
    error = undefined;
    ctx = app.mockContext();
  });

  describe('#createFromEvent()', () => {
    it('should create user with valid event data', async () => {
      const data = {
        id: 12345,
        email: 'hello@example.com',
        mobile: '123456789',
      };
      const res = await ctx.model.User.createFromEvent(data);
      assert(res);
    });

    it('should not create user with invalid event data', async () => {
      const data = {
        email: 'hello@example.com',
        mobile: '123456789',
      };
      try {
        await ctx.model.User.createFromEvent(data);
      } catch (e) {
        error = e;
      }
      assert(error);
    });
  });

  describe('#updateFromEvent()', () => {
    beforeEach(async () => {
      await ctx.model.User.createFromEvent({ id: 123 });
    });
    it('should update user with correct id', async () => {
      const data = {
        id: 123,
        email: 'hello@example.com',
      };
      const res = await ctx.model.User.updateFromEvent(data);
      assert.ok(res);
      assert(res.email === data.email);
    });
    it('should not update user with incorrect id', async () => {
      const data = {
        id: 123456789,
        email: 'hello@example.com',
      };
      try {
        await ctx.model.User.updateFromEvent(data);
      } catch (e) {
        error = e;
      }
      assert(error);
    });
    it('should not update user without id', async () => {
      const data = {
        email: 'hello@example.com',
      };
      try {
        await ctx.model.User.updateFromEvent(data);
      } catch (e) {
        error = e;
      }
      assert(error);
    });
  });

  describe('#upsertFromEvent()', () => {
    it('should update user if user already exist', async () => {
      const old = await ctx.model.User.createFromEvent({ id: 123 });
      const data = {
        id: 123,
        email: 'hello@example.com',
      };
      const res = await ctx.model.User.upsertFromEvent(data);
      assert(res.email === data.email);
      assert(res.id === old.id);
    });

    it('should create user if user not exist', async () => {
      const data = {
        id: 123,
        email: 'hello@example.com',
      };
      const res = await ctx.model.User.upsertFromEvent(data);
      assert(res.email === data.email);
    });
  });

});
