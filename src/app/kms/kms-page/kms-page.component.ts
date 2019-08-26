import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { KmsService } from '../../shared/services/kms.service';
import { ContentModel } from '../../shared/models/kms/Content.model';
import { CurrentUserModel } from '../../shared/models/kms/CurrentUser.model';
import { UserProfileDataModel } from '../../shared/models/kms/UserProfileData.model';

@Component({
  selector: 'app-kms-page',
  templateUrl: './kms-page.component.html',
  styleUrls: ['./kms-page.component.scss']
})
export class KmsPageComponent implements OnInit  {
  pageData: ContentModel;
  news: ContentModel[] = [];
  pageId: any;

  constructor(private route: ActivatedRoute,
                      private kmsService: KmsService,
                      private router: Router) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params: Params) => {
        if (params.ID) {
          if (params.ID !== 'news') {
            this.kmsService.getContent(params.ID).subscribe(
              (content: ContentModel) => {
                if (content.ID !== 19) {
                  this.pageData = content;
                } else {
                  this.kmsService.getCurrentUser().subscribe(
                    (currentUser: CurrentUserModel) => {
                      this.kmsService.getUserProfileDataWithIsComplete(currentUser.Id).subscribe(
                        (dataa: UserProfileDataModel) => {
                          this.kmsService.getKMSUserRole(this.kmsService.userProfileData.ID).subscribe(
                            (data: {ID, Role: number[]}) => {
                              if (data.Role[0] === 2 || data.Role[0] === 1) {
                                this.pageData = content;
                              }
                            }
                          );
                        }
                      );
                    }
                  );
                }
              }
            );
          } else {
            this.kmsService.getNewsFromContent(1).subscribe(
              (data: ContentModel[]) => {
                this.news = data;
              }
            );
          }
        }
        this.pageId = params.ID;
      }
    );
  }

  onClickItem(page) {
    this.router.navigate(['page'], {queryParams: {ID: page}});
  }
}
