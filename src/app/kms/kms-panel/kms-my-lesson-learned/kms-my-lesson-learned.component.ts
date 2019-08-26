import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { PostModel } from '../../../shared/models/kms/Post.model';
import { KmsService } from '../../../shared/services/kms.service';
import { CurrentUserModel } from '../../../shared/models/kms/CurrentUser.model';
import { LessonLearnedDescModel } from '../../../shared/models/kms/LessonLearnedDesc.model';
import Swal from 'sweetalert2';
import { KmsContractComponent } from '../../kms-posts/kms-post/kms-contract/kms-contract.component';
import * as moment from 'jalali-moment';
import { Subject } from 'rxjs/index';
import { KmsRefereeFormComponent } from '../../kms-forms/kms-lesson-learned-form/kms-referee-form/kms-referee-form.component';
import { isUndefined } from 'util';
import { KmsUserDetailComponent } from '../kms-users-learned/kms-user-detail/kms-user-detail.component';
import { UserProfileDataModel } from '../../../shared/models/kms/UserProfileData.model';
import { MyJudgePostModel } from '../../../shared/models/kms/MyJudgePost.model';

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
  selector: 'app-kms-my-lesson-learned',
  templateUrl: './kms-my-lesson-learned.component.html',
  styleUrls: ['./kms-my-lesson-learned.component.scss']
})
export class KmsMyLessonLearnedComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @Input() currentUser: CurrentUserModel;
  @Input() selectedTabSubject;
  @Input() selectedTab;
  @Input() userRole: { ID, Role: number[] };
  displayedColumns: string[] = ['Title', 'Author', 'StatusId', 'MainScore', 'KMSContract', 'CreatedDate', 'Edit'];
  dataSource;
  table: PostModel[] = [];
  todayByMinutes;
  isJudge = false;
  userNames: {ID, Title}[];

  constructor(private route: ActivatedRoute,
              private kmsService: KmsService,
              private router: Router,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.kmsService.getAllUsersName().subscribe(
      (userNames) => {
        this.userNames = userNames;
      }
    );
    this.kmsService.getTodayDateFromContextInfo().subscribe(
      (today) => {
        this.todayByMinutes = this.kmsService.convertDateToMinutes(today);
      }
    );
    this.kmsService.selectedTabSubject.subscribe(
      (data: any) => {
        this.dataSource = null;
        this.selectedTab = data;
        this.table = [];
        this.isJudge = false;
        this.getData();
      }
    );
    this.getData();
  }

  getData() {
    if (this.selectedTab < 11 || this.selectedTab === 50 || this.selectedTab === 60) {
      if (this.selectedTab === 10) {
        this.onRefresh();
      } else {
        if (this.selectedTab === 4) {
          this.displayedColumns = ['Title', 'OperationKind', 'Author', 'Judges', 'KMSContract', 'CreatedDate', 'Edit'];
        } else {
          this.displayedColumns = ['Title', 'OperationKind', 'Author', 'MainScore', 'KMSContract', 'CreatedDate', 'Edit'];
        }
        if (this.selectedTab < 10) {
          this.onAdminLessonLearnedStatusesRefresh(this.selectedTab);
        } else {
          // this.onJudgesLessonLearnedStatusesRefresh(this.selectedTab);
        }
      }
    } else {
      this.onJudgesLessonLearnedStatusesRefresh(this.selectedTab);
    }
  }

  onPostDelete(id: number) {
    Swal({
      title: 'آیا مطمئن هستید که می خواهید حذف شود؟',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'بله، حذف شود!',
      cancelButtonText: 'خیر، حذف نشود!'
    }).then((result) => {
      if (result.value) {
        this.kmsService.getDataFromContextInfo().subscribe(
          (DigestValue) => {
            this.kmsService.deleteItem(DigestValue, 'posts', id).subscribe(
              () => {
                this.kmsService.getLessonLearnedDesc(id).subscribe(
                  (data: LessonLearnedDescModel) => {
                    this.kmsService.deleteItem(DigestValue, 'LessonLearned', data.ID).subscribe(
                      () => {
                        const kmsContract = this.table.filter(v => v.ID === id)[0].KMSContract;
                        if (kmsContract) {
                          this.kmsService.deleteItem(DigestValue, 'KMSContracts', kmsContract.ID).subscribe(
                            () => console.log('Done')
                          );
                        } else {
                          this.kmsService.getAllLessonLearnedOfMine(this.currentUser.Id).subscribe(
                            (data: PostModel[]) => {
                              this.table = data;
                              this.dataSource = new MatTableDataSource(data);
                              this.dataSource.sort = this.sort;
                            }
                          );
                          Swal(
                            'درس آموخته با موفقیت حذف گردید!',
                          );
                        }
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    });
  }

  onClickReferee(id: number) {
    const dialogRef = this.dialog.open(KmsRefereeFormComponent, {
      width: '700px',
      height: '700px',
      data: id,
    });
    dialogRef.afterClosed().subscribe(
      (result: any) => {
        if (isUndefined(result) || result === '') {
        } else {
          this.kmsService.getDataFromContextInfo().subscribe(
            (DigestValue) => {
              console.log(result);
              for (let i = 0; i < result.Judges.length; i++) {
                this.kmsService.addRefereePostAssignment(DigestValue, result, i).subscribe(
                  (data) => {
                    this.kmsService.updatePostStatus(DigestValue, id).subscribe(
                      () => {
                        Swal(
                          'درس آموخته با موفقیت ارجاع گردید!',
                        );
                        this.table.filter((v, index) => {
                          if (v.ID === id) {
                            this.table.splice(index, 1);
                          }
                        });
                        this.dataSource = new MatTableDataSource(this.table);
                        this.dataSource.sort = this.sort;
                        console.log(data, 'success');
                      }
                    );
                  }
                );
              }
            }
          );
          const contractForm = result;
          result = result.value;
          console.log(contractForm);
          if (contractForm.valid) {
          } else {
            Swal({
              title: 'اطلاعات دارای اشکال هستند!',
              type: 'warning',
              showCancelButton: false,
              confirmButtonText: 'متوجه شدم!',
            });
          }
        }
      });
  }

  roundDown(number, decimals) {
    decimals = decimals || 0;
    return ( Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals) );
  }

  onRefresh() {
    this.kmsService.getAllLessonLearnedOfMine(this.kmsService.userProfileData.ID).subscribe(
      (data: PostModel[]) => {
        this.table = data;
        for (let i = 0; i < data.length; i++) {
          const dd = this.kmsService.convertDateToMinutes(this.table[i].CreatedDateByTime);
          this.table[i].CreatedDateByTime = (+this.todayByMinutes - +dd) / 60;
        }
        this.dataSource = new MatTableDataSource(this.table);
        this.dataSource.sort = this.sort;
      }
    );
  }

  onAdminLessonLearnedStatusesRefresh(id: number) {
    this.kmsService.getAllFilteredLessonLearned(id).subscribe(
      (data: PostModel[]) => {
        this.table = data;
        if (this.selectedTab === 4) {
          this.kmsService.getAllJudgedsFromRefereePostAssignments().subscribe(
            (judges: MyJudgePostModel[]) => {
              for (let i = 0; i < this.table.length; i++) {
                this.table[i].Judges = [];
                 judges.filter(v => {
                  if (v.Post.ID === this.table[i].ID) {
                    const judgeData = this.userNames.filter(vv => vv.ID === v.User1Id)[0];
                    this.table[i].Judges.push({
                      ID: judgeData.ID,
                      Title: judgeData.Title,
                      Score: v.Score,
                    });
                  }
                });
                 this.table[i].Creator = this.userNames.filter(vc => vc.ID === this.table[i].Creator)[0];
                // this.kmsService.getUserTitle(this.table[i].Creator).subscribe(/**/
                //   (userTitle: { ID: number, Title: string }) => {
                //     this.table[i].Creator = {ID: userTitle.ID, Title: userTitle.Title};
                //   }
                // );
              }
              // console.log(this.table, 'tdtdtd');
            }
          );
        } else {
          for (let i = 0; i < this.table.length; i++) {
            this.table[i].Creator = this.userNames.filter(vc => vc.ID === this.table[i].Creator)[0];
            // this.kmsService.getUserTitle(this.table[i].Creator).subscribe(
            //   (userTitle: { ID: number, Title: string }) => {
            //     this.table[i].Creator = {ID: userTitle.ID, Title: userTitle.Title};
            //   }
            // );
          }
        }
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      }
    );
  }

  onJudgesLessonLearnedStatusesRefresh(id: number) {
    if (id === 210) {
      this.displayedColumns = ['Title', 'Author', 'KMSContract', 'CreatedDate'];
      console.log('id', id);
      this.kmsService.getAllLessonLearnedOfMyJudge(this.kmsService.userProfileData.ID, true).subscribe(
        (data: MyJudgePostModel[]) => {
          for (let i = 0; i < data.length; i++) {
            this.table.push(
              new PostModel(
                data[i].Post.ID,
                data[i].Post.Title,
                null,
                null,
                null,
                data[i].Score,
                null,
                null,
                {ID: data[i].Post.Contract, Title: data[i].Post.Contract},
                {ID: data[i].Post.Contract, Title: data[i].Post.Contract},
                data[i].Created,
                null,
                null,
                null,
                {ID: null, Title: null},
                null,
                null,
              )
            );
          }
          this.dataSource = new MatTableDataSource(this.table);
          this.dataSource.sort = this.sort;
        }
      );
    } else {
      this.displayedColumns = ['Title', 'Author', 'MainScore', 'KMSContract', 'CreatedDate'];
      this.kmsService.getAllLessonLearnedOfMyJudge(this.kmsService.userProfileData.ID, false).subscribe(
        (data: MyJudgePostModel[]) => {
          console.log('not');
          for (let i = 0; i < data.length; i++) {
            this.table.push(
              new PostModel(
                data[i].Post.ID,
                data[i].Post.Title,
                null,
                null,
                null,
                data[i].Score,
                null,
                null,
                {ID: data[i].Post.Contract, Title: data[i].Post.Contract},
                {ID: data[i].Post.Contract, Title: data[i].Post.Contract},
                data[i].Created,
                null,
                null,
                null,
                {ID: null, Title: null},
                null,
                null,
              )
            );
          }
          this.isJudge = true;
          this.dataSource = new MatTableDataSource(this.table);
          this.dataSource.sort = this.sort;
        }
      );
    }
  }

  onClickApproval(approval: boolean, id: number) {
    let status = 2;
    let confirmText = 'رد';
    if (approval) {
      status = 1;
      confirmText = 'تایید';
    }
    Swal({
      title: 'آیا مطمئن هستید ' + confirmText + ' شود؟',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'بله، ' + confirmText + ' شود!',
      cancelButtonText: 'خیر'
    }).then((result) => {
      if (result.value) {
        this.kmsService.getDataFromContextInfo().subscribe(
          (digestValue) => {
            this.kmsService.approvePost(digestValue, id, status).subscribe(
              (data) => {
                if (approval) {
                  Swal({
                    type: 'success',
                    title: 'درس آموخته با موفقیت تایید شد!',
                    confirmButtonText: 'متوجه شدم!'
                  });
                } else {
                  Swal({
                    type: 'success',
                    title: 'درس آموخته با موفقیت رد شد!',
                    confirmButtonText: 'متوجه شدم!'
                  });
                }
                this.getData();
              }
            );
          }
        );
      }
    });
  }

  onClickUser(id: number) {
    const dialogRef = this.dialog.open(KmsUserDetailComponent, {
      width: '700px',
      height: '700px',
      data: id,
    });
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onClickItem(pageName, post) {
    if (this.isJudge) {
      this.router.navigate([pageName], {queryParams: {ID: post}});
    } else {
      this.router.navigate([pageName], {queryParams: {ID: post, Judging: true}});
    }
  }

  onClickMenu(pageName) {
    this.router.navigate([pageName]);
  }

  onClickContract(contract, Title) {
    const dialogRef = this.dialog.open(KmsContractComponent, {
      width: '700px',
      height: '700px',
      data: Title,
    });
  }
}
