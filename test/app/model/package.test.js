'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/model/package.test.js', () => {
  let ctx;
  let error;
  beforeEach(async () => {
    error = undefined;
    ctx = app.mockContext();
    await ctx.model.User.createFromEvent({ id: 123 });
  });

  describe('#createFromEvent()', () => {
    it('should create package with valid event data', async () => {
      const data = {
        id: 12345,
        userId: 123,
      };
      const res = await ctx.model.Package.createFromEvent(data);
      assert(res);
    });

    it('should not create package without id', async () => {
      const data = {
        userId: 123,
      };
      try {
        await ctx.model.Package.createFromEvent(data);
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should not create package without user id', async () => {
      const data = {
        id: 12345,
      };
      try {
        await ctx.model.Package.createFromEvent(data);
      } catch (e) {
        error = e;
      }
      assert(error);
    });
  });

  describe('#updateFromEvent()', () => {
    beforeEach(async () => {
      await ctx.model.Package.createFromEvent({ id: 12345, userId: 123 });
    });
    it('should update package with correct id', async () => {
      const data = {
        id: 12345,
        lessonCount: 10,
      };
      const res = await ctx.model.Package.updateFromEvent(data);
      assert(res);
    });
    it('should not update Package with incorrect id', async () => {
      const data = {
        id: 123456789,
        lessonCount: 10,
      };
      try {
        await ctx.model.Package.updateFromEvent(data);
      } catch (e) {
        error = e;
      }
      assert(error);
    });
    it('should not update Package without id', async () => {
      const data = {
        role: 'teacher',
      };
      try {
        await ctx.model.Package.updateFromEvent(data);
      } catch (e) {
        error = e;
      }
      assert(error);
    });
  });

  describe('#upsertFromEvent()', () => {
    it('should update Package if Package already exist', async () => {
      const old = await ctx.model.Package.createFromEvent({ id: 12345, userId: 123 });
      const data = {
        id: 12345,
        lessonCount: 10,
      };
      const res = await ctx.model.Package.upsertFromEvent(data);
      assert(res.lessonCount === data.lessonCount);
      assert(res.id === old.id);
    });

    it('should create Package if Package not exist', async () => {
      const data = {
        id: 12345,
        userId: 123,
        lessonCount: 10,
      };
      const res = await ctx.model.Package.upsertFromEvent(data);
      assert(res.lessonCount === data.lessonCount);
    });
  });

});
