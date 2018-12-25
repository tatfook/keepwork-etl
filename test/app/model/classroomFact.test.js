'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/model/classroomFact.test.js', () => {
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
    it('should return classroom fact', async () => {
      const fact = await ctx.model.ClassroomFact.beginClass({
        classroomKey: '12345',
        beginAt: '2018-12-24',
        teacherId: 123,
        packageId: 12345,
        lessonId: 12345,
      });

      assert(fact.classroomKey === '12345');
      assert(fact.beginTimeId === 20181224);
    });

    it('should failed with invalid time', async () => {
      try {
        await ctx.model.ClassroomFact.beginClass({
          classroomKey: '12345',
          beginAt: '2000-12-24',
          teacherId: 123,
          packageId: 12345,
          lessonId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
      error = undefined;
      try {
        await ctx.model.ClassroomFact.beginClass({
          classroomKey: '12345',
          teacherId: 123,
          packageId: 12345,
          lessonId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should failed with invalid teacher id', async () => {
      try {
        await ctx.model.ClassroomFact.beginClass({
          classroomKey: '12345',
          beginAt: '2018-12-24',
          teacherId: 12345,
          packageId: 12345,
          lessonId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
      error = undefined;
      try {
        await ctx.model.ClassroomFact.beginClass({
          classroomKey: '12345',
          beginAt: '2018-12-24',
          packageId: 12345,
          lessonId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should failed with invalid package id', async () => {
      try {
        await ctx.model.ClassroomFact.beginClass({
          classroomKey: '12345',
          beginAt: '2018-12-24',
          teacherId: 123,
          packageId: 123456,
          lessonId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
      error = undefined;
      try {
        await ctx.model.ClassroomFact.beginClass({
          classroomKey: '12345',
          beginAt: '2018-12-24',
          teacherId: 123,
          lessonId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should failed with invalid lesson id', async () => {
      try {
        await ctx.model.ClassroomFact.beginClass({
          classroomKey: '12345',
          beginAt: '2018-12-24',
          teacherId: 123,
          packageId: 12345,
          lessonId: 123456,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
      error = undefined;
      try {
        await ctx.model.ClassroomFact.beginClass({
          classroomKey: '12345',
          beginAt: '2018-12-24',
          teacherId: 123,
          packageId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should failed with invalid classroomKey', async () => {
      try {
        await ctx.model.ClassroomFact.beginClass({
          beginAt: '2018-12-24',
          teacherId: 123,
          packageId: 12345,
          lessonId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });
  });

  describe('#updateStudentCount', async () => {
    beforeEach(async () => {
      await ctx.model.ClassroomFact.beginClass({
        classroomKey: '12345',
        beginAt: '2018-12-24',
        teacherId: 123,
        packageId: 12345,
        lessonId: 12345,
      });
    });

    it('should update student count', async () => {
      const fact = await ctx.model.ClassroomFact.updateStudentCount({
        classroomKey: '12345',
        studentCount: 10,
        packageId: 12345,
        lessonId: 12345,
      });

      assert(fact.studentCount === 10);
    });

    it('should failed with negtive count', async () => {
      try {
        await ctx.model.ClassroomFact.updateStudentCount({
          classroomKey: '12345',
          studentCount: -10,
          packageId: 12345,
          lessonId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should failed with invalid package id', async () => {
      try {
        await ctx.model.ClassroomFact.updateStudentCount({
          classroomKey: '12345',
          studentCount: 10,
          packageId: 123456,
          lessonId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
      error = undefined;
      try {
        await ctx.model.ClassroomFact.updateStudentCount({
          classroomKey: '12345',
          studentCount: 10,
          teacherId: 123,
          lessonId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should failed with invalid lesson id', async () => {
      try {
        await ctx.model.ClassroomFact.updateStudentCount({
          classroomKey: '12345',
          studentCount: 10,
          packageId: 12345,
          lessonId: 123456,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
      error = undefined;
      try {
        await ctx.model.ClassroomFact.updateStudentCount({
          classroomKey: '12345',
          studentCount: 10,
          packageId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should failed with invalid classroomKey', async () => {
      try {
        await ctx.model.ClassroomFact.updateStudentCount({
          studentCount: 10,
          packageId: 12345,
          lessonId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });
  });

  describe('#updateStudentCountWithDiff', async () => {
    beforeEach(async () => {
      await ctx.model.ClassroomFact.beginClass({
        classroomKey: '12345',
        beginAt: '2018-12-24',
        teacherId: 123,
        packageId: 12345,
        lessonId: 12345,
      });
    });

    it('should update student count with diff', async () => {
      let fact = await ctx.model.ClassroomFact.updateStudentCountWithDiff({
        classroomKey: '12345',
        diff: 10,
        packageId: 12345,
        lessonId: 12345,
      });

      assert(fact.studentCount === 10);

      fact = await ctx.model.ClassroomFact.updateStudentCountWithDiff({
        classroomKey: '12345',
        diff: -5,
        packageId: 12345,
        lessonId: 12345,
      });

      assert(fact.studentCount === 5);
    });

    it('should failed with negtive count', async () => {
      await ctx.model.ClassroomFact.updateStudentCount({
        classroomKey: '12345',
        studentCount: 10,
        packageId: 12345,
        lessonId: 12345,
      });
      try {
        await ctx.model.ClassroomFact.updateStudentCountWithDiff({
          classroomKey: '12345',
          diff: -20,
          packageId: 12345,
          lessonId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should failed with invalid package id', async () => {
      try {
        await ctx.model.ClassroomFact.updateStudentCountWithDiff({
          classroomKey: '12345',
          diff: 10,
          packageId: 123456,
          lessonId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
      error = undefined;
      try {
        await ctx.model.ClassroomFact.updateStudentCountWithDiff({
          classroomKey: '12345',
          diff: 10,
          teacherId: 123,
          lessonId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should failed with invalid lesson id', async () => {
      try {
        await ctx.model.ClassroomFact.updateStudentCountWithDiff({
          classroomKey: '12345',
          diff: 10,
          packageId: 12345,
          lessonId: 123456,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
      error = undefined;
      try {
        await ctx.model.ClassroomFact.updateStudentCountWithDiff({
          classroomKey: '12345',
          diff: 10,
          packageId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should failed with invalid classroomKey', async () => {
      try {
        await ctx.model.ClassroomFact.updateStudentCountWithDiff({
          diff: 10,
          packageId: 12345,
          lessonId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });
  });

  describe('#endClass', async () => {
    beforeEach(async () => {
      await ctx.model.ClassroomFact.beginClass({
        classroomKey: '12345',
        beginAt: '2018-12-24 00:00:00',
        teacherId: 123,
        packageId: 12345,
        lessonId: 12345,
      });
    });

    it('should end class', async () => {
      const fact = await ctx.model.ClassroomFact.endClass({
        classroomKey: '12345',
        endAt: '2018-12-24 00:30:00',
        studentCount: 10,
        packageId: 12345,
        lessonId: 12345,
      });

      assert(fact.endTimeId === 20181224);
      assert(fact.timeAmount === 30);
    });

    it('should failed with invalid end time', async () => {
      try {
        await ctx.model.ClassroomFact.endClass({
          classroomKey: '12345',
          endAt: '2150-12-24',
          teacherId: 123,
          packageId: 12345,
          lessonId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
      error = undefined;
      try {
        await ctx.model.ClassroomFact.endClass({
          classroomKey: '12345',
          teacherId: 123,
          packageId: 12345,
          lessonId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should failed with invalid package id', async () => {
      try {
        await ctx.model.ClassroomFact.endClass({
          classroomKey: '12345',
          endAt: '2018-12-24',
          studentCount: 10,
          packageId: 123456,
          lessonId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
      error = undefined;
      try {
        await ctx.model.ClassroomFact.endClass({
          classroomKey: '12345',
          endAt: '2018-12-24',
          studentCount: 10,
          teacherId: 123,
          lessonId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should failed with invalid lesson id', async () => {
      try {
        await ctx.model.ClassroomFact.endClass({
          classroomKey: '12345',
          endAt: '2018-12-24',
          studentCount: 10,
          packageId: 12345,
          lessonId: 123456,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
      error = undefined;
      try {
        await ctx.model.ClassroomFact.endClass({
          classroomKey: '12345',
          endAt: '2018-12-24',
          studentCount: 10,
          packageId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });

    it('should failed with invalid classroomKey', async () => {
      try {
        await ctx.model.ClassroomFact.endClass({
          studentCount: 10,
          endAt: '2018-12-24',
          packageId: 12345,
          lessonId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert(error);
    });
  });
});
