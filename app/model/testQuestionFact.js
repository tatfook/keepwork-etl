'use strict';

const _ = require('lodash');

module.exports = app => {
  const { BIGINT, STRING, BOOLEAN, DATE } = app.Sequelize;
  const Model = app.model.define('test_question_facts', {
    id: {
      type: BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    timeId: {
      type: BIGINT,
      allowNull: false,
    },
    userId: {
      type: BIGINT,
      allowNull: false,
    },
    packageId: {
      type: BIGINT,
      allowNull: false,
    },
    lessonId: {
      type: BIGINT,
      allowNull: false,
    },
    questionId: {
      type: BIGINT,
      allowNull: false,
    },
    classroomKey: {
      type: STRING(64),
    },
    recordKey: {
      type: STRING(64),
      allowNull: false,
    },
    answer: {
      type: STRING(64),
    },
    isRight: {
      type: BOOLEAN,
    },
    createdAt: {
      type: DATE,
    },
    updatedAt: {
      type: DATE,
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

  Model.createFromEvent = async data => {
    if (!data.recordKey || !data.index) throw new Error('Invalid Event Data');
    const params = _.pick(data, [ 'recordKey', 'answer', 'isRight' ]);
    const learningFact = await app.model.LearningFact.findOne({ where: { recordKey: data.recordKey } });
    _.merge(params, _.pick(learningFact, [ 'userId', 'packageId', 'lessonId', 'classroomKey' ]));
    const questionInstance = await app.model.Question.findOne({
      where: { lessonId: learningFact.lessonId, index: data.index },
      order: [[ 'id', 'DESC' ]],
    });
    params.questionId = questionInstance.id;
    const timeInstance = await app.model.Time.getTimeByString(data.commitAt);
    params.timeId = timeInstance.id;
    return app.model.TestQuestionFact.create(params);
  };

  return Model;
};
