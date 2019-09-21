export class LessonLearnedModel {
  constructor(public ID: number,
              public Post: { Title },
              public FullDescription: string,
              public LessonLearnedStep: { ID, Title }) {
  }
}
