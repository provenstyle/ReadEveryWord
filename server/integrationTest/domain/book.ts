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
}
