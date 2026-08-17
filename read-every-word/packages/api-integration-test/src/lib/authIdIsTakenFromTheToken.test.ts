import { expectOk, expectErrorMessage } from '@read-every-word/test-utils';
import { withCaller, withUser, withReadingCycle } from './scenarios.js';

// authId is the table storage PartitionKey and the blob container name used for
// locking, so it decides whose data a request touches. It has to come from the
// verified token and never from the request body.
//
// The request types no longer have an authId field, so a typed client cannot
// even express the attack - which is the point of the design. These tests
// therefore go around the types with `as any` to send what a hand written HTTP
// request could still send. That is the only remaining way in, so it is the
// only thing worth asserting here.
//
// This regressed once. The middleware tried to overwrite input.authId, but a
// middleware only sees input from parsers registered before it, and
// authenticatedProcedure is built before any .input(), so the overwrite silently
// never ran. Every other test passed an authId matching its own token and so
// could not tell.
describe('authId is taken from the token, not the request', () => {
  it('rejects a request that tries to carry an authId', async () => {
    const user = await withUser();
    const caller = await withCaller(user);

    // additionalProperties: false means an injected authId is not merely
    // ignored, it is a validation failure. Failing loudly beats failing quietly.
    const result = await (caller.readingRecord.create as any)({
      authId: 'someone-else',
      readingCycleId: 'irrelevant',
      bookId: 0,
      chapterId: 0,
      dateRead: new Date().toISOString()
    });

    expectErrorMessage(result, 'must NOT have additional properties');
  });

  it('does not let a caller read another user reading cycles', async () => {
    const victim = await withUser();
    const attacker = await withUser();
    const victimCycle = await withReadingCycle(victim);

    // The attacker authenticates as themselves and asks for the victim's
    // partition by name. readingCycle.get takes no input at all now, so this
    // extra argument is the most a caller could possibly supply.
    const attackerCaller = await withCaller(attacker);
    const seen = expectOk<{ id: string }[], unknown>(
      await (attackerCaller.readingCycle.get as any)({ authId: victim.authId })
    );

    expect(seen.map(cycle => cycle.id)).not.toContain(victimCycle.id);
  });

  it('does not let a caller write into another user partition', async () => {
    const victim = await withUser();
    const attacker = await withUser();
    const victimCycle = await withReadingCycle(victim);

    // A write aimed at the victim's cycle lands under the attacker instead,
    // because the partition key is built from the attacker's token.
    const attackerCaller = await withCaller(attacker);
    expectOk(await attackerCaller.readingRecord.create({
      readingCycleId: victimCycle.id,
      bookId: 0,
      chapterId: 0,
      dateRead: new Date().toISOString()
    }));

    const victimCaller = await withCaller(victim);
    const victimRecords = expectOk(await victimCaller.readingRecord.get({
      readingCycleId: victimCycle.id
    }));
    expect(victimRecords).toHaveLength(0);
  });

  it('resolves readSummary for a caller that supplies nothing at all', async () => {
    const user = await withUser();
    const caller = await withCaller(user);

    // readSummary.get takes a blob lease keyed on authId. An empty one used to
    // reach withLock and throw out as an unhandled 500.
    const summary = expectOk(await caller.readSummary.get());

    expect(summary.readingCycles.some(cycle => cycle.default)).toBe(true);
  });
});
