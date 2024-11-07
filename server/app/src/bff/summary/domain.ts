export interface User {
  email: string
}

export interface ReadingCycle {
  id: string
  dateStarted: string
}

export interface ReadingRecord {
  bookId: number,
  chapterId: number
}

export interface Summary {
  user: User
  readingCycle: ReadingCycle
  readingRecords: ReadingRecord[]
}