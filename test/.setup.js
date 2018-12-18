'use strict';

const { app } = require('egg-mock/bootstrap');
const factories = require('./factories');

before(() => factories(app));

afterEach(async () => {
  // clear database after each test case
  await Promise.all([
    // define your own model.destroy here
    app.model.User.destroy({ truncate: true, force: true }),
    app.model.LessonUser.destroy({ truncate: true, force: true }),
    app.model.Package.destroy({ truncate: true, force: true }),
    app.model.Lesson.destroy({ truncate: true, force: true }),
    app.model.Question.destroy({ truncate: true, force: true }),
  ]);
});
