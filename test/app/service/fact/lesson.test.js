'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/fact/lesson.test.js', () => {
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
    it('should raise error with invalid action', async () => {
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
    beforeEach(async () => {
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
    });
    it('should create classroom fact with valid action', async () => {
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
    it('should raise error with invalid action', async () => {
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

  describe('self learning', () => {
    describe('#beginLearning', () => {
      it('should create learning fact with valid data', async () => {
        const fact = await ctx.service.fact.lesson.beginLearning({
          category: 'keepwork',
          action: 'begin_learning',
          data: {
            recordKey: '12345',
            userId: 123,
            packageId: 12345,
            lessonId: 12345,
            beginAt: '2018-12-25 00:00:00',
          },
        });

        assert(fact);
      });

      it('should raise error with invalid action', async () => {
        try {
          await ctx.service.fact.lesson.beginLearning({
            category: 'keepwork',
            action: 'begin_what',
            data: {
              recordKey: '12345',
              userId: 123,
              packageId: 12345,
              lessonId: 12345,
              beginAt: '2018-12-25 00:00:00',
            },
          });
        } catch (e) {
          error = e;
        }
        assert(error);
      });
    });

    describe('#endLearning', () => {
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
        const fact = await ctx.service.fact.lesson.endLearning({
          category: 'keepwork',
          action: 'end_learning',
          data: {
            recordKey: '12345',
            userId: 123,
            packageId: 12345,
            lessonId: 12345,
            endAt: '2018-12-25 00:10:00',
          },
        });

        assert(fact);
      });

      it('should raise error with invalid action', async () => {
        try {
          await ctx.service.fact.lesson.endLearning({
            category: 'keepwork',
            action: 'end_what',
            data: {
              recordKey: '12345',
              userId: 123,
              packageId: 12345,
              lessonId: 12345,
              endAt: '2018-12-25 00:10:00',
            },
          });
        } catch (e) {
          error = e;
        }
        assert(error);
      });
    });
  });

  describe('class learning', () => {
    let classroomFact;
    beforeEach(async () => {
      classroomFact = await ctx.service.fact.lesson.beginClass({
        category: 'keepwork',
        action: 'begin_class',
        data: {
          classroomKey: '12345',
          beginAt: '2018-12-24 00:00:00',
          teacherId: 123,
          packageId: 12345,
          lessonId: 12345,
          studentCount: 0,
        },
      });
    });
    it('learning in class will increase the student size', async () => {
      const fact = await ctx.service.fact.lesson.beginLearning({
        category: 'keepwork',
        action: 'begin_learning',
        data: {
          classroomKey: '12345',
          recordKey: '12345',
          userId: 123,
          packageId: 12345,
          lessonId: 12345,
          beginAt: '2018-12-25 00:00:00',
        },
      });

      assert(fact);

      const newClassroomFact = await ctx.model.ClassroomFact.findById(classroomFact.id);
      assert(classroomFact.studentCount + 1 === newClassroomFact.studentCount);
    });

    it('end learning will not change increase the student size', async () => {
      await ctx.service.fact.lesson.beginLearning({
        category: 'keepwork',
        action: 'begin_learning',
        data: {
          classroomKey: '12345',
          recordKey: '12345',
          userId: 123,
          packageId: 12345,
          lessonId: 12345,
          beginAt: '2018-12-25 00:00:00',
        },
      });
      await classroomFact.reload();

      const fact = await ctx.service.fact.lesson.endLearning({
        category: 'keepwork',
        action: 'end_learning',
        data: {
          classroomKey: '12345',
          recordKey: '12345',
          userId: 123,
          packageId: 12345,
          lessonId: 12345,
          endAt: '2018-12-25 00:10:00',
        },
      });

      assert(fact);

      const newClassroomFact = await ctx.model.ClassroomFact.findById(classroomFact.id);
      assert(classroomFact.studentCount === newClassroomFact.studentCount);
    });

    it('quit learning will deincrease the student size', async () => {
      await ctx.service.fact.lesson.beginLearning({
        category: 'keepwork',
        action: 'begin_learning',
        data: {
          classroomKey: '12345',
          recordKey: '12345',
          userId: 123,
          packageId: 12345,
          lessonId: 12345,
          beginAt: '2018-12-25 00:00:00',
        },
      });
      await classroomFact.reload();

      const fact = await ctx.service.fact.lesson.quitLearning({
        category: 'keepwork',
        action: 'quit_learning',
        data: {
          classroomKey: '12345',
          recordKey: '12345',
          userId: 123,
          packageId: 12345,
          lessonId: 12345,
          endAt: '2018-12-25 00:10:00',
        },
      });

      assert(fact);

      const newClassroomFact = await ctx.model.ClassroomFact.findById(classroomFact.id);
      assert(classroomFact.studentCount - 1 === newClassroomFact.studentCount);
    });
  });
});
