import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { UnitModel } from '../../../../shared/models/kms/Unit.model';
import { SubUnitModel } from '../../../../shared/models/kms/SubUnit.model';
import { RaiPartsModel } from '../../../../shared/models/kms/RaiParts.model';
import { ContractModel } from '../../../../shared/models/kms/Contract.model';
import { KmsService } from '../../../../shared/services/kms.service';

export interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-kms-add-contract-form',
  templateUrl: './kms-add-contract-form.component.html',
  styleUrls: ['./kms-add-contract-form.component.scss']
})
export class KmsAddContractFormComponent implements OnInit  {
  formGp: FormGroup;
  @ViewChild('search') search;
  @Input() AddContractShow;
  @Output() addContractShowD = new EventEmitter();
  units: UnitModel[];
  subUnits: SubUnitModel[];
  mainSubUnits: SubUnitModel[];
  raiParts: RaiPartsModel[];
  selectedContract: ContractModel;

  constructor(private kmsService: KmsService,
                      private router: Router,
                      private _formBuilder: FormBuilder,
                      private dialog: MatDialog) {
  }

  ngOnInit() {
    this.buildForm();
    this.kmsService.getAllUnits().subscribe(
      (data: UnitModel[]) => {
        this.units = data;
        this.formGp.get('Units').setValue(this.units);
      }
    );
    this.kmsService.getAllSubUnits().subscribe(
      (data: SubUnitModel[]) => {
        this.mainSubUnits = data;
        this.formGp.get('SubUnits').setValue(this.subUnits);
      }
    );
    this.kmsService.getAllRaiParts().subscribe(
      (data: RaiPartsModel[]) => {
        this.raiParts = data;
        this.formGp.get('RaiParts').setValue(this.raiParts);
      }
    );
  }

  onButtonClick() {
    this.addContractShowD.emit(false);
  }

  onSelectUnit(e) {
    const selectedUnit = e.value;
    this.subUnits = this.mainSubUnits.filter(v => {
      if (v.Unit.indexOf(selectedUnit) > -1) {
        return true;
      } else {
        return false;
      }
    });
  }

  onChangeSubUnit() {
    this.formGp.get('SubUnits').setValue(this.subUnits);
  }

  onAddContract() {
    this.selectedContract = {
      ID: 0,
      Title: this.formGp.get('Title').value,
      Unit: this.units.filter(v => +v.ID === +this.formGp.get('Unit').value)[0].Title,
      SubUnit: this.subUnits.filter(v => +v.ID === +this.formGp.get('SubUnit').value)[0].Title,
      PM: this.formGp.get('Pm').value,
      Contractor: this.formGp.get('Contractor').value,
      RaiPart: this.raiParts.filter(v => +v.ID === +this.formGp.get('RaiPart').value)[0].Title,
      StartDate: this.formGp.get('StartDate').value,
      ContractType: 1,
    };
    console.log(this.subUnits);
    this.addContractShowD.emit(this.selectedContract);
  }

  // onContractSearch(e) {
  //   const value = e.srcElement.value;
  //   if (value !== '') {
  //     this.contracts = this.defaultContracts.filter(v => v.Title.indexOf(value) >= 0);
  //   } else {
  //     this.contracts = [];
  //   }
  // }

  buildForm() {
      this.formGp = this._formBuilder.group({
        Title: new FormControl(null, [Validators.required, Validators.minLength(5)]),
        Unit: new FormControl(null, [Validators.required]),
        Units: new FormControl(null),
        SubUnit: new FormControl(null, [Validators.required]),
        SubUnits: new FormControl(null),
        Pm: new FormControl(null, [Validators.required, Validators.minLength(5)]),
        Contractor: new FormControl(null, [Validators.required, Validators.minLength(5)]),
        RaiPart: new FormControl(null, [Validators.required]),
        RaiParts: new FormControl(null),
        ContractType: new FormControl(1),
        StartDate: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      });
  }
}
