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
    return this.ctx.model.LearningFact.endLearning(event.data);
  }

  async quitLearning(event) {
    assert(event.action === 'quit_learning');
    if (event.data.classroomKey) {
      await this.ctx.model.ClassroomFact.updateStudentCountWithDiff({ ...event.data, diff: -1 });
    }
    return this.ctx.model.LearningFact.endLearning(event.data);
  }
}

module.exports = LessonService;
