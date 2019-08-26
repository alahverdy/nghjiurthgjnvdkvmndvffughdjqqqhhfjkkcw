import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { KmsService } from '../../../../shared/services/kms.service';
import { KmsUserModel } from '../../../../shared/models/kms/KmsUser.model';
import { MAT_DIALOG_DATA } from '@angular/material';
import { PostModel } from '../../../../shared/models/kms/Post.model';
import { CriteriasModel } from '../../../../shared/models/kms/Criterias.model';
import { Router } from '@angular/router';
import { MyJudgePostModel } from '../../../../shared/models/kms/MyJudgePost.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kms-judge-form',
  templateUrl: './kms-judge-form.component.html',
  styleUrls: ['./kms-judge-form.component.scss']
})
export class KmsJudgeFormComponent implements OnInit  {
  formGp: FormGroup;
  @Input() post: PostModel;
  @Input() user: number;
  @Input() myJudge: MyJudgePostModel;
  checking = false;
  judges: KmsUserModel[] = [];
  criterias: CriteriasModel[] = [];
  scores = [0, 1, 2, 3, 4, 5];
  formArr = [];

  constructor(private _formBuilder: FormBuilder,
                      private kmsService: KmsService,
                      private router: Router) {
  }

  ngOnInit() {
    this.buildForm();
    this.kmsService.getAllCriterias().subscribe(
      (data) => {
        this.criterias = data;
        for (let i = 0; i < this.criterias.length; i++) {
          this.formArr.push(i);
          const control = new FormControl(null, [Validators.required]);
          (<FormArray>this.formGp.get('Criterias')).push(control);
        }
      }
    );
    this.checking = true;
  }

  onSubmit() {
    this.formGp.get('Score').setValue(this.getSum());
    if (this.formGp.get('Score').value === 0) {
      console.log('Reject');
    } else {
      console.log('Accept');
    }
    if (this.formGp.valid) {
      Swal({
        title: 'آیا مطمئن هستید که می خواهید امتیاز ثبت نهایی شود؟',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'بله، ثبت نهایی شود!',
        cancelButtonText: 'خیر، ثبت نهایی نشود!'
      }).then((result) => {
        if (result.value) {
          this.kmsService.getDataFromContextInfo().subscribe(
            (digestValue) => {
              let scoreSentCounter = 0;
              for (let i = 0; i < this.formGp.get('Criterias').value.length; i++) {
                this.kmsService.sendJudgeScore(digestValue, this.myJudge.ID, this.criterias[i].ID, this.formGp.get('Criterias').value[i]).subscribe(
                  (judgeScore) => {
                    scoreSentCounter++;
                    console.log(judgeScore, 'DOne');
                    if (scoreSentCounter === this.formGp.get('Criterias').value.length) {
                      this.kmsService.updateRefereePostAssignments(digestValue, this.formGp.value, this.myJudge.ID).subscribe(
                        () => {
                          this.router.navigate(['panel']);
                        }, error2 => {
                          Swal({
                            title: ' خطایی رخ داده است Error: 202!',
                            type: 'warning',
                            showCancelButton: false,
                            confirmButtonText: 'متوجه شدم!',
                          });
                        }
                      );
                    }
                  },
                  error => {
                    Swal({
                      title: ' خطایی رخ داده است Error: 203!',
                      type: 'warning',
                      showCancelButton: false,
                      confirmButtonText: 'متوجه شدم!',
                    });
                  }
                );
              }
            }
          );
        }
      });
    }
    console.log(this.formGp.value);
  }

  buildForm() {
      this.formGp = this._formBuilder.group({
        Post: new FormControl(this.post.ID, [Validators.required]),
        User: new FormControl(this.user, [Validators.required]),
        Criterias: new FormArray([], [Validators.required]),
        Score: new FormControl(null, [Validators.required]),
        Desc: new FormControl(null)
      });
  }

  getSum() {
    let sum = 0;
    for (let i = 0; i < this.formGp.get('Criterias').value.length; i++) {
      sum = sum + (this.formGp.get('Criterias').value[i] * this.criterias[i].ScoreWeight);
    }
    return sum / 100;
  }
}
