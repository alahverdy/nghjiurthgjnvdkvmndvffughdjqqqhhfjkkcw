export class PostModel {
  constructor(public ID: number,
              public Title: string,
              public ParentPost: string,
              public Author: string,
              public Authors: any,
              public MainScore: number,
              public PostType: string,
              public StatusId: string,
              public Contract: {ID, Title},
              public KMSContract: {ID, Title},
              public CreatedDate: string,
              public LessonLearnedTopic: {ID, Title},
              public OperationKind: {ID, Title},
              public CreatedDateByTime?: any,
              public Creator?: any,
              public RaiPart?: number,
              public Docs?: number,
              public Judges?: {ID, Title, Score}[],
              public IsJudged?: boolean) {
  }
}
