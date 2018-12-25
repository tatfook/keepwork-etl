'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service//fact/lesson.test.js', () => {
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

  describe('#beginClass', () => {
    it('should create classroom fact with valid action', async () => {
      const fact = await ctx.service.fact.lesson.beginClass({
        category: 'keepwork',
        action: 'begin_class',
        data: {
          classroomKey: '12345',
          beginAt: '2018-12-24',
          teacherId: 123,
          packageId: 12345,
          lessonId: 12345,
        },
      });
      assert(fact.classroomKey === '12345');
    });
    it('should not create classroom fact with invalid action', async () => {
      try {
        await ctx.service.fact.package.beginClass({
          category: 'keepwork',
          action: 'begin_what',
          data: {
            classroomKey: '12345',
            beginAt: '2018-12-24',
            teacherId: 123,
            packageId: 12345,
            lessonId: 12345,
          },
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });
  });

  describe('#endClass', () => {
    it('should create classroom fact with valid action', async () => {
      await ctx.service.fact.lesson.beginClass({
        category: 'keepwork',
        action: 'begin_class',
        data: {
          classroomKey: '12345',
          beginAt: '2018-12-24 00:00:00',
          teacherId: 123,
          packageId: 12345,
          lessonId: 12345,
        },
      });
      const fact = await ctx.service.fact.lesson.endClass({
        category: 'keepwork',
        action: 'end_class',
        data: {
          classroomKey: '12345',
          endAt: '2018-12-24 00:10:00',
          teacherId: 123,
          packageId: 12345,
          lessonId: 12345,
        },
      });
      assert(fact.endTimeId === 20181224);
    });
    it('should not create classroom fact with invalid action', async () => {
      await ctx.service.fact.lesson.beginClass({
        category: 'keepwork',
        action: 'begin_class',
        data: {
          classroomKey: '12345',
          beginAt: '2018-12-24 00:00:00',
          teacherId: 123,
          packageId: 12345,
          lessonId: 12345,
        },
      });
      try {
        await ctx.service.fact.package.endClass({
          category: 'keepwork',
          action: 'end_what',
          data: {
            classroomKey: '12345',
            endAt: '2018-12-24 00:00:10',
            teacherId: 123,
            packageId: 12345,
            lessonId: 12345,
          },
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });
  });
});
