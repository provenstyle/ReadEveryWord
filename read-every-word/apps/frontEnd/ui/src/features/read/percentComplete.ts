import { BIBLE_CHAPTER_COUNT } from '@read-every-word/domain'

/**
 * Floored, not rounded, so 100% means finished.
 *
 * Rounding would show 1188 of 1189 chapters as 100%, and a completion tracker
 * claiming a Bible is done with a chapter outstanding is the one number a reader
 * would notice was wrong.
 */
export const formatPercentComplete = (fraction: number): string =>
  `${Math.floor(fraction * 100)}%`

/**
 * For callers holding a chapter count rather than a Bible -- the left drawer, which
 * sits outside the read page's BibleProvider and so has no Bible to ask.
 */
export const percentOfBible = (chaptersRead: number): number =>
  chaptersRead / BIBLE_CHAPTER_COUNT
