'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/model/packageFact.test.js', () => {
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
  });

  describe('#createFromEvent', () => {
    it('should return package fact', async () => {
      const fact = await ctx.model.PackageFact.createFromEvent({
        action: 'submit_package',
        operateAt: '2018-12-24',
        userId: 123,
        packageId: 12345,
      });

      assert(fact.action === 'submit_package');
      assert(fact.timeId === 20181224);
    });
    it('should not return package fact with invalid time', async () => {
      try {
        await ctx.model.PackageFact.createFromEvent({
          action: 'submit_package',
          operateAt: '2000-12-24',
          userId: 123,
          packageId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert.ok(error);
    });
    it('should not return package fact with invalid user', async () => {
      try {
        await ctx.model.PackageFact.createFromEvent({
          action: 'submit_package',
          operateAt: '2018-12-24',
          userId: 555,
          packageId: 12345,
        });
      } catch (e) {
        error = e;
      }
      assert.ok(error);
      error = undefined;
    });
    it('should not return package fact with invalid package', async () => {
      try {
        await ctx.model.PackageFact.createFromEvent({
          action: 'submit_package',
          operateAt: '2018-12-24',
          userId: 123,
          packageId: 123,
        });
      } catch (e) {
        error = e;
      }
      assert.ok(error);
    });
  });
});
