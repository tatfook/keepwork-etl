'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/model/question.test.js', () => {
  let ctx;
  beforeEach(async () => {
    ctx = app.mockContext();
    await ctx.model.User.createFromEvent({ id: 123 });
    await ctx.model.Lesson.createFromEvent({ id: 123, userId: 123 });
  });

  describe('#createFromEvent()', () => {
    it('should create Question with valid event data', async () => {
      const data = {
        lessonId: 123,
        index: 1,
      };
      const res = await ctx.model.Question.createFromEvent(data);
      assert(res);
    });

    it('should not create Question without lesson id', async () => {
      const data = {
        content: 'hey',
        index: 1,
      };
      try {
        await ctx.model.Question.createFromEvent(data);
        assert(false);
      } catch (e) {
        assert(true);
      }
    });
  });

  describe('#updateFromEvent()', () => {
    beforeEach(async () => {
      await ctx.model.Question.createFromEvent({ lessonId: 123, index: 1 });
    });
    it('should update Question with correct id', async () => {
      const data = {
        lessonId: 123,
        index: 1,
        content: 'hello',
      };
      const res = await ctx.model.Question.updateFromEvent(data);
      assert(res);
    });
    it('should not update Question with incorrect id', async () => {
      const data = {
        lessonId: 12345677,
        index: 1,
        content: 'hello',
      };
      try {
        await ctx.model.Question.updateFromEvent(data);
        assert(false);
      } catch (e) {
        assert(true);
      }
    });
    it('should not update Question without id', async () => {
      const data = {
        index: 1,
        content: 'hello',
      };
      try {
        await ctx.model.Question.updateFromEvent(data);
        assert(false);
      } catch (e) {
        assert(true);
      }
    });
    it('should not update Question without index', async () => {
      const data = {
        lessonId: 123,
        content: 'hello',
      };
      try {
        await ctx.model.Question.updateFromEvent(data);
        assert(false);
      } catch (e) {
        assert(true);
      }
    });
  });

  describe('#upsertFromEvent()', () => {
    it('should update Question if Question already exist', async () => {
      const old = await ctx.model.Question.createFromEvent({ lessonId: 123, index: 1 });
      const data = {
        lessonId: 123,
        index: 1,
        content: 'hello',
      };
      const res = await ctx.model.Question.upsertFromEvent(data);
      assert(res.content === data.content);
      assert(res.id === old.id);
    });

    it('should create Question if Question not exist', async () => {
      const data = {
        lessonId: 123,
        index: 1,
        content: 'hello',
      };
      const res = await ctx.model.Question.upsertFromEvent(data);
      assert(res.content === data.content);
    });
  });
});
