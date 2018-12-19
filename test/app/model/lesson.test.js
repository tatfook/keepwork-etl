'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/model/lesson.test.js', () => {
  let ctx;
  beforeEach(async () => {
    ctx = app.mockContext();
    await ctx.model.User.createFromEvent({ id: 123 });
  });

  describe('#createFromEvent()', () => {
    it('should create Lesson with valid event data', async () => {
      const data = {
        id: 12345,
        userId: 123,
      };
      const res = await ctx.model.Lesson.createFromEvent(data);
      assert(res);
    });

    it('should not create Lesson without id', async () => {
      const data = {
        userId: 123,
      };
      try {
        await ctx.model.Lesson.createFromEvent(data);
        assert(false);
      } catch (e) {
        assert(true);
      }
    });

    it('should not create Lesson without user id', async () => {
      const data = {
        id: 12345,
      };
      try {
        await ctx.model.Lesson.createFromEvent(data);
        assert(false);
      } catch (e) {
        assert(true);
      }
    });
  });

  describe('#updateFromEvent()', () => {
    beforeEach(async () => {
      await ctx.model.Lesson.createFromEvent({ id: 12345, userId: 123 });
    });
    it('should update Lesson with correct id', async () => {
      const data = {
        id: 12345,
        quizSize: 10,
      };
      const res = await ctx.model.Lesson.updateFromEvent(data);
      assert(res);
    });
    it('should not update Lesson with incorrect id', async () => {
      const data = {
        id: 123456789,
        quizSize: 10,
      };
      try {
        await ctx.model.Lesson.updateFromEvent(data);
        assert(false);
      } catch (e) {
        assert(true);
      }
    });
    it('should not update Lesson without id', async () => {
      const data = {
        role: 'teacher',
      };
      try {
        await ctx.model.Lesson.updateFromEvent(data);
        assert(false);
      } catch (e) {
        assert(true);
      }
    });
  });

  describe('#upsertFromEvent()', () => {
    it('should update Lesson if Lesson already exist', async () => {
      const old = await ctx.model.Lesson.createFromEvent({ id: 12345, userId: 123 });
      const data = {
        id: 12345,
        quizSize: 10,
      };
      const res = await ctx.model.Lesson.upsertFromEvent(data);
      assert(res.quizSize === data.quizSize);
      assert(res.id === old.id);
    });

    it('should create Lesson if Lesson not exist', async () => {
      const data = {
        id: 12345,
        userId: 123,
        quizSize: 10,
      };
      const res = await ctx.model.Lesson.upsertFromEvent(data);
      assert(res.quizSize === data.quizSize);
    });
  });

});
