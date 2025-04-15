import assert from "assert";
import { AnswerDifficulty, Flashcard, BucketMap } from "../src/flashcards";
import {
  toBucketSets,
  getBucketRange,
  practice,
  update,
  getHint,
  computeProgress,
} from "../src/algorithm";
import { expect } from "chai";

/*
 * Testing strategy for toBucketSets():
 *
 * TODO: Describe your testing strategy for toBucketSets() here.
 */
describe("toBucketSets()", () => {
  it("returns an empty array for an empty BucketMap", () => {
    const map: BucketMap = new Map();
    const result = toBucketSets(map);
    expect(result).to.deep.equal([]);
  });
  it("returns correct array with one bucket", () => {
    const card = new Flashcard("Q", "A", "hint", []);
    const map: BucketMap = new Map([[0, new Set([card])]]);
    const result = toBucketSets(map);
    expect(result.length).to.equal(1);
    expect(result[0]!.has(card)).to.be.true;
  });

});

/*
 * Testing strategy for getBucketRange():
 *
 * TODO: Describe your testing strategy for getBucketRange() here.
 */
describe("getBucketRange()", () => {
  it("returns undefined when all buckets are empty", () => {
    const result = getBucketRange([]);
    expect(result).to.be.undefined;
  });
  it("returns correct range when only one bucket has cards", () => {
    const card = new Flashcard("Q", "A", "hint", []);
    const result = getBucketRange([new Set(), new Set([card]), new Set()]);
    expect(result).to.deep.equal({ minBucket: 1, maxBucket: 1 });
  });
  it("returns correct range with non-consecutive filled buckets", () => {
    const card1 = new Flashcard("Q1", "A1", "hint", []);
    const card2 = new Flashcard("Q2", "A2", "hint", []);
    const card3 = new Flashcard("Q3", "A3", "hint", []);
    const buckets: Array<Set<Flashcard>> = [
      new Set([card1]),        // 0
      new Set(),               // 1
      new Set([card2]),        // 2
      new Set(),               // 3
      new Set([card3]),        // 4
    ];
    const result = getBucketRange(buckets);
    expect(result).to.deep.equal({ minBucket: 0, maxBucket: 4 });
  });
});




/*
 * Testing strategy for practice():
 *
 * TODO: Describe your testing strategy for practice() here.
 */
describe("practice()", () => {
  it("returns an empty set for empty buckets", () => {
    expect(practice([], 0).size).to.equal(0);
  });
  it("returns only bucket 0 cards on odd days", () => {
    const c0 = new Flashcard("Q0", "A0", "hint", []);
    const c1 = new Flashcard("Q1", "A1", "hint", []);
    const buckets = [
      new Set([c0]),
      new Set([c1]),
    ];

    const result = practice(buckets, 1);
    expect(result.has(c0)).to.be.true;
    expect(result.has(c1)).to.be.false;
    expect(result.size).to.equal(1);
  });
  it("includes cards from all buckets on day 0", () => {
    const c0 = new Flashcard("Q0", "A0", "hint", []);
    const c1 = new Flashcard("Q1", "A1", "hint", []);
    const c2 = new Flashcard("Q2", "A2", "hint", []);
    const buckets = [
      new Set([c0]),
      new Set([c1]),
      new Set([c2])
    ];

    const result = practice(buckets, 0);
    expect(result.has(c0)).to.be.true;
    expect(result.has(c1)).to.be.true;
    expect(result.has(c2)).to.be.true;
    expect(result.size).to.equal(3);
  });
});

/*
 * Testing strategy for update():
 *
 * TODO: Describe your testing strategy for update() here.
 */
describe("update()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for getHint():
 *
 * TODO: Describe your testing strategy for getHint() here.
 */
describe("getHint()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});

/*
 * Testing strategy for computeProgress():
 *
 * TODO: Describe your testing strategy for computeProgress() here.
 */
describe("computeProgress()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});
