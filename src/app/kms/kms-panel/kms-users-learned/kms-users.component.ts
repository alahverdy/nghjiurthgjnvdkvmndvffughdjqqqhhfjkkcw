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
import { UserProfileDataModel } from '../../../shared/models/kms/UserProfileData.model';
import { KmsUserDetailComponent } from './kms-user-detail/kms-user-detail.component';

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
  selector: 'app-kms-users',
  templateUrl: './kms-users.component.html',
  styleUrls: ['./kms-users.component.scss']
})
export class KmsUsersComponent implements OnInit  {
  @ViewChild(MatSort) sort: MatSort;
  @Input() currentUser: CurrentUserModel;
  @Input() selectedTabSubject;
  selectedTab: number;
  displayedColumns: string[] = ['Title', 'JobTitle', 'JobLocation', 'EducationLevel', 'Position', 'BirthDate'];
  dataSource;
  table = [];

  constructor(private route: ActivatedRoute,
                      private kmsService: KmsService,
                      private router: Router,
                      private dialog: MatDialog) {
  }

  ngOnInit() {
    // this.selectedTabSubject.subscribe(
    //   (data) => {
    //     console.log(data);
    //     if (data < 11 ) {
    //       if(data === 10) {
    //         this.onRefresh();
    //       } else {
    //           this.onAdminLessonLearnedStatusesRefresh(data);
    //       }
    //     }
    //   }
    // );
      this.onAdminUsersRefresh(10);
  }

  // onPostDelete(id: number) {
  //   Swal({
  //     title: 'آیا مطمئن هستید که می خواهید حذف شود؟',
  //     type: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'بله، حذف شود!',
  //     cancelButtonText: 'خیر، حذف نشود!'
  //   }).then((result) => {
  //     if (result.value) {
  //       this.kmsService.getDataFromContextInfo().subscribe(
  //         (DigestValue) => {
  //           this.kmsService.deleteItem(DigestValue, 'posts', id).subscribe(
  //             () => {
  //               this.kmsService.getLessonLearnedDesc(id).subscribe(
  //                 (data: LessonLearnedDescModel) => {
  //                   this.kmsService.deleteItem(DigestValue, 'LessonLearned', data.ID).subscribe(
  //                     () => {
  //                       const kmsContract = this.table.filter(v => v.ID === id)[0].KMSContract;
  //                       if (kmsContract) {
  //                         this.kmsService.deleteItem(DigestValue, 'KMSContracts', kmsContract.ID).subscribe(
  //                           () => console.log('Done')
  //                         );
  //                       } else {
  //                         this.kmsService.getAllLessonLearnedOfMine(this.currentUser.Id).subscribe(
  //                           (data: PostModel[]) => {
  //                             this.table = data;
  //                             this.dataSource = new MatTableDataSource(data);
  //                             this.dataSource.sort = this.sort;
  //                           }
  //                         );
  //                         Swal(
  //                           'درس آموخته با موفقیت حذف گردید!',
  //                         );
  //                       }
  //                     }
  //                   );
  //                 }
  //               );
  //             }
  //           );
  //         }
  //       );
  //     }
  //   });
  // }

  // onRefresh() {
  //   this.kmsService.getAllLessonLearnedOfMine(this.kmsService.userProfileData.ID).subscribe(
  //     (data: PostModel[]) => {
  //       this.table = data;
  //       this.dataSource = new MatTableDataSource(data);
  //       this.dataSource.sort = this.sort;
  //     }
  //   );
  // }

  onAdminUsersRefresh(id: number) {
    this.kmsService.getAllFilteredUsers().subscribe(
      (data) => {
        this.table = data;
        // this.table[0].EducationLevel
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      }
    );
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  //
  onClickUser(id: number) {
    const dialogRef = this.dialog.open(KmsUserDetailComponent, {
      width: '700px',
      height: '730px',
      data: id,
    });
  }
  //
  // onClickMenu(pageName) {
  //   this.router.navigate([pageName]);
  }

  // onClickContract(contract, Title) {
  //   const dialogRef = this.dialog.open(KmsContractComponent, {
  //     width: '700px',
  //     height: '700px',
  //     data: Title,
  //   });
  // }
