import { Component, Inject, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { KmsService } from '../../../shared/services/kms.service';
import { RelatedQuestionAndAnwserModel } from '../../../shared/models/kms/RelatedQuestionAndAnwser.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-kms-related-question-lesson-learneds',
  templateUrl: './kms-related-question-lesson-learneds.component.html',
  styleUrls: ['./kms-related-question-lesson-learneds.component.scss']
})
export class KmsRelatedQuestionLessonLearnedsComponent implements OnInit  {
  posts: RelatedQuestionAndAnwserModel[] = [];

  constructor(private kmsService: KmsService,
                      private router: Router,
                     @Optional() @Inject(MAT_DIALOG_DATA) public passedData: any,
                      private dialogRef: MatDialogRef<KmsRelatedQuestionLessonLearnedsComponent>) {
  }

  ngOnInit() {
    this.kmsService.getRelatedQuestionAndLessonLearnedByQ(this.passedData).subscribe(
      (questionAndAnwsers: RelatedQuestionAndAnwserModel[]) => {
        this.posts = questionAndAnwsers;
        console.log(this.posts);
      }
    );
    // this.kmsService.getAllLessonLearned().subscribe(
    //   (data: PostModel[]) => {
    //     this.posts = data;
    //     this.checking = true;
    //   }
    // );
  }

  onPostClick(id: number) {
    this.router.navigate(['post'], { queryParams: { ID: id }, queryParamsHandling: 'merge'});
    this.dialogRef.close();
  }
}
