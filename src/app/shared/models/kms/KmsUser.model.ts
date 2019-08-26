export class KmsUserModel {
  constructor(public ID: number,
              public User: {ID, Title},
              public Role?: string,
              ) {
  }
}
