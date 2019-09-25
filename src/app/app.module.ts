import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {AppComponent} from './app.component';
import {MaterialModule} from './material.module';
import {KmsComponent} from './kms/kms.component';
import {KmsService} from './shared/services/kms.service';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {KmsHeaderComponent} from './kms/kms-header/kms-header.component';
import {KmsFooterComponent} from './kms/kms-footer/kms-footer.component';
import {KmsPageComponent} from './kms/kms-page/kms-page.component';
import {KmsPostsComponent} from './kms/kms-posts/kms-posts.component';
import {KmsPostComponent} from './kms/kms-posts/kms-post/kms-post.component';
import {KmsCommentComponent} from './kms/kms-posts/kms-post/kms-comment/kms-comment.component';
import {KmsLessonLearnedFormComponent} from './kms/kms-forms/kms-lesson-learned-form/kms-lesson-learned-form.component';
import {KmsPanelComponent} from './kms/kms-panel/kms-panel.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {KmsAddContractFormComponent} from './kms/kms-forms/kms-lesson-learned-form/kms-add-contract-form/kms-add-contract-form.component';
import {KmsContractComponent} from './kms/kms-posts/kms-post/kms-contract/kms-contract.component';
import {KmsUserFormComponent} from './kms/kms-forms/kms-user-form/kms-user-form.component';
import {KmsMyLessonLearnedComponent} from './kms/kms-panel/kms-my-lesson-learned/kms-my-lesson-learned.component';
import {KmsAddAuthorFormComponent} from './kms/kms-forms/kms-lesson-learned-form/kms-add-author-form/kms-add-author-form.component';
import {KmsDialogComponent} from './kms/kms-dialog/kms-dialog.component';
import {KmsUsersComponent} from './kms/kms-panel/kms-users-learned/kms-users.component';
import {KmsRefereeFormComponent} from './kms/kms-forms/kms-lesson-learned-form/kms-referee-form/kms-referee-form.component';
import {KmsUserDetailComponent} from './kms/kms-panel/kms-users-learned/kms-user-detail/kms-user-detail.component';
import {KmsAddCommentFormComponent} from './kms/kms-forms/kms-lesson-learned-form/kms-add-comment-form/kms-add-comment-form.component';
import {KmsAddQuestionAnswerFormComponent} from './kms/kms-forms/kms-lesson-learned-form/kms-add-question-answer-form/kms-add-question-answer-form.component';
import {KmsDashboardComponent} from './kms/kms-panel/kms-dashboard/kms-dashboard.component';
import {HighchartsChartModule} from 'highcharts-angular';
import {KmsQuestionAnswerComponent} from './kms/kms-posts/kms-question-answer/kms-question-answer.component';
import {KmsQuestionsComponent} from './kms/kms-questions/kms-questions.component';
import {KmsRelatedQuestionLessonLearnedsComponent} from './kms/kms-posts/kms-related-question-lesson-learneds/kms-related-question-lesson-learneds.component';
import {KmsJudgeFormComponent} from './kms/kms-forms/kms-lesson-learned-form/kms-judge-form/kms-judge-form.component';
import {SafeHtmlPipe} from './shared/pipes/inner-html.pipe';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgxSpinnerModule} from 'ngx-spinner';
import {KmsSearchInDescriptionComponent} from './kms/kms-posts/kms-search-in-description/kms-search-in-description.component';
import {NgKnifeModule} from 'ng-knife';
import {SpecialCharacterDirective} from './shared/specialChracter.directive';
import {ExportAsModule} from 'ngx-export-as';

@NgModule({
  declarations: [
    AppComponent,
    KmsComponent,
    KmsHeaderComponent,
    KmsFooterComponent,
    KmsPageComponent,
    KmsPostsComponent,
    KmsPostComponent,
    KmsCommentComponent,
    KmsLessonLearnedFormComponent,
    KmsAddContractFormComponent,
    KmsPanelComponent,
    KmsContractComponent,
    KmsUserFormComponent,
    KmsMyLessonLearnedComponent,
    KmsAddAuthorFormComponent,
    KmsDialogComponent,
    KmsUsersComponent,
    KmsRefereeFormComponent,
    KmsUserDetailComponent,
    KmsAddCommentFormComponent,
    KmsAddQuestionAnswerFormComponent,
    KmsDashboardComponent,
    KmsQuestionAnswerComponent,
    KmsQuestionsComponent,
    KmsRelatedQuestionLessonLearnedsComponent,
    KmsJudgeFormComponent,
    SafeHtmlPipe,
    KmsSearchInDescriptionComponent,
    SpecialCharacterDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    HighchartsChartModule,
    FlexLayoutModule,
    NgxSpinnerModule,
    NgKnifeModule,
    ExportAsModule
  ],
  providers: [KmsService],
  bootstrap: [AppComponent],
  entryComponents: [
    KmsAddContractFormComponent,
    KmsContractComponent,
    KmsAddAuthorFormComponent,
    KmsDialogComponent,
    KmsRefereeFormComponent,
    KmsUserDetailComponent,
    KmsAddCommentFormComponent,
    KmsAddQuestionAnswerFormComponent,
    KmsRelatedQuestionLessonLearnedsComponent,
    KmsJudgeFormComponent,
    KmsSearchInDescriptionComponent

  ],
})
export class AppModule {
}
