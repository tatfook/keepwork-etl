'use strict';

module.exports = app => {
  const { BIGINT, STRING, BOOLEAN } = app.Sequelize;
  const Model = app.model.define('test_question_facts', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    timeId: {
      type: BIGINT,
      null: false,
    },
    userId: {
      type: BIGINT,
      null: false,
    },
    packageId: {
      type: BIGINT,
      null: false,
    },
    lessonId: {
      type: BIGINT,
      null: false,
    },
    questionId: {
      type: BIGINT,
      null: false,
    },
    classroomKey: {
      type: STRING(64),
    },
    recordKey: {
      type: STRING(64),
    },
    answer: {
      type: STRING(64),
    },
    isRight: {
      type: BOOLEAN,
    },
  }, {
    underscored: false,
  });

  Model.associate = () => {
    app.model.TestQuestionFact.belongsTo(app.model.Time);
    app.model.TestQuestionFact.belongsTo(app.model.User);
    app.model.TestQuestionFact.belongsTo(app.model.Package);
    app.model.TestQuestionFact.belongsTo(app.model.Lesson);
    app.model.TestQuestionFact.belongsTo(app.model.Question);
  };

  return Model;
};
