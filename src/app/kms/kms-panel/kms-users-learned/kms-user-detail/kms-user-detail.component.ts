import { Component, Inject, OnInit, Optional } from '@angular/core';
import { KmsService } from '../../../../shared/services/kms.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { UserProfileDataModel } from '../../../../shared/models/kms/UserProfileData.model';

@Component({
  selector: 'app-kms-user-detail',
  templateUrl: './kms-user-detail.component.html',
  styleUrls: ['./kms-user-detail.component.scss']
})
export class KmsUserDetailComponent implements OnInit {
  userProfile: UserProfileDataModel;

  constructor(private kmsService: KmsService,
              @Optional() @Inject(MAT_DIALOG_DATA) public passedData: any) {
  }

  ngOnInit() {
    console.log(this.passedData);
    this.kmsService.getUserProfileDataById(this.passedData).subscribe(
      (data: UserProfileDataModel) => {
        this.userProfile = data;
      }
    );
  }
}
