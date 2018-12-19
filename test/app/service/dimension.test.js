'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/dimension.test.js', () => {
  let ctx;
  let data;
  beforeEach(() => {
    ctx = app.mockContext();
    data = {
      id: 12345,
      email: 'hello@example.com',
      mobile: '123456789',
    };
  });

  describe('#getModelName', () => {
    it('should return model name with valid action', () => {
      assert(ctx.service.dimension.getModelName('upsert_user', 'upsert') === 'User');
    });

    it('should not return model name with invalid action', () => {
      assert(ctx.service.dimension.getModelName('upsert_user', 'create') !== 'User');
    });
  });

  describe('#create', () => {
    it('should create valid dimension', async () => {
      const event = {
        category: 'keepwork',
        action: 'create_user',
        data,
      };
      const res = await ctx.service.dimension.create(event);
      assert(res);
    });

    it('should not create invalid dimension', async () => {
      const event = {
        category: 'keepwork',
        action: 'create_monster',
        data,
      };
      const res = await ctx.service.dimension.create(event);
      assert(!res);
    });

    it('should not create invalid action', async () => {
      const event = {
        category: 'keepwork',
        action: 'upsert_user',
        data,
      };
      const res = await ctx.service.dimension.create(event);
      assert(!res);
    });
  });

  describe('#upsert', () => {
    it('should upsert valid dimension', async () => {
      const event = {
        category: 'keepwork',
        action: 'upsert_user',
        data,
      };
      const res = await ctx.service.dimension.upsert(event);
      assert(res);
    });

    it('should not upsert invalid dimension', async () => {
      const event = {
        category: 'keepwork',
        action: 'upsert_monster',
        data,
      };
      const res = await ctx.service.dimension.upsert(event);
      assert(!res);
    });

    it('should not upsert invalid action', async () => {
      const event = {
        category: 'keepwork',
        action: 'create_user',
        data,
      };
      const res = await ctx.service.dimension.upsert(event);
      assert(!res);
    });
  });

});
