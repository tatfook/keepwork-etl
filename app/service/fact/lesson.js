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

  async beginLearning(data) {
    console.log(data);
  }

  async endLearning(data) {
    console.log(data);
  }

  async quitLearning(data) {
    console.log(data);
  }
}

module.exports = LessonService;
