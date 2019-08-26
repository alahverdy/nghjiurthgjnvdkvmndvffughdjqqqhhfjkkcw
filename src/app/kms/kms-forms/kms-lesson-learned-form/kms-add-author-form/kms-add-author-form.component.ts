import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-kms-add-author-form',
  templateUrl: './kms-add-author-form.component.html',
  styleUrls: ['./kms-add-author-form.component.scss']
})
export class KmsAddAuthorFormComponent implements OnInit  {
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
        Name: new FormControl('', [Validators.required]),
        LastName: new FormControl('', [Validators.required]),
      });
  }
}
