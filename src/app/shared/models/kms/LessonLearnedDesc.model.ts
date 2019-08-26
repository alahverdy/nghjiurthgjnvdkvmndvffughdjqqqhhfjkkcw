export class LessonLearnedDescModel {
  constructor(public ID: number,
              public Post: number,
              public Body: string,
              public Story: string,
              public ProposedSolution: number,
              public FullDescription: string,
              public LessonLearnedStep: {ID, Title}) {
  }
}
