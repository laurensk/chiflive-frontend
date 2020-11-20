export class Message {
  id: number;
  author: string;
  body: string;
  creationDate: number;
  read: boolean;

  constructor(id: number, author: string, body: string, creationDate: number, read: boolean) {
    this.id = id;
    this.author = author;
    this.body = body;
    this.creationDate = creationDate;
    this.read = read;
  }
}
