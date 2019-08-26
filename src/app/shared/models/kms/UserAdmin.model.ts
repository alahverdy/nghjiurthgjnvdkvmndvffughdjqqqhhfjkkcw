export class UserAdminModel {
  constructor(public ID: number,
              public Title: string,
              public JobTitle: string,
              public BirthDate: string,
              public IsComplete: boolean,
              public Position: {ID, Title},
              public RaiPart: {ID, Title},
              public Contractor: {ID, Title},
              public EducationLevel: {ID, Title}
              ) {
  }
}
