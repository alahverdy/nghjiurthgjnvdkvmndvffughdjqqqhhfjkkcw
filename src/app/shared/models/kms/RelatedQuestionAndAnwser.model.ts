export class RelatedQuestionAndAnwserModel {
  constructor(public ID: number,
              public Post: number,
              public QuestionAndAnswer: {ID: number, Title: string},
              public Created: string) {
  }
}
