import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { KmsService } from '../../../../shared/services/kms.service';
import { KmsUserModel } from '../../../../shared/models/kms/KmsUser.model';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-kms-referee-form',
  templateUrl: './kms-referee-form.component.html',
  styleUrls: ['./kms-referee-form.component.scss']
})
export class KmsRefereeFormComponent implements OnInit  {
  formGp: FormGroup;
  checking = false;
  judges: KmsUserModel[] = [];

  constructor(private _formBuilder: FormBuilder,
                      private kmsService: KmsService,
                      @Optional() @Inject(MAT_DIALOG_DATA) public passedData: any) {
  }

  ngOnInit() {
    this.buildForm();
      this.kmsService.getAllUsersName().subscribe(
        (data: {ID, Title}[]) => {
          this.kmsService.getAllJudges(2).subscribe(
            (judges: KmsUserModel[]) => {
              this.judges = judges;
              for (let i = 0; i < this.judges.length; i++) {
                this.judges[i].User = data.filter(v => +v.ID === +this.judges[i].User.ID)[0];
              }
              console.log(this.judges);
            }
          );
        }
      );
      this.checking = true;
  }

  buildForm() {
      this.formGp = this._formBuilder.group({
        Post: new FormControl(this.passedData, [Validators.required]),
        Judges: new FormControl(null, [Validators.required]),
      });
  }
}
