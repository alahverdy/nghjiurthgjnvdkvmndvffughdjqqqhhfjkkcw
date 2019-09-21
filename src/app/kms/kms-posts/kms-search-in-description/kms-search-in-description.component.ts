import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {KmsService} from '../../../shared/services/kms.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Router} from '@angular/router';
import {LessonLearnedModel} from '../../../shared/models/kms/LessonLearned.model';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-kms-search-in-description',
  templateUrl: './kms-search-in-description.component.html',
  styleUrls: ['./kms-search-in-description.component.scss']
})
export class KmsSearchInDescriptionComponent implements OnInit {
  userData = new FormControl('', [Validators.required, Validators.minLength(5)]);
  lessonLearned: LessonLearnedModel[] = [];
  lessonLearnedFiltered: LessonLearnedModel[] = [];
  public form: FormGroup;

  constructor(private kmsService: KmsService, private spinner: NgxSpinnerService,
              private router: Router, private fb: FormBuilder, public dialogRef: MatDialogRef<KmsSearchInDescriptionComponent>
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      userData: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
        ])
      ],

    });

    this.kmsService.getLessonLearnedFullDescription().subscribe(
      (lessonLearnedData) => {
        this.lessonLearned = lessonLearnedData;
        console.log(this.lessonLearned);
      }
    );
  }

  onSearch(a) {
    this.lessonLearnedFiltered = this.lessonLearned.filter(x => x.FullDescription.includes(a));
  }

  onPostClick(title: string) {
    let y;
    y = this.kmsService.posts.find(x => x.Title === title).ID;
    this.router.navigate(['post'], {queryParams: {ID: y}, queryParamsHandling: 'merge'});
    this.dialogRef.close();
  }
}
