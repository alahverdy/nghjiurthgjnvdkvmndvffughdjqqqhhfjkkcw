import {Component, OnInit} from '@angular/core';
import {KmsService} from '../shared/services/kms.service';
import {ContentModel} from '../shared/models/kms/Content.model';
import {Router} from '@angular/router';
import {KmsDialogComponent} from './kms-dialog/kms-dialog.component';
import {MatDialog} from '@angular/material';
import {NgxSpinnerService} from 'ngx-spinner';
import {UserProfileDataModel} from '../shared/models/kms/UserProfileData.model';
import {CommentModel} from '../shared/models/kms/Comment.model';
import {PostLikesModel} from '../shared/models/kms/PostLikes.model';
import {PostModel} from '../shared/models/kms/Post.model';

export class Test {
  name: number;
  count: number;
}

@Component({
  selector: 'app-kms',
  templateUrl: './kms.component.html',
  styleUrls: ['./kms.component.scss']
})
export class KmsComponent implements OnInit {
  contents: ContentModel[] = [];
  news: ContentModel[];
  seminarReport: ContentModel[];
  seminarsIntroduction: ContentModel[];
  nahveEraeTajrobeat: ContentModel[];
  jamAvariDarsAmokhte: ContentModel[];
  mehvarhayeDarsAmokhte: ContentModel[];
  moshahedeDarsAmokhteHayeGozashte: ContentModel[];
  DarsAmokhte: ContentModel[];
  KetabcheDarsAmokhte: ContentModel[];
  elanHa: ContentModel[];
  bargozarkonandeha: ContentModel[];
  box1: ContentModel[];
  box2: ContentModel[];
  box3: ContentModel[];
  box4: ContentModel[];
  box5: ContentModel[];
  postLikes: PostLikesModel[] = [];
  posts: PostModel[] = [];
  topLessonLearneds: { ID, Title, Created }[] = [];
  topLessonLearnedsScores: { ID, Title, Score }[] = [];
  topLessonLearnedsLikes: { ID, PostId }[] = [];
  topLessonLearnedsLikes2 = [];
  topLessonLearnedsLikesWithFilter: { Title }[] = [];
  displayedColumns: string[] = ['Title', 'Created'];
  displayedColumns2: string[] = ['Title', 'Like'];
  dataSource = [];
  dataSourceForBestScores = [];
  dataSourceForLikes = [];
  showPopular = false;
  test1: Test[] = new Array<Test>();
  oop = 1;
  condition = false;

  constructor(private KmsService: KmsService,
              private router: Router,
              private dialog: MatDialog, private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.spinner.show();

    this.KmsService.getAllPostLikes().subscribe(
      (data: { ID, PostId }[]) => {
        this.topLessonLearnedsLikes = data;
        console.log(this.topLessonLearnedsLikes);
        for (let i = 0; this.topLessonLearnedsLikes.length > i; i++) {
          this.topLessonLearnedsLikes2.push(this.topLessonLearnedsLikes[i].PostId);
        }
        console.log(this.topLessonLearnedsLikes2);
        let sorted_arr = this.topLessonLearnedsLikes2.slice().sort();
        console.log(sorted_arr);
        for (let i = 0; i < sorted_arr.length - 1; i++) {
          if (sorted_arr[i + 1] === sorted_arr[i]) {
            this.oop++;
          } else {
            this.test1.push({
              name: sorted_arr[i],
              count: this.oop
            });
            this.oop = 1;
          }
        }
        this.test1.sort(function (a, b) {
          return b.count - a.count;
        });

        const topLikes = [];
        topLikes.push(this.test1[0].name, this.test1[1].name, this.test1[2].name);


        for (let i = 0; topLikes.length > i; i++) {
          this.KmsService.getTopLessonLearnedsLikes(topLikes[i]).subscribe(
            (data1: { Title }[]) => {
              if (data1.length > 0) {
                this.topLessonLearnedsLikesWithFilter = data1;
                console.log(this.topLessonLearnedsLikesWithFilter);
                this.dataSourceForLikes.push({
                  Title: this.topLessonLearnedsLikesWithFilter[0].Title,
                  Like: this.test1[i].count
                });
              }
              if (topLikes.length === i + 1) {
                this.showPopular = true;
              }
              if (this.dataSourceForLikes.length === 3) {
                this.condition = true;
                this.spinner.hide();
              }
            });
        }
      });

    this.KmsService.getAllContents().subscribe(
      (data: ContentModel[]) => {
        this.contents = data;
        this.news = this.contents.filter(v => +v.ContentKind === 1 && v.Title.indexOf('گزارش مختصر سمینار'));
        this.seminarReport = this.contents.filter(v => v.ContentKind === 1 && v.Title.includes('گزارش مختصر سمینار'));
        this.seminarReport.reverse();
        this.seminarsIntroduction = this.contents.filter(v => +v.ContentKind === 7);
        this.nahveEraeTajrobeat = this.contents.filter(v => +v.ContentKind === 10);
        this.jamAvariDarsAmokhte = this.contents.filter(v => +v.ContentKind === 6);
        this.mehvarhayeDarsAmokhte = this.contents.filter(v => +v.ContentKind === 2);
        this.moshahedeDarsAmokhteHayeGozashte = this.contents.filter(v => +v.ContentKind === 12);
        this.DarsAmokhte = this.contents.filter(v => +v.ContentKind === 13);
        this.KetabcheDarsAmokhte = this.contents.filter(v => +v.ContentKind === 14);
        this.elanHa = this.contents.filter(v => +v.ContentKind === 16);
        this.bargozarkonandeha = this.contents.filter(v => +v.ContentKind === 17);
        this.box1 = this.contents.filter(v => +v.ContentKind === 18);
        this.box2 = this.contents.filter(v => +v.ContentKind === 19);
        this.box3 = this.contents.filter(v => +v.ContentKind === 20);
        this.box4 = this.contents.filter(v => +v.ContentKind === 21);
        this.box5 = this.contents.filter(v => +v.ContentKind === 22);
      }
    );

    // this.KmsService.getTopLessonLearneds().subscribe(
    //   (data: PostModel[]) => {
    //     this.posts = data;
    //     console.log(data);
    //     this.spinner.hide();
    //   }
    // );
    this.KmsService.getTopLessonLearneds().subscribe(
      (data: { ID, Title, Created }[]) => {
        this.topLessonLearneds = data;
        this.dataSource = data;
      }
    );
    this.KmsService.getTopLessonLearnedsForTopScores().subscribe(
      (data: { ID, Title, Score }[]) => {
        this.topLessonLearnedsScores = data;
        this.dataSourceForBestScores = data;
      }
    );
  }

  test(a) {
    return this.topLessonLearnedsLikes[a].PostId;
  }


  onClickPoster(image: string) {
    const dialogRef = this.dialog.open(KmsDialogComponent, {
      width: '700px',
      height: '800px',
      data: image,
    });
  }

  onClickItem(page) {
    this.router.navigate(['page'], {queryParams: {ID: page}});
  }

  onClickNormalPage(page) {
    this.router.navigate([page]);
  }

  onPostClick(title, type: string) {
    let y;
    if (type === 'last') {
      y = this.topLessonLearneds.find(x => x.Title === title).ID;
    }
    if (type === 'score') {
      y = this.topLessonLearnedsScores.find(x => x.Score === title).ID;
    }
    if (type === 'like') {
      // y = this.topLessonLearnedsLikes.find(x => x.PostId === title).ID;
      return alert('در حال توسعه ...')
    }
    this.router.navigate(['post'], {queryParams: {ID: y}, queryParamsHandling: 'merge'});
  }

}
