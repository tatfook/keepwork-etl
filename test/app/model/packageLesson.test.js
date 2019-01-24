'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/model/packageLesson.test.js', () => {
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
    await app.model.Package.createFromEvent({
      id: 12346,
      userId: 123,
    });
    await app.model.Lesson.createFromEvent({
      id: 12345,
      userId: 123,
    });
    await app.model.Lesson.createFromEvent({
      id: 12346,
      userId: 123,
    });
  });

  describe('#createFromEvent()', () => {
    it('should create packageLesson with valid event data', async () => {
      const data = {
        packageId: 12345,
        lessonId: 12345,
      };
      const res = await ctx.model.PackageLesson.createFromEvent(data);
      assert.ok(res);
    });

    it('should not create packageLesson without package id', async () => {
      const data = {
        lessonId: 12345,
      };
      try {
        await ctx.model.Package.createFromEvent(data);
      } catch (e) {
        error = e;
      }
      assert.ok(error);
    });

    it('should not create packageLesson without lesson id', async () => {
      const data = {
        packageId: 12345,
      };
      try {
        await ctx.model.Package.createFromEvent(data);
      } catch (e) {
        error = e;
      }
      assert.ok(error);
    });
  });

  describe('#updateFromEvent()', () => {
    beforeEach(async () => {
      await ctx.model.PackageLesson.createFromEvent({ packageId: 12345, lessonId: 12345 });
    });
    it('should update packageLesson with correct data', async () => {
      const data = {
        packageId: 12345,
        lessonId: 12345,
        deletedAt: '2019-01-24',
      };
      const res = await ctx.model.PackageLesson.updateFromEvent(data);
      assert.ok(res);
    });
    it('should not update packageLesson twice', async () => {
      const data = {
        packageId: 12345,
        lessonId: 12345,
        deletedAt: '2019-01-24',
      };
      await ctx.model.PackageLesson.updateFromEvent(data);
      try {
        await ctx.model.PackageLesson.updateFromEvent(data);
      } catch (e) {
        error = e;
      }
      assert.ok(error);
    });
    it('should not update PackageLesson without deketedAt', async () => {
      const data = {
        packageId: 12345,
        lessonId: 12345,
      };
      try {
        await ctx.model.PackageLesson.updateFromEvent(data);
      } catch (e) {
        error = e;
      }
      assert.ok(error);
    });
    it('should not update PackageLesson with package id', async () => {
      const data = {
        lessonId: 12345,
        deletedAt: '2019-01-24',
      };
      try {
        await ctx.model.PackageLesson.updateFromEvent(data);
      } catch (e) {
        error = e;
      }
      assert.ok(error);
    });
    it('should not update PackageLesson with lesson id', async () => {
      const data = {
        packageId: 12345,
        deletedAt: '2019-01-24',
      };
      try {
        await ctx.model.PackageLesson.updateFromEvent(data);
      } catch (e) {
        error = e;
      }
      assert.ok(error);
    });
  });
});
