import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KmsComponent } from './kms/kms.component';
import { KmsPageComponent } from './kms/kms-page/kms-page.component';
import { KmsPostsComponent } from './kms/kms-posts/kms-posts.component';
import { KmsPostComponent } from './kms/kms-posts/kms-post/kms-post.component';
import { KmsLessonLearnedFormComponent } from './kms/kms-forms/kms-lesson-learned-form/kms-lesson-learned-form.component';
import { KmsPanelComponent } from './kms/kms-panel/kms-panel.component';
import { KmsUserFormComponent } from './kms/kms-forms/kms-user-form/kms-user-form.component';
import { KmsDashboardComponent } from './kms/kms-panel/kms-dashboard/kms-dashboard.component';
import { KmsAddQuestionAnswerFormComponent } from './kms/kms-forms/kms-lesson-learned-form/kms-add-question-answer-form/kms-add-question-answer-form.component';
import { KmsQuestionAnswerComponent } from './kms/kms-posts/kms-question-answer/kms-question-answer.component';
import { KmsQuestionsComponent } from './kms/kms-questions/kms-questions.component';

const routes: Routes = [
  {path: '', component: KmsComponent},
  {path: 'page', component: KmsPageComponent},
  {path: 'posts', component: KmsPostsComponent},
  {path: 'post', component: KmsPostComponent},
  {path: 'post/add', component: KmsLessonLearnedFormComponent},
  {path: 'post/edit', component: KmsLessonLearnedFormComponent},
  {path: 'panel', component: KmsPanelComponent},
  {path: 'dashboard', component: KmsDashboardComponent},
  {path: 'QA', component: KmsAddQuestionAnswerFormComponent},
  {path: 'post/QA', component: KmsQuestionAnswerComponent},
  {path: 'questions', component: KmsQuestionsComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
