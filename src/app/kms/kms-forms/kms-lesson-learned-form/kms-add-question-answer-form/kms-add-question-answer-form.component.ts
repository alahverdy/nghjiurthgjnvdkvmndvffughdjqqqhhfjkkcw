import { Component, Inject, Input, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { KmsService } from '../../../../shared/services/kms.service';
import { Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { PostModel } from '../../../../shared/models/kms/Post.model';
import { ReplaySubject, Subject } from 'rxjs/index';
import { MAT_DIALOG_DATA, MatSelect } from '@angular/material';
import { takeUntil } from 'rxjs/internal/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kms-add-question-answer-form',
  templateUrl: './kms-add-question-answer-form.component.html',
  styleUrls: ['./kms-add-question-answer-form.component.scss']
})
export class KmsAddQuestionAnswerFormComponent implements OnInit, OnDestroy  {
  formGp: FormGroup;
  @Input() isQuestion: boolean;
  checking = false;
  titles = [
    'پرسش',
    'پاسخ',
  ];
  selectedTitle = '';
  public Editor = ClassicEditor;
  public model = {
    editorData: ''
  };
  posts: PostModel[] = [];
  bankMultiCtrl2 = new FormControl();
  bankMultiFilterCtrl2 = new FormControl();
  public filteredBanksMulti2: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('multiSelect') multiSelect: MatSelect;
  private _onDestroy2 = new Subject<void>();


  constructor(private _formBuilder: FormBuilder,
              private kmsService: KmsService,
              private router: Router,
              @Optional() @Inject(MAT_DIALOG_DATA) public passedData: any) {
  }

  ngOnInit() {
    this.bankMultiFilterCtrl2.valueChanges
      .pipe(takeUntil(this._onDestroy2))
      .subscribe(() => {
        this.filterBanksMulti();
      });
    this.kmsService.getAllLessonLearned().subscribe(
      (data: PostModel[]) => {
        this.posts = data;
        this.filteredBanksMulti2.next(this.posts.slice());
      }
    );
    if (this.passedData) {
      this.selectedTitle = this.titles[1];
    } else {
      this.selectedTitle = this.titles[0];
    }
      this.buildForm();
      this.checking = true;
  }

  buildForm() {
    let Title = new FormControl('', [Validators.required, Validators.minLength(5)]);
    if (this.passedData) {
      Title = new FormControl('');
    }
      this.formGp = this._formBuilder.group({
        Title: Title,
        Desc: new FormControl('', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]),
        Posts: this.bankMultiCtrl2,
      });
    this.bankMultiCtrl2.setValue(null);
  }

  ngOnDestroy() {
    this._onDestroy2.next();
    this._onDestroy2.complete();
  }

  private filterBanksMulti() {
    if (!this.posts) {
      return;
    }
    // get the search keyword
    let search = this.bankMultiFilterCtrl2.value;
    if (!search) {
      this.filteredBanksMulti2.next(this.posts.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanksMulti2.next(
      this.posts.filter(bank => bank.Title.replace(/ي/g, 'ی').replace(/ك/g, 'ک').toLowerCase().indexOf(search.replace(/ي/g, 'ی').replace(/ك/g, 'ک')) > -1)
    );
  }

  onSelectionChange() {
    // this.formGp.get('Posts').setValue(null);
  }

  onAddQuestion() {
    // this.formGp.get('Desc').setValue(this.model.editorData);
    console.log(this.formGp);
    if (this.formGp.valid) {
      this.kmsService.getDataFromContextInfo().subscribe(
        (digestValue) => {
          let postType = 2;
          if (this.passedData) {
            postType = 3;
          }
          this.kmsService.addQuestion(digestValue, this.kmsService.userProfileData.ID, this.formGp.value, postType).subscribe(
            (data: any) => {
              let counter = 0;
              for (let i = 0; i < this.formGp.get('Posts').value.length; i++) {
                this.kmsService.addQLLAssignments(digestValue, this.formGp.get('Posts').value[i], data.d.ID).subscribe(
                  (qLL) => {
                    counter++;
                    if (counter === this.formGp.get('Posts').value.length) {
                      Swal({
                        title: this.selectedTitle + ' با موفقیت ثبت گردید!',
                        type: 'success',
                      }).then((result) => {
                        if (result.value) {
                          this.router.navigate(['post/QA'], { queryParams: { ID: data.d.ID }, queryParamsHandling: 'merge'});
                        }
                      });
                    }
                  }
                );
              }
            }
          );
        }
      );
    } else {
      Swal({
        title: 'اطلاعات دارای اشکال هستند!',
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'متوجه شدم!',
      });
    }
  }
}
