'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/fact/learning.test.js', () => {
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
      const fact = await ctx.service.fact.learning.beginClass({
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
      await ctx.service.fact.learning.beginClass({
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
      const fact = await ctx.service.fact.learning.endClass({
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
        const fact = await ctx.service.fact.learning.beginLearning({
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
          await ctx.service.fact.learning.beginLearning({
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
        const fact = await ctx.service.fact.learning.endLearning({
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
          await ctx.service.fact.learning.endLearning({
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

      it('should create test question fact with quiz', async () => {
        await ctx.model.Question.createFromEvent({ lessonId: 12345, index: 1, content: 'hello' });
        await ctx.model.Question.createFromEvent({ lessonId: 12345, index: 2, content: 'world' });
        const fact = await ctx.service.fact.learning.endLearning({
          category: 'keepwork',
          action: 'end_learning',
          data: {
            recordKey: '12345',
            userId: 123,
            packageId: 12345,
            lessonId: 12345,
            endAt: '2018-12-25 00:10:00',
            quiz: [
              {
                index: 1,
                answer: 'keepwork',
                isRight: true,
                commitAt: '2018-12-27 00:10:00',
              },
              {
                index: 2,
                answer: 'keepwork',
                isRight: true,
                commitAt: '2018-12-27 00:10:00',
              },
            ],
          },
        });

        assert(fact);
        const size = await ctx.model.TestQuestionFact.count();
        assert(size === 2);
      });
    });

    describe('#quitLearning', () => {
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
        const fact = await ctx.service.fact.learning.quitLearning({
          category: 'keepwork',
          action: 'quit_learning',
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
          await ctx.service.fact.learning.quitLearning({
            category: 'keepwork',
            action: 'quit_what',
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

      it('should create test question fact with quiz', async () => {
        await ctx.model.Question.createFromEvent({ lessonId: 12345, index: 1, content: 'hello' });
        await ctx.model.Question.createFromEvent({ lessonId: 12345, index: 2, content: 'world' });
        const fact = await ctx.service.fact.learning.quitLearning({
          category: 'keepwork',
          action: 'quit_learning',
          data: {
            recordKey: '12345',
            userId: 123,
            packageId: 12345,
            lessonId: 12345,
            endAt: '2018-12-25 00:10:00',
            quiz: [
              {
                index: 1,
                answer: 'keepwork',
                isRight: true,
                commitAt: '2018-12-27 00:10:00',
              },
              {
                index: 2,
                answer: 'keepwork',
                isRight: true,
                commitAt: '2018-12-27 00:10:00',
              },
            ],
          },
        });

        assert(fact);
        const size = await ctx.model.TestQuestionFact.count();
        assert(size === 2);
      });
    });
  });

  describe('class learning', () => {
    let classroomFact;
    beforeEach(async () => {
      classroomFact = await ctx.service.fact.learning.beginClass({
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
      const fact = await ctx.service.fact.learning.beginLearning({
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
      await ctx.service.fact.learning.beginLearning({
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

      const fact = await ctx.service.fact.learning.endLearning({
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
      await ctx.service.fact.learning.beginLearning({
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

      const fact = await ctx.service.fact.learning.quitLearning({
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

  describe('#endQuiz', async () => {
    beforeEach(async () => {
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

    it('should create test question facts', async () => {
      const recordKey = '12345';
      const data = [
        {
          index: 1,
          answer: 'keepwork',
          isRight: true,
          commitAt: '2018-12-27 00:10:00',
        },
        {
          index: 2,
          answer: 'keepwork',
          isRight: true,
          commitAt: '2018-12-27 00:10:00',
        },
      ];
      const res = await ctx.service.fact.learning.endQuiz(data, recordKey);
      assert(res);
      const size = await ctx.model.TestQuestionFact.count();
      assert(size === 2);
    });

    it('should not create test question facts with invalid data', async () => {
      let res = await ctx.service.fact.learning.endQuiz();
      assert(!res);
      res = await ctx.service.fact.learning.endQuiz([]);
      assert(!res);
      res = await ctx.service.fact.learning.endQuiz('oh no', 12345);
      assert(!res);
    });
  });
});
