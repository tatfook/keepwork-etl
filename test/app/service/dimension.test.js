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
    it('should upsert valid dimension if dimension not exist', async () => {
      const event = {
        category: 'keepwork',
        action: 'upsert_user',
        data,
      };
      const res = await ctx.service.dimension.upsert(event);
      assert(res);
    });

    it('should upsert valid dimension if dimension exist', async () => {
      const old = await ctx.model.User.createFromEvent({ id: 12345 });
      const event = {
        category: 'keepwork',
        action: 'upsert_user',
        data,
      };
      const res = await ctx.service.dimension.upsert(event);
      assert(res);
      assert(res.id === old.id);
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

  describe('#update', () => {
    it('should update valid dimension', async () => {
      const old = await ctx.model.User.createFromEvent({ id: 12345 });
      const event = {
        category: 'keepwork',
        action: 'update_user',
        data,
      };
      const res = await ctx.service.dimension.update(event);
      assert(res);
      assert(res.id === old.id);
      assert(res.email === data.email);
    });

    it('should not update invalid dimension', async () => {
      const event = {
        category: 'keepwork',
        action: 'update_monster',
        data,
      };
      const res = await ctx.service.dimension.update(event);
      assert(!res);
    });

    it('should not update invalid action', async () => {
      const event = {
        category: 'keepwork',
        action: 'create_user',
        data,
      };
      const res = await ctx.service.dimension.update(event);
      assert(!res);
    });

    it('should not update dimension if it is not exist', async () => {
      const event = {
        category: 'keepwork',
        action: 'create_user',
        data,
      };
      const res = await ctx.service.dimension.update(event);
      assert(!res);
    });
  });

});
