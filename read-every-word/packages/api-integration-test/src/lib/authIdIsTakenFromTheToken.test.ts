import { expectOk } from '@read-every-word/test-utils';
import { withCaller, withUser, withReadingCycle, type User } from './scenarios.js';

// authId is the table storage PartitionKey and the blob container name used for
// locking, so it decides whose data a request touches. It has to come from the
// verified token and never from the request body.
//
// This regressed once and was invisible: the auth middleware tried to overwrite
// input.authId, but middlewares only see input from parsers registered before
// them and authenticatedProcedure is built before any .input(), so the overwrite
// silently never ran. Every other test passed an authId that already matched its
// token, so nothing noticed. These tests deliberately pass a mismatched one.
describe('authId is taken from the token, not the request', () => {
  it('does not let a caller read another user reading cycles', async () => {
    const victim = await withUser();
    const attacker = await withUser();
    const victimCycle = await withReadingCycle(victim);

    const attackerCaller = await withCaller(attacker);
    const seen = expectOk(await attackerCaller.readingCycle.get({ authId: victim.authId }));

    expect(seen.map(cycle => cycle.id)).not.toContain(victimCycle.id);
  });

  it('does not let a caller write into another user partition', async () => {
    const victim = await withUser();
    const attacker = await withUser();
    const victimCycle = await withReadingCycle(victim);

    // The attacker aims a write at the victim's partition.
    const attackerCaller = await withCaller(attacker);
    expectOk(await attackerCaller.readingRecord.create({
      authId: victim.authId,
      readingCycleId: victimCycle.id,
      bookId: 0,
      chapterId: 0,
      dateRead: new Date().toISOString()
    }));

    // It landed under the attacker instead.
    const victimCaller = await withCaller(victim);
    const victimRecords = expectOk(await victimCaller.readingRecord.get({
      authId: victim.authId,
      readingCycleId: victimCycle.id
    }));
    expect(victimRecords).toHaveLength(0);
  });

  // The empty string is what the SPA sends, since the schema requires the field
  // and the client has no business choosing the value. It must be replaced
  // before it reaches storage, where it would fail as a container name.
  it('replaces an empty authId rather than passing it through', async () => {
    const user = await withUser();
    await withReadingCycle(user);

    const caller = await withCaller(user);
    const seen = expectOk(await caller.readingCycle.get({ authId: '' }));

    expect(seen.length).toBeGreaterThan(0);
  });

  it('resolves readSummary for a caller that sends no usable authId', async () => {
    const user: User = await withUser();
    const caller = await withCaller(user);

    // readSummary.get takes a blob lease keyed on authId, so an empty one used
    // to throw out of withLock as an unhandled 500.
    const summary = expectOk(await caller.readSummary.get({ authId: '' }));

    expect(summary.readingCycles.some(cycle => cycle.default)).toBe(true);
  });
});
