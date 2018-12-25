'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/model/lessonFact.test.js', () => {
  let ctx;
  let error;
  beforeEach(async () => {
    error = undefined;
    ctx = app.mockContext();
    await ctx.model.User.createFromEvent({ id: 123 });
    await app.model.Package.createFromEvent({
      id: 12345,
      userId: 123,
    });
    await app.model.Lesson.createFromEvent({
      id: 12345,
      userId: 123,
    });
  });

  describe('#beginLearning', async () => {
    it('should create learning fact with valid data', async () => {
      const fact = await ctx.model.LearningFact.beginLearning({
        classroomKey: '12345',
        recordKey: '12345',
        userId: 123,
        packageId: 12345,
        lessonId: 12345,
        beginAt: '2018-12-25',
      });

      assert(fact.beginTimeId === 20181225);
    });

    it('should create learning fact without classroom key', async () => {
      const fact = await ctx.model.LearningFact.beginLearning({
        recordKey: '12345',
        userId: 123,
        packageId: 12345,
        lessonId: 12345,
        beginAt: '2018-12-25',
      });

      assert(fact);
      assert(fact.beginTimeId === 20181225);
    });

    it('should not create learning fact without recordKey', async () => {
      try {
        await ctx.model.LearningFact.beginLearning({
          userId: 123,
          packageId: 12345,
          lessonId: 12345,
          beginAt: '2018-12-25',
        });
      } catch (e) {
        error = e;
      }
      assert(error);

    });

    it('should not create learning fact  with invalid user id', async () => {
      try {
        await ctx.model.LearningFact.beginLearning({
          recordKey: '12345',
          userId: 12345,
          packageId: 12345,
          lessonId: 12345,
          beginAt: '2018-12-25',
        });
      } catch (e) {
        error = e;
      }
      assert(error);
      error = undefined;
      try {
        await ctx.model.LearningFact.beginLearning({
          recordKey: '12345',
          packageId: 12345,
          lessonId: 12345,
          beginAt: '2018-12-25',
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should not create learning fact  with invalid package id', async () => {
      try {
        await ctx.model.LearningFact.beginLearning({
          recordKey: '12345',
          userId: 123,
          lessonId: 12345,
          beginAt: '2018-12-25',
        });
      } catch (e) {
        error = e;
      }
      assert(error);
      error = undefined;
      try {
        await ctx.model.LearningFact.beginLearning({
          recordKey: '12345',
          userId: 123,
          packageId: 12345678,
          lessonId: 12345,
          beginAt: '2018-12-25',
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should not create learning fact with invalid lesson id', async () => {
      try {
        await ctx.model.LearningFact.beginLearning({
          recordKey: '12345',
          userId: 123,
          packageId: 12345,
          beginAt: '2018-12-25',
        });
      } catch (e) {
        error = e;
      }
      assert(error);
      error = undefined;
      try {
        await ctx.model.LearningFact.beginLearning({
          recordKey: '12345',
          userId: 123,
          packageId: 12345,
          lessonId: 12345678,
          beginAt: '2018-12-25',
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should not create learning fact with invalid time', async () => {
      try {
        await ctx.model.LearningFact.beginLearning({
          recordKey: '12345',
          userId: 123,
          packageId: 12345,
          lessonId: 12345,
          beginAt: '2118-12-25',
        });
      } catch (e) {
        error = e;
      }
      assert(error);
      error = undefined;
      try {
        await ctx.model.LearningFact.beginLearning({
          recordKey: '12345',
          userId: 123,
          packageId: 12345,
          lessonId: 12345678,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });
  });

  describe('#endLearning', async () => {
    beforeEach(async () => {
      await ctx.model.LearningFact.beginLearning({
        recordKey: '12345',
        userId: 123,
        packageId: 12345,
        lessonId: 12345,
        beginAt: '2018-12-25 00:00:00',
      });
    });
    it('should update learning fact with valid data', async () => {
      const fact = await ctx.model.LearningFact.endLearning({
        recordKey: '12345',
        userId: 123,
        packageId: 12345,
        lessonId: 12345,
        endAt: '2018-12-25 00:10:00',
      });

      assert(fact.endTimeId === 20181225);
      assert(fact.timeAmount === 10);
    });

    it('should update learning fact with classroomKey', async () => {
      await ctx.model.LearningFact.beginLearning({
        classroomKey: '12345',
        recordKey: '123456',
        userId: 123,
        packageId: 12345,
        lessonId: 12345,
        beginAt: '2018-12-25 00:00:00',
      });
      const fact = await ctx.model.LearningFact.endLearning({
        classroomKey: '12345',
        recordKey: '123456',
        userId: 123,
        packageId: 12345,
        lessonId: 12345,
        endAt: '2018-12-25 00:10:00',
      });

      assert(fact.endTimeId === 20181225);
      assert(fact.timeAmount === 10);
    });

    it('should not update learning fact without recordKey', async () => {
      try {
        await ctx.model.LearningFact.endLearning({
          userId: 123,
          packageId: 12345,
          lessonId: 12345,
          endAt: '2018-12-25 00:10:00',
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should not update learning fact with invalid user id', async () => {
      try {
        await ctx.model.LearningFact.endLearning({
          recordKey: '12345',
          userId: 12345,
          packageId: 12345,
          lessonId: 12345,
          endAt: '2018-12-25 00:10:00',
        });
      } catch (e) {
        error = e;
      }
      assert(error);
      error = undefined;
      try {
        await ctx.model.LearningFact.endLearning({
          recordKey: '12345',
          packageId: 12345678,
          lessonId: 12345,
          endAt: '2018-12-25 00:10:00',
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should not update learning fact with invalid package id', async () => {
      try {
        await ctx.model.LearningFact.endLearning({
          recordKey: '12345',
          userId: 123,
          lessonId: 12345,
          endAt: '2018-12-25 00:10:00',
        });
      } catch (e) {
        error = e;
      }
      assert(error);
      error = undefined;
      try {
        await ctx.model.LearningFact.endLearning({
          recordKey: '12345',
          userId: 123,
          packageId: 12345678,
          lessonId: 12345,
          endAt: '2018-12-25 00:10:00',
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should not update learning fact with invalid lesson id', async () => {
      try {
        await ctx.model.LearningFact.endLearning({
          recordKey: '12345',
          userId: 123,
          packageId: 12345,
          endAt: '2018-12-25 00:10:00',
        });
      } catch (e) {
        error = e;
      }
      assert(error);
      error = undefined;
      try {
        await ctx.model.LearningFact.endLearning({
          recordKey: '12345',
          userId: 123,
          packageId: 12345,
          lessonId: 12345678,
          endAt: '2018-12-25 00:10:00',
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should not update learning fact with invalid time', async () => {
      try {
        await ctx.model.LearningFact.endLearning({
          recordKey: '12345',
          userId: 123,
          packageId: 12345,
          lessonId: 12345,
          endAt: '2118-12-25',
        });
      } catch (e) {
        error = e;
      }
      assert(error);
      error = undefined;
      try {
        await ctx.model.LearningFact.endLearning({
          recordKey: '12345',
          userId: 123,
          packageId: 12345,
          lessonId: 12345678,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });
  });
});
