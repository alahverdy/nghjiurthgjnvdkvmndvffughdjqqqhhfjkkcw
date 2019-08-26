import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSort, MatTableDataSource } from '@angular/material';
import { KmsService } from '../../shared/services/kms.service';
import { CurrentUserModel } from '../../shared/models/kms/CurrentUser.model';
import { PostModel } from '../../shared/models/kms/Post.model';
import { ContentModel } from '../../shared/models/kms/Content.model';
import { LessonLearnedDescModel } from '../../shared/models/kms/LessonLearnedDesc.model';
import { Subject } from 'rxjs/index';
import { UserProfileDataModel } from '../../shared/models/kms/UserProfileData.model';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-kms-panel',
  templateUrl: './kms-panel.component.html',
  styleUrls: ['./kms-panel.component.scss']
})
export class KmsPanelComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['Title', 'Author', 'StatusId', 'MainScore', 'KMSContract', 'CreatedDate', 'Edit'];
  dataSource;
  table: PostModel[] = [];
  currentUser: CurrentUserModel;
  selectedTab;
  selectedTabSubject = new Subject();
  userRole: { ID, Role: number[] } = null;
  menu = [{
    ID: 10,
    Title: 'لیست درس آموخته های من'
  }, {
    ID: 20,
    Title: 'پروفایل کاربری'
  }];
  //
  // adminMenuUsers = [
  //   {
  //     ID: 30,
  //     Title: 'ادمین ها'
  //   }, {
  //     ID: 40,
  //     Title: 'داوران'
  //   }, {
  //     ID: 45,
  //     Title: 'کاربران'
  //   }
  // ];

  adminMenuUsers = [{
    ID: 45,
    Title: 'کاربران'
  }];

  adminMenuDashboard = [{
    ID: 1000,
    Title: 'داشبورد'
  }];

  adminMenuStatuses = [{
    ID: 3,
    Title: 'در حال بررسی'
  }, {
    ID: 1,
    Title: 'تایید شده'
  }, {
    ID: 2,
    Title: 'رد شده'
  }, {
    ID: 4,
    Title: 'در حال داوری'
  }, {
    ID: 5,
    Title: 'داوری شده'
  }
  ];

  judgesMenu = [
    {
      ID: 210,
      Title: 'منتظر داوری'
    }, {
      ID: 220,
      Title: 'داوری شده'
    }
  ];

  constructor(private route: ActivatedRoute,
              private kmsService: KmsService,
              private router: Router) {
  }

  ngOnInit() {
    // this.selectedTabSubject.subscribe(
    //   (data: any) => {
    //     this.selectedTab = data;
    //   }
    // );
    this.kmsService.getCurrentUser().subscribe(
      (currentUser: CurrentUserModel) => {
        this.currentUser = currentUser;
        this.kmsService.getUserProfileDataWithIsComplete(this.currentUser.Id).subscribe(
          (data: UserProfileDataModel) => {
            this.currentUser = currentUser;
            this.kmsService.getKMSUserRole(this.kmsService.userProfileData.ID).subscribe(
              (data2: { ID, Role: number[] }) => {
                if (!data2) {
                  this.onClickTab(10);
                } else {
                  this.userRole = data2;
                  if (this.userRole.Role[0] === 2) {
                    this.onClickTab(210);
                  } else {
                    this.onClickTab(10);
                  }
                }
              }
            );
          }
        );
      }
    );
    // this.kmsService.userProfileDataSubject.subscribe(
    //   (userProfileData) => {
    //
    //   }
    // );
  }

  onClickTab(id: number) {
    this.selectedTab = id;
    this.kmsService.selectedTabSubject.next(id);
  }

  // onPostDelete(id: number) {
  //   this.kmsService.getDataFromContextInfo().subscribe(
  //     (DigestValue) => {
  //       this.kmsService.deleteItem(DigestValue, 'posts', id).subscribe(
  //         () => {
  //           this.kmsService.getLessonLearnedDesc(id).subscribe(
  //             (data: LessonLearnedDescModel) => {
  //               this.kmsService.deleteItem(DigestValue, 'LessonLearned', data.ID).subscribe(
  //                 () => {
  //                   const kmsContract = this.table.filter(v => v.ID === id)[0].KMSContract;
  //                   if (kmsContract) {
  //                     this.kmsService.deleteItem(DigestValue, 'KMSContracts', kmsContract.ID).subscribe(
  //                       () => console.log('Done')
  //                     );
  //                   } else {
  //                     console.log('Done');
  //                   }
  //                 }
  //               );
  //             }
  //           );
  //         }
  //       );
  //     }
  //   );
  //   // this.kmsService
  // }

  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  onClickItem(pageName, post) {
    this.router.navigate([pageName], {queryParams: {ID: post}});
  }

  onClickMenu(pageName) {
    this.router.navigate([pageName]);
  }
}
