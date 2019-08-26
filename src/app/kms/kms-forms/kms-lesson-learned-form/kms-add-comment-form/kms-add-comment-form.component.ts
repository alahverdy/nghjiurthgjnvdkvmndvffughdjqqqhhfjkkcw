import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-kms-add-comment-form',
  templateUrl: './kms-add-comment-form.component.html',
  styleUrls: ['./kms-add-comment-form.component.scss']
})
export class KmsAddCommentFormComponent implements OnInit  {
  formGp: FormGroup;
  checking = false;

  constructor(private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
      this.buildForm();
      this.checking = true;
  }

  buildForm() {
      this.formGp = this._formBuilder.group({
        Title: new FormControl('', [Validators.required, Validators.minLength(5)]),
        Desc: new FormControl('', [Validators.required, Validators.minLength(5)]),
      });
  }
}
