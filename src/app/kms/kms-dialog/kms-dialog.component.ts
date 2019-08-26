import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-kms-dialog',
  templateUrl: './kms-dialog.component.html',
  styleUrls: ['./kms-dialog.component.scss']
})
export class KmsDialogComponent implements OnInit  {

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public passedData: any) {}

  ngOnInit() {
    console.log(this.passedData);
  }
}
