import { Chapter } from "./chapter";

export class Book {
  chapters: Chapter[] = []

  constructor(
    public id: number,
    public longName: string,
    public shortName: string,
    public chapterCount: number
  ) {
    for (let i = 0; i < chapterCount; i++){
      this.chapters.push(new Chapter(i))
    }
  }

  get started (): boolean {
    return this.chapters.some(x => x.read)
  }

  get completed (): boolean {
    return this.chapters.every(x => x.read)
  }

  get percentComplete (): number {
    const read = this.chapters.filter(x => x.read).length
    return read/this.chapterCount
  }
}
