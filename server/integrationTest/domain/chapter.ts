export class Chapter {
  id: number
  number: number
  read: boolean = false

  constructor(
    id: number
  ){
    this.id = id
    this.number = id + 1
  }
}
