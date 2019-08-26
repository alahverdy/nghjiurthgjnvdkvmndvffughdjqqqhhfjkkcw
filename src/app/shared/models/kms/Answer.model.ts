export class AnswerModel {
  constructor(public ID: number,
              public Body: string,
              public User: {ID: number, Title: string},
              public Created: string,
              public IsBest: boolean,
              public Type: number,
              public Title: string) {
  }
}
