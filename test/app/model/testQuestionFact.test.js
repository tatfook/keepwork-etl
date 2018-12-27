'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/model/testQuestionFact.test.js', () => {
  let ctx;
  let error;
  beforeEach(async () => {
    error = undefined;
    ctx = app.mockContext();
    await ctx.model.User.createFromEvent({ id: 123 });
    await ctx.model.Package.createFromEvent({ id: 123, userId: 123 });
    await ctx.model.Lesson.createFromEvent({ id: 123, userId: 123 });
    await ctx.model.Question.createFromEvent({ lessonId: 123, index: 1, content: 'hello' });
    await ctx.model.Question.createFromEvent({ lessonId: 123, index: 2, content: 'world' });
    await ctx.model.LearningFact.beginLearning({
      classroomKey: '12345',
      recordKey: '12345',
      userId: 123,
      packageId: 123,
      lessonId: 123,
      beginAt: '2018-12-27 00:00:00',
    });
  });

  describe('#createFromEvent()', () => {
    it('should create testQuestion fact with valid event data', async () => {
      const data = {
        recordKey: 12345,
        index: 1,
        answer: 'keepwork',
        isRight: true,
        commitAt: '2018-12-27 00:10:00',
      };
      const res = await ctx.model.TestQuestionFact.createFromEvent(data);
      assert(res);
    });

    it('should not create testQuestion fact with invalid recordKey', async () => {
      try {
        await ctx.model.Question.createFromEvent({
          recordKey: 123456,
          index: 1,
          answer: 'keepwork',
          isRight: true,
          commitAt: '2018-12-27 00:10:00',
        });
      } catch (e) {
        error = e;
      }
      assert(error);
      error = undefined;
      try {
        await ctx.model.Question.createFromEvent({
          index: 1,
          answer: 'keepwork',
          isRight: true,
          commitAt: '2018-12-27 00:10:00',
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should not create testQuestion fact with invalid question index', async () => {
      try {
        await ctx.model.Question.createFromEvent({
          recordKey: 123,
          index: 10,
          answer: 'keepwork',
          isRight: true,
          commitAt: '2018-12-27 00:10:00',
        });
      } catch (e) {
        error = e;
      }
      assert(error);
      error = undefined;
      try {
        await ctx.model.Question.createFromEvent({
          recordKey: 123,
          answer: 'keepwork',
          isRight: true,
          commitAt: '2018-12-27 00:10:00',
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should not create testQuestion fact with invalid commit time', async () => {
      try {
        await ctx.model.Question.createFromEvent({
          recordKey: 123,
          index: 1,
          answer: 'keepwork',
          isRight: true,
          commitAt: '2118-12-27 00:10:00',
        });
      } catch (e) {
        error = e;
      }
      assert(error);
      error = undefined;
      try {
        await ctx.model.Question.createFromEvent({
          recordKey: 123,
          index: 1,
          answer: 'keepwork',
          isRight: true,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });
  });
});
