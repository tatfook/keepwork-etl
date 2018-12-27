'use strict';

const Service = require('egg').Service;
const assert = require('assert');

class LessonService extends Service {
  async beginClass(event) {
    assert(event.action === 'begin_class');
    return this.ctx.model.ClassroomFact.beginClass(event.data);
  }

  async endClass(event) {
    assert(event.action === 'end_class');
    return this.ctx.model.ClassroomFact.endClass(event.data);
  }

  async beginLearning(event) {
    assert(event.action === 'begin_learning');
    if (event.data.classroomKey) {
      await this.ctx.model.ClassroomFact.updateStudentCountWithDiff({ ...event.data, diff: 1 });
    }
    return this.ctx.model.LearningFact.beginLearning(event.data);
  }

  async endLearning(event) {
    assert(event.action === 'end_learning');
    await this.service.fact.learning.endQuiz(event.data.quiz, event.data.recordKey);
    return this.ctx.model.LearningFact.endLearning(event.data);
  }

  async quitLearning(event) {
    assert(event.action === 'quit_learning');
    if (event.data.classroomKey) {
      await this.ctx.model.ClassroomFact.updateStudentCountWithDiff({ ...event.data, diff: -1 });
    }
    await this.service.fact.learning.endQuiz(event.data.quiz, event.data.recordKey);
    return this.ctx.model.LearningFact.endLearning(event.data);
  }

  async endQuiz(data, recordKey) {
    if (!data || !recordKey) return false;
    if (!Array.isArray(data)) return false;
    for (let i = 0; i < data.length; i++) {
      data[i].recordKey = recordKey;
      await this.ctx.model.TestQuestionFact.createFromEvent(data[i]);
    }
    return true;
  }
}

module.exports = LessonService;
