import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KmsService } from '../../shared/services/kms.service';
import { PostModel } from '../../shared/models/kms/Post.model';
import { AnswerModel } from '../../shared/models/kms/Answer.model';

@Component({
  selector: 'app-kms-questions',
  templateUrl: './kms-questions.component.html',
  styleUrls: ['./kms-questions.component.scss']
})
export class KmsQuestionsComponent implements OnInit  {
  questions: AnswerModel[] = [];
  checking = false;

  constructor(private kmsService: KmsService,
                      private router: Router) {
  }

  ngOnInit() {
    this.kmsService.getAllAnswers().subscribe(
      (data: AnswerModel[]) => {
        this.questions = data;
        for (let i = 0; i < this.questions.length; i++) {
          this.kmsService.getUserTitle(this.questions[i].User.ID).subscribe(
            (user) => {
              this.questions[i].User.Title = user.Title;
              this.checking = true;
            }
          );
        }
      }
    );
  }

  onPostClick(id: number) {
    this.router.navigate(['post/QA'], { queryParams: { ID: id }, queryParamsHandling: 'merge'});
  }
}
