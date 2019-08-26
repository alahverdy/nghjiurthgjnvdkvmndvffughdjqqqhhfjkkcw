import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KmsService } from './shared/services/kms.service';
import { CurrentUserModel } from './shared/models/kms/CurrentUser.model';
import { UserProfileDataModel } from './shared/models/kms/UserProfileData.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isUserProfileValid = false;
  title = 'kms';
  currentUser: CurrentUserModel;

  constructor(private router: Router,
                      private kmsService: KmsService) {}

  ngOnInit() {
    this.kmsService.getTodayDateFromContextInfo().subscribe();
    this.isUserProfileValid = true;
    this.kmsService.getCurrentUser().subscribe(
      (currentUser: CurrentUserModel) => {
        this.currentUser = currentUser;
          this.kmsService.getUserProfileDataWithIsComplete(this.currentUser.Id).subscribe(
            (data: UserProfileDataModel) => {
              if (data) {
                if (data.IsComplete === false) {
                  this.isUserProfileValid = false;
                } else {
                  this.isUserProfileValid = true;
                }
              } else {
                this.isUserProfileValid = false;
              }
            }
          );
      }
    );
  }

  onValidEmitChange(e) {
    console.log(e);
    this.isUserProfileValid = true;
    this.router.navigate(['']);
  }

}
