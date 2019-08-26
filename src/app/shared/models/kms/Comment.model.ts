export class CommentModel {
  constructor(public ID: number,
              public Title: string,
              public Post: number,
              public User: {ID: number, Title: string},
              public Text: string,
              public Created: string) {
  }
}
