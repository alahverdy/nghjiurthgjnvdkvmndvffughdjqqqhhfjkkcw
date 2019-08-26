export class MyJudgePostModel {
  constructor(public ID: number,
              public Post: {ID, Title, Created, User, Contract},
              public Score: number,
              public User1Id: string,
              public IsJudged: any,
              public Created: string) {
  }
}
