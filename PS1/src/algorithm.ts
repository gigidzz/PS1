/**
 * Problem Set 1: Flashcards - Algorithm Functions
 *
 * This file contains the implementations for the flashcard algorithm functions
 * as described in the problem set handout.
 *
 * Please DO NOT modify the signatures of the exported functions in this file,
 * or you risk failing the autograder.
 */

import { Flashcard, AnswerDifficulty, BucketMap } from "./flashcards";

/**
 * Converts a Map representation of learning buckets into an Array-of-Set representation.
 *
 * @param buckets Map where keys are bucket numbers and values are sets of Flashcards.
 * @returns Array of Sets, where element at index i is the set of flashcards in bucket i.
 *          Buckets with no cards will have empty sets in the array.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function toBucketSets(buckets: BucketMap): Array<Set<Flashcard>> {
  // TODO: Implement this function

  if (buckets.size === 0) return [];
  const maxBucket = Math.max(...buckets.keys(), 0);

  const result: Array<Set<Flashcard>> = [];
  for (let i = 0; i <= maxBucket; i++){
    result.push(new Set());
  }

  buckets.forEach((cards,bucketNum)=>{
    result[bucketNum] = new Set(cards);
  });
  return result;
}

/**
 * Finds the range of buckets that contain flashcards, as a rough measure of progress.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @returns object with minBucket and maxBucket properties representing the range,
 *          or undefined if no buckets contain cards.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function getBucketRange(
  buckets: Array<Set<Flashcard>>
): { minBucket: number; maxBucket: number } | undefined {
  let min = Infinity;
  let max = -Infinity;

  buckets.forEach((set, index) => {
    if (set.size > 0) {
      min = Math.min(min, index);
      max = Math.max(max, index);
    }
  });

  return isFinite(min) ? {minBucket: min, maxBucket: max} : undefined;
  }


/**
 * Selects cards to practice on a particular day.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @param day current day number (starting from 0).
 * @returns a Set of Flashcards that should be practiced on day `day`,
 *          according to the Modified-Leitner algorithm.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function practice(
  buckets: Array<Set<Flashcard>>,
  day: number
): Set<Flashcard> {
  // TODO: Implement this function
  const toPractice = new Set<Flashcard>();

  for (let i = 0; i < buckets.length; i++) {
    if (day % Math.pow(2, i) === 0) {
      for (const card of buckets[i]!) {
        toPractice.add(card);
      }
    }
  }

  return toPractice;
  
}

/**
 * Updates a card's bucket number after a practice trial.
 *
 * @param buckets Map representation of learning buckets.
 * @param card flashcard that was practiced.
 * @param difficulty how well the user did on the card in this practice trial.
 * @returns updated Map of learning buckets.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function update(
  buckets: BucketMap,
  card: Flashcard,
  difficulty: AnswerDifficulty
): BucketMap {
  const newBuckets: BucketMap = new Map();

  
  for (const [bucketNum, cardSet] of buckets.entries()) {
    newBuckets.set(bucketNum, new Set(cardSet));
  }

  let currentBucket = -1;

  
  for (const [bucketNum, cardSet] of newBuckets.entries()) {
    if (cardSet.has(card)) {
      currentBucket = bucketNum;
      cardSet.delete(card); 
      break;
    }
  }

  let newBucket: number;
  if (difficulty === AnswerDifficulty.Wrong) {
    newBucket = 0;
  } else if (difficulty === AnswerDifficulty.Hard) {
    newBucket = currentBucket + 1;
  } else {
    newBucket = currentBucket + 2;
  }

  if (!newBuckets.has(newBucket)) {
    newBuckets.set(newBucket, new Set());
  }

  newBuckets.get(newBucket)!.add(card);

  return newBuckets;
}

/**
 * Generates a hint for a flashcard.
 *
 * @param card flashcard to hint
 * @returns a hint string that includes:
 *    - the original `card.hint` exactly as-is,
 *    - the first non-space character of `card.back`,
 *    - and the total number of characters in `card.back` after trimming.
 *
 * @spec.requires card is a valid Flashcard such that:
 *    - card.back.trim().length > 0 (non-empty after trimming),
 *    - card.hint is a defined string (may be empty),
 *    - card.back does not contain newline characters.
 * 
 */
export function getHint(card: Flashcard): string {
  const trimmedAnswer = card.back.trim();
  const firstChar = trimmedAnswer.charAt(0);
  const length = trimmedAnswer.length;

  return `Hint: ${card.hint}. The answer starts with '${firstChar}' and has ${length} characters.`;
}



/**
 * Computes statistics about the user's learning progress.
 *
 * @param buckets Map of bucket numbers to sets of flashcards.
 * @param history Array of user practice records.
 * @returns an object containing statistics:
 *          - totalCards: total number of flashcards in all buckets
 *          - bucketCounts: array where index `i` contains number of cards in bucket `i` (0 if missing)
 *          - totalSessions: total number of times user has practiced any card
 *          - correctPercentage: proportion of practice sessions rated as Easy
 *          - averageDifficulty: average difficulty rating (0 = Wrong, 1 = Hard, 2 = Easy)
 *
 * @spec.requires buckets is a valid BucketMap with non-negative bucket numbers.
 * @spec.requires history is a list of valid practice records (each with valid Flashcard, day ≥ 0, and valid AnswerDifficulty).
 */
export function computeProgress(
  buckets: BucketMap,
  history: Array<{
    card: Flashcard;
    day: number;
    difficulty: AnswerDifficulty;
  }>
): {
  totalCards: number;
  bucketCounts: number[];
  totalSessions: number;
  correctPercentage: number;
  averageDifficulty: number;
} {
  let totalCards = 0;
  const bucketCounts: number[] = [];

  buckets.forEach((set, bucketNum) => {
    const count = set.size;
    totalCards += count;
    bucketCounts[bucketNum] = count;
  });

  const totalSessions = history.length;
  let totalDifficulty = 0;
  let easyCount = 0;

  for (const record of history) {
    totalDifficulty += record.difficulty;
    if (record.difficulty === AnswerDifficulty.Easy) easyCount++;
  }

  return {
    totalCards,
    bucketCounts,
    totalSessions,
    correctPercentage: totalSessions ? easyCount / totalSessions : 0,
    averageDifficulty: totalSessions ? totalDifficulty / totalSessions : 0,
  };
}
