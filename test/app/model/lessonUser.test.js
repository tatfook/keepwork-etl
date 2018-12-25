'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/model/lessonUser.test.js', () => {
  let ctx;
  let error;
  beforeEach(async () => {
    error = undefined;
    ctx = app.mockContext();
    await ctx.model.User.createFromEvent({ id: 123 });
  });

  describe('#createFromEvent()', () => {
    it('should create lesson user with valid event data', async () => {
      const data = {
        id: 12345,
        userId: 123,
      };
      const res = await ctx.model.LessonUser.createFromEvent(data);
      assert(res);
    });

    it('should not create lesson user without id', async () => {
      const data = {
        userId: 123,
      };
      try {
        await ctx.model.LessonUser.createFromEvent(data);
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should not create lesson user without user id', async () => {
      const data = {
        id: 12345,
      };
      try {
        await ctx.model.LessonUser.createFromEvent(data);
      } catch (e) {
        error = e;
      }
      assert(error);
    });
  });

  describe('#updateFromEvent()', () => {
    beforeEach(async () => {
      await ctx.model.LessonUser.createFromEvent({ id: 12345, userId: 123 });
    });
    it('should update lessonUser with correct id', async () => {
      const data = {
        id: 12345,
        role: 'teacher',
      };
      const res = await ctx.model.LessonUser.updateFromEvent(data);
      assert(res);
    });
    it('should not update LessonUser with incorrect id', async () => {
      const data = {
        id: 123456789,
        role: 'teacher',
      };
      try {
        await ctx.model.LessonUser.updateFromEvent(data);
      } catch (e) {
        error = e;
      }
      assert(error);
    });
    it('should not update LessonUser without id', async () => {
      const data = {
        role: 'teacher',
      };
      try {
        await ctx.model.LessonUser.updateFromEvent(data);
      } catch (e) {
        error = e;
      }
      assert(error);
    });
  });

  describe('#upsertFromEvent()', () => {
    it('should update LessonUser if LessonUser already exist', async () => {
      const old = await ctx.model.LessonUser.createFromEvent({ id: 12345, userId: 123 });
      const data = {
        id: 12345,
        role: 'teacher',
      };
      const res = await ctx.model.LessonUser.upsertFromEvent(data);
      assert(res.role === data.role);
      assert(res.id === old.id);
    });

    it('should create LessonUser if LessonUser not exist', async () => {
      const data = {
        id: 12345,
        userId: 123,
        role: 'teacher',
      };
      const res = await ctx.model.LessonUser.upsertFromEvent(data);
      assert(res.role === data.role);
    });
  });

});
