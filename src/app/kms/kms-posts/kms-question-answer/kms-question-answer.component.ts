import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KmsService } from '../../../shared/services/kms.service';
import { MatDialog } from '@angular/material';
import { KmsAddQuestionAnswerFormComponent } from '../../kms-forms/kms-lesson-learned-form/kms-add-question-answer-form/kms-add-question-answer-form.component';
import { FormGroup } from '@angular/forms';
import { isUndefined } from 'util';
import Swal from 'sweetalert2';
import { AnswerModel } from '../../../shared/models/kms/Answer.model';
import { KmsRelatedQuestionLessonLearnedsComponent } from '../kms-related-question-lesson-learneds/kms-related-question-lesson-learneds.component';

@Component({
  selector: 'app-kms-question-answer',
  templateUrl: './kms-question-answer.component.html',
  styleUrls: ['./kms-question-answer.component.scss']
})
export class KmsQuestionAnswerComponent implements OnInit  {
  question: AnswerModel;
  answers: AnswerModel[] = [];
  todayFa: string;

  constructor(private route: ActivatedRoute,
                      private kmsService: KmsService,
                      private dialog: MatDialog) {
  }

  ngOnInit() {
    this.kmsService.todayFaSubject.subscribe(
      (todayFa: any) => {
        this.todayFa = todayFa;
      }
    );
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params.ID) {
          this.kmsService.getAllQuestionAndAnswers(params.ID).subscribe(
            (data: AnswerModel[]) => {
              this.answers = data.filter(v => v.Type === 3);
              this.question = data.filter(v => v.Type !== 3)[0];
              this.kmsService.getUserTitle(this.question.User.ID).subscribe(
                (user) => {
                  this.question.User.Title = user.Title;
                }
              );
              for (let i = 0; i < this.answers.length; i++) {
                this.kmsService.getUserTitle(this.answers[i].User.ID).subscribe(
                  (user) => {
                    this.answers[i].User.Title = user.Title;
                  }
                );
              }
            }
          );
        }
      }
    );
  }

  onClickRelatedLL() {
    const dialogRef = this.dialog.open(KmsRelatedQuestionLessonLearnedsComponent, {
      width: '700px',
      height: '700px',
      data: this.question.ID,
    });
  }

  onAddAnswer() {
    const dialogRef = this.dialog.open(KmsAddQuestionAnswerFormComponent, {
      width: '700px',
      height: '700px',
      data: '34',
    });
    dialogRef.afterClosed().subscribe(
      (result: FormGroup) => {
        if (isUndefined(result)) {
        } else {
          if (result.valid) {
            this.kmsService.getDataFromContextInfo().subscribe(
              (digestValue) => {
                const postType = 3;
                result.get('Posts').setValue([]);
                let todayFa = this.kmsService.todayFa;
                if (!todayFa) {
                  todayFa = this.todayFa;
                }
                this.kmsService.addQuestion(digestValue, this.kmsService.userProfileData.ID, result.value, postType, this.question.ID).subscribe(
                  (data: any) => {
                    Swal({
                      title: 'پاسخ با موفقیت ثبت گردید!',
                      type: 'success',
                    }).then((result2) => {
                      if (result2.value) {
                        this.answers.push({
                          ID: data.ID,
                          Body: result.value.Desc,
                          User: {
                            ID: this.kmsService.userProfileData.ID,
                            Title: this.kmsService.userProfileData.Title,
                        },
                          Created: todayFa,
                          IsBest: false,
                          Type: 3,
                          Title: result.value.Title
                        });
                        // this.router.navigate(['']);
                      }
                    });
                  }
                );
              }
            );
            console.log(result);
          } else {
            Swal({
              title: 'اطلاعات دارای اشکال هستند!',
              type: 'warning',
              showCancelButton: false,
              confirmButtonText: 'متوجه شدم!',
            });
          }
        }
      });
  }
}
