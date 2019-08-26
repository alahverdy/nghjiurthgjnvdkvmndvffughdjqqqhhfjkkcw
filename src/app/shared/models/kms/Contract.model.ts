export class ContractModel {
  constructor(public ID: number,
              public Title: string,
              public Unit: any,
              public SubUnit: any,
              public PM: string,
              public StartDate: string,
              public Contractor: any,
              public RaiPart: any,
              public ContractType?: number) {
  }
}
