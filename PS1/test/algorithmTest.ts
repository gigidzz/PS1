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
  it("moves a card to bucket 0 on Wrong", () => {
    const card = new Flashcard("Q", "A", "hint", []);
    const buckets: BucketMap = new Map([[1, new Set([card])]]);
    const updated = update(buckets, card, AnswerDifficulty.Wrong);

    expect(updated.get(0)!.has(card)).to.be.true;
    expect(updated.get(1)?.has(card)).to.be.false;
  });
  it("moves a card forward by 1 bucket on Hard", () => {
    const card = new Flashcard("Q", "A", "hint", []);
    const buckets: BucketMap = new Map([[1, new Set([card])]]);
    const updated = update(buckets, card, AnswerDifficulty.Hard);

    expect(updated.get(2)!.has(card)).to.be.true;
    expect(updated.get(1)?.has(card)).to.be.false;
  });
  it("adds card to new bucket if it doesn't exist yet", () => {
    const card = new Flashcard("Q", "A", "hint", []);
    const buckets: BucketMap = new Map([[0, new Set([card])]]);
    const updated = update(buckets, card, AnswerDifficulty.Easy);

    expect(updated.has(2)).to.be.true;
    expect(updated.get(2)!.has(card)).to.be.true;
  });
  it("handles card already in bucket 0 and answered Wrong", () => {
    const card = new Flashcard("Q", "A", "hint", []);
    const buckets: BucketMap = new Map([[0, new Set([card])]]);
    const updated = update(buckets, card, AnswerDifficulty.Wrong);

    expect(updated.get(0)!.has(card)).to.be.true;
  });
});

/*
 * Testing strategy for getHint():
 *
 * TODO: Describe your testing strategy for getHint() here.
 */
describe("getHint()", () => {
  it("includes original hint and reveals first character and length", () => {
    const card = new Flashcard("What is the first Greek letter?", "Alpha", "basic Greek letter", []);
    const hint = getHint(card);
    expect(hint).to.equal("Hint: basic Greek letter. The answer starts with 'A' and has 5 characters.");
  });
  it("works with single-character answers", () => {
    const card = new Flashcard("What is the first letter?", "A", "first alphabet letter", []);
    const hint = getHint(card);
    expect(hint).to.equal("Hint: first alphabet letter. The answer starts with 'A' and has 1 characters.");
  });
  it("handles multi-word answers", () => {
    const card = new Flashcard("What city never sleeps?", "New York", "city that never sleeps", []);
    const hint = getHint(card);
    expect(hint).to.equal("Hint: city that never sleeps. The answer starts with 'N' and has 8 characters.");
  });
  it("works when the original hint is empty", () => {
    const card = new Flashcard("Q", "Answer", "", []);
    const hint = getHint(card);
    expect(hint).to.equal("Hint: . The answer starts with 'A' and has 6 characters.");
  });
  it("ignores whitespace around the back text", () => {
    const card = new Flashcard("Q", "   Zebra  ", "animal", []);
    const hint = getHint(card);
    expect(hint).to.equal("Hint: animal. The answer starts with 'Z' and has 5 characters.");
  });
});

/*
 * Testing strategy for computeProgress():
 *
 * TODO: Describe your testing strategy for computeProgress() here.
 */
describe("computeProgress()", () => {
  it("returns 0s for empty buckets and history", () => {
    const result = computeProgress(new Map(), []);
    expect(result.totalCards).to.equal(0);
    expect(result.bucketCounts).to.deep.equal([]);
    expect(result.totalSessions).to.equal(0);
    expect(result.correctPercentage).to.equal(0);
    expect(result.averageDifficulty).to.equal(0);
  });

  it("handles missing buckets with sparse keys", () => {
    const card1 = new Flashcard("Q1", "A1", "hint", []);
    const buckets = new Map<number, Set<Flashcard>>([[3, new Set([card1])]]);
    const result = computeProgress(buckets, []);

    expect(result.totalCards).to.equal(1);
    expect(result.bucketCounts).to.deep.equal([undefined, undefined, undefined, 1]);
  });
});
