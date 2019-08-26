import { NgModule } from '@angular/core';
import {
  MatButtonModule, MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatListModule,
  MatMenuModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule, MatTooltipModule
} from '@angular/material';
import {MatExpansionModule} from '@angular/material/expansion';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  declarations: [
    // KMS
    // CKEditorComponent,
    // KmsComponent,
    // KmsContentComponent,
    // KmsPostsComponent,
    // KmsPostComponent,
    // KmsCommentComponent,
    // KmsLessonLearnedFormComponent,
    // KmsAddContractFormComponent,
    // KmsPageComponent,
    // KmsPanelComponent,

  ],
  imports: [
    AppRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    // ChartModule,
    CKEditorModule,
    MatButtonModule,
    MatChipsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatButtonModule,
    MatChipsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInputModule,
    MatMenuModule,
    MatToolbarModule,
    MatTabsModule,
    MatListModule,
    MatAutocompleteModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatIconModule,
  ],
  exports: [
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    MatButtonModule,
    MatChipsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatButtonModule,
    MatChipsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInputModule,
    MatMenuModule,
    MatToolbarModule,
    MatTabsModule,
    MatListModule,
    MatAutocompleteModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    NgxMatSelectSearchModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatIconModule,
    MatExpansionModule
  ],
})
export class MaterialModule {
}
