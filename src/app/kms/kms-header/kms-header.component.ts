import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { Router } from '@angular/router';
import { SearchListModel } from '../../shared/models/kms/SearchList.model';
import { KmsService } from '../../shared/services/kms.service';
import { UserProfileDataModel } from '../../shared/models/kms/UserProfileData.model';

@Component({
  selector: 'app-kms-header',
  templateUrl: './kms-header.component.html',
  styleUrls: ['./kms-header.component.scss']
})
export class KmsHeaderComponent implements OnInit {
  @ViewChild('search') search;
  lessonLearnedShow = false;
  qaShow = false;
  EtelaResaniShow = false;
  SeminarIntroduction = false;
  searchList: SearchListModel[] = [];
  checking = true;
  userProfileData: UserProfileDataModel;
  blur = true;

  constructor(private router: Router,
                      private kmsService: KmsService) {
  }

  ngOnInit() {
    this.kmsService.userProfileDataSubject.subscribe(
      (data: UserProfileDataModel) => this.userProfileData = data
    );
  }

  onClickItem(page) {
    this.router.navigate(['page'], {queryParams: {ID: page}});
  }

  onClickNormalPage(page) {
    this.router.navigate([page]);
  }

  onSearch(searchedValue: any) {
    const val = searchedValue;
    this.checking = false;
    searchedValue = val.srcElement.value.replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/أ/g, 'ا').toLocaleLowerCase();
    const searchedValue2 = val.srcElement.value.replace(/ی/g, 'ي').replace(/ک/g, 'ك').replace(/ا/g, 'أ').toLocaleLowerCase();
    this.kmsService.serachInPosts(searchedValue, searchedValue2).subscribe(
      (data: SearchListModel[]) => {
        this.searchList = data;
        this.checking = true;
      }
    );
  }

  onPostClick(id: number) {
    this.searchList = [];
    this.search.nativeElement.value = '';
    this.blur = true;
    this.router.navigate(['post'], { queryParams: { ID: id }, queryParamsHandling: 'merge'});
  }
}
