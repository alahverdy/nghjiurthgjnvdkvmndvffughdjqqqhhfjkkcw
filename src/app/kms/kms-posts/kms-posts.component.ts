import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {KmsService} from '../../shared/services/kms.service';
import {PostModel} from '../../shared/models/kms/Post.model';
import {CurrentUserModel} from '../../shared/models/kms/CurrentUser.model';
import {LessonLearnedTopicModel} from '../../shared/models/kms/LessonLearnedTopic.model';
import {OperationKindModel} from '../../shared/models/kms/OperationKind.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {RaiPartsModel} from '../../shared/models/kms/RaiParts.model';
import {LessonLearnedModel} from '../../shared/models/kms/LessonLearned.model';
import {KmsContractComponent} from './kms-post/kms-contract/kms-contract.component';
import {MatDialog} from '@angular/material';
import {KmsSearchInDescriptionComponent} from './kms-search-in-description/kms-search-in-description.component';
import {LessonLearnedStepModel} from '../../shared/models/kms/LessonLearnedStep.model';

@Component({
  selector: 'app-kms-posts',
  templateUrl: './kms-posts.component.html',
  styleUrls: ['./kms-posts.component.scss']
})
export class KmsPostsComponent implements OnInit {
  mainPosts: PostModel[] = [];
  posts: PostModel[] = [];
  postsSearchDef: PostModel[] = [];
  checking = false;
  showResetFilter = false;
  lessonLearnedTopics: LessonLearnedTopicModel[] = [];
  lessonLearnedOperations: OperationKindModel[] = [];
  lessonLearnedRaiParts: RaiPartsModel[] = [];
  lessonLearned: LessonLearnedModel[] = [];
  lessonLearnedFiltred = [];
  lessonLearnedFiltredOp = [];
  lessonLearnedFiltredRp = [];
  lessonLearnedFiltredSteps = [];
  datesForFilter = [1395, 1396, 1397, 1398];
  dateFiltered = [];
  // scoresForFilter = [0, 1, 2, 3, 4];
  refereesScore = [];
  searchInLesson: string;
  searchInAuthor: string;
  topLessonLearnedsLikes: { ID, PostId }[] = [];
  userRaiParts: { ID, RaiPart }[] = [];
  userRPSyncCounter = 0;
  lessonLearnedSteps: LessonLearnedStepModel[];
  lessonLearnedStepsData: LessonLearnedModel[];

  constructor(private kmsService: KmsService, private spinner: NgxSpinnerService,
              private router: Router, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.spinner.show();
    this.kmsService.getAllOperationKinds().subscribe(
      (data: OperationKindModel[]) => {
        this.lessonLearnedOperations = data;
      }
    );

    this.kmsService.getAllLessonLearnedTopics().subscribe(
      (data: LessonLearnedTopicModel[]) => {
        this.lessonLearnedTopics = data;
      }
    );

    this.kmsService.getAllRaiParts().subscribe(
      (raiParts) => {
        this.lessonLearnedRaiParts = raiParts;
        console.log(this.lessonLearnedRaiParts);
      }
    );
    this.kmsService.getLessonLearnedStep().subscribe(
      (lessonLearnedData) => {
        this.lessonLearned = lessonLearnedData;
        console.log(this.lessonLearned);
      }
    );

    this.kmsService.getAllUsersRaiPart().subscribe(
      (userRaiParts: { ID, RaiPart }[]) => {
        this.userRaiParts = userRaiParts;
        this.onInjectLessonLearndRP();
      }
    );

    this.kmsService.getAllLessonLearned().subscribe(
      (data: PostModel[]) => {
        this.posts = data;
        this.onInjectLessonLearndRP();
      }
    );
    this.kmsService.getAllLessonLearnedSteps().subscribe(
      (data: LessonLearnedStepModel[]) => {
        this.lessonLearnedSteps = data;
      }
    );
  }

  onInjectLessonLearndRP() {
    this.userRPSyncCounter++;
    if (this.userRPSyncCounter === 2) {
      this.posts.filter(v => {
        v.RaiPart = this.userRaiParts.filter(v2 => v2.ID === v.Creator)[0].RaiPart;
      });
      this.postsSearchDef = this.posts;
      this.mainPosts = this.posts;
      this.checking = true;
      this.spinner.hide();
      console.log(this.posts);
    }
  }

  onChangeLessonLearnedTopic(e, index, type) {
    this.spinner.show();
    this.searchInAuthor = '';
    this.searchInLesson = '';
    if (e.checked) {
      if (type === 'rp') {
        this.lessonLearnedFiltredRp.push(this.lessonLearnedRaiParts[index]);
      }
      if (type === 'to') {
        this.lessonLearnedFiltred.push(this.lessonLearnedTopics[index]);
        console.log(this.lessonLearnedFiltred);
      }
      if (type === 'op') {
        this.lessonLearnedFiltredOp.push(this.lessonLearnedOperations[index]);
      }
      if (type === 1395 || 1396 || 1397 || 1398) {
        for (let q = 0; this.datesForFilter.length > q; q++) {
          if (type === this.datesForFilter[q]) {
            if (this.dateFiltered.includes(type)) {
              console.log(this.dateFiltered);
            } else {
              this.dateFiltered.push(this.datesForFilter[index]);
              console.log(this.dateFiltered);
            }
          }
        }

      }
      if (type === 'ls') {
        this.lessonLearnedFiltredSteps.push(this.lessonLearnedSteps[index]);
      }
      // if (type === 0 || 1 || 2 || 3 || 4) {
      //   console.log(type);
      //   for (let q = 0; this.scoresForFilter.length > q; q++) {
      //     if (type === this.scoresForFilter[q]) {
      //       if (this.refereesScore.includes(type)) {
      //       } else {
      //         this.refereesScore.push(this.scoresForFilter[index]);
      //       }
      //     }
      //   }
      // }
      this.showResetFilter = true;

    } else {
      let topicIndex;
      if (type === 'rp') {
        topicIndex = this.lessonLearnedFiltredRp.filter(v => v.ID !== this.lessonLearnedRaiParts[index].ID);
        this.lessonLearnedFiltredRp = topicIndex;
      }
      if (type === 'to') {
        topicIndex = this.lessonLearnedFiltred.filter(v => v.ID !== this.lessonLearnedTopics[index].ID);
        this.lessonLearnedFiltred = topicIndex;
      }
      if (type === 'op') {
        topicIndex = this.lessonLearnedFiltredOp.filter(v => v.ID !== this.lessonLearnedOperations[index].ID);
        this.lessonLearnedFiltredOp = topicIndex;
      }
      if (type === 1395 || 1396 || 1397 || 1398) {
        for (let q = 0; this.datesForFilter.length > q; q++) {
          if (type === this.datesForFilter[q]) {
            if (this.dateFiltered.includes(type)) {
              topicIndex = this.dateFiltered.filter(v => v !== this.datesForFilter[index]);
              this.dateFiltered = topicIndex;
            }
          }
        }
      }
      if (type === 'ls') {
        topicIndex = this.lessonLearnedFiltredSteps.filter(v => v.ID !== this.lessonLearnedSteps[index].ID);
        this.lessonLearnedFiltredSteps = topicIndex;
      }
      // if (type === 0 || 1 || 2 || 3 || 4) {
      //   for (let q = 0; this.scoresForFilter.length > q; q++) {
      //     if (type === this.scoresForFilter[q]) {
      //       if (this.refereesScore.includes(type)) {
      //         topicIndex = this.refereesScore.filter(v => v !== this.scoresForFilter[index]);
      //         this.refereesScore = topicIndex;
      //       }
      //     }
      //   }
      // }

      console.log(topicIndex);
    }

    if (this.lessonLearnedFiltred.length !== 0 || this.lessonLearnedFiltredOp.length !== 0
      || this.dateFiltered.length !== 0 || this.refereesScore.length !== 0 || this.lessonLearnedFiltredRp.length !== 0 || this.lessonLearnedFiltredSteps.length !== 0) {
      if (this.lessonLearnedFiltred.length !== 0) {
        if (this.lessonLearnedFiltredOp.length !== 0) {
          this.posts = this.mainPosts.filter(v => {
            for (let i = 0; i < this.lessonLearnedFiltred.length; i++) {
              if (v.LessonLearnedTopic.ID === this.lessonLearnedFiltred[i].ID) {
                return true;
              }
            }
          });
        } else {
          this.posts = this.mainPosts.filter(v => {
            for (let i = 0; i < this.lessonLearnedFiltred.length; i++) {
              if (v.LessonLearnedTopic.ID === this.lessonLearnedFiltred[i].ID) {
                return true;
              }
            }
          });
        }
      }
      if (this.lessonLearnedFiltredOp.length !== 0) {
        if (this.lessonLearnedFiltred.length !== 0 || this.dateFiltered.length !== 0 || this.refereesScore.length !== 0 || this.lessonLearnedFiltredSteps.length !== 0) {
          this.posts = this.posts.filter(v => {
            for (let i = 0; i < this.lessonLearnedFiltredOp.length; i++) {
              if (v.OperationKind.ID === this.lessonLearnedFiltredOp[i].ID) {
                return true;
              }
            }
          });
        } else {
          this.posts = this.mainPosts.filter(v => {
            for (let i = 0; i < this.lessonLearnedFiltredOp.length; i++) {
              if (v.OperationKind.ID === this.lessonLearnedFiltredOp[i].ID) {
                return true;
              }
            }
          });
        }
      }
      if (this.lessonLearnedFiltredRp.length !== 0) {
        if (this.lessonLearnedFiltred.length !== 0 || this.dateFiltered.length !== 0 || this.refereesScore.length !== 0 || this.lessonLearnedFiltredOp.length !== 0 || this.lessonLearnedFiltredSteps.length !== 0) {
          this.posts = this.posts.filter(v => {
            for (let i = 0; i < this.lessonLearnedFiltredRp.length; i++) {
              if (+v.RaiPart === +this.lessonLearnedFiltredRp[i].ID) {
                return true;
              }
            }
          });
        } else {
          this.posts = this.mainPosts.filter(v => {
            for (let i = 0; i < this.lessonLearnedFiltredRp.length; i++) {
              if (+v.RaiPart === +this.lessonLearnedFiltredRp[i].ID) {
                return true;
              }
            }
          });
        }
      }
      if (this.dateFiltered.length !== 0) {
        if (this.lessonLearnedFiltred.length !== 0 || this.lessonLearnedFiltredOp.length !== 0 || this.refereesScore.length !== 0 || this.lessonLearnedFiltredSteps.length !== 0) {
          this.posts = this.posts.filter(v => {
            for (let i = 0; i < this.dateFiltered.length; i++) {
              if (v.CreatedDate.includes(this.dateFiltered[i])) {
                return true;
              }
            }
          });
        } else {
          this.posts = this.mainPosts.filter(v => {
            for (let i = 0; i < this.dateFiltered.length; i++) {
              if (v.CreatedDate.includes(this.dateFiltered[i])) {
                return true;
              }
            }
          });
        }
      }
      if (this.refereesScore.length !== 0) {
        if (this.lessonLearnedFiltred.length !== 0 || this.lessonLearnedFiltredOp.length !== 0 || this.dateFiltered.length !== 0 || this.lessonLearnedFiltredSteps.length !== 0) {
          this.posts = this.posts.filter(v => {
            for (let i = 0; i < this.refereesScore.length; i++) {
              if (v.MainScore >= this.refereesScore[i] && v.MainScore < this.refereesScore[i] + 1) {
                return true;
              }
            }
          });
        } else {
          this.posts = this.mainPosts.filter(v => {
            for (let i = 0; i < this.refereesScore.length; i++) {
              if (v.MainScore >= this.refereesScore[i] && v.MainScore < this.refereesScore[i] + 1) {
                return true;
              }
            }
          });
        }
      }
      if (this.lessonLearnedFiltredSteps.length !== 0) {
        this.lessonLearnedStepsData = [];
        this.lessonLearnedStepsData = this.lessonLearned.filter(v => {
          for (let j = 0; j < this.lessonLearnedFiltredSteps.length; j++) {
            if (+v.LessonLearnedStep.ID === +this.lessonLearnedFiltredSteps[j].ID) {
              return true;
            }
          }
        });
        if (this.lessonLearnedFiltred.length !== 0 || this.dateFiltered.length !== 0 || this.refereesScore.length !== 0 || this.lessonLearnedFiltredOp.length !== 0 || this.lessonLearnedFiltredRp.length !== 0) {
          console.log(this.lessonLearnedStepsData);
          this.posts = this.posts.filter(v => {
            for (let i = 0; i < this.lessonLearnedStepsData.length; i++) {
              if (v.Title === this.lessonLearnedStepsData[i].Post.Title) {
                return true;
              }
            }
          });
        } else {
          this.posts = this.mainPosts.filter(v => {
            for (let i = 0; i < this.lessonLearnedStepsData.length; i++) {
              if (v.Title === this.lessonLearnedStepsData[i].Post.Title) {
                return true;
              }
            }
          });
        }
      }
      this.postsSearchDef = this.posts;
      this.spinner.hide();
    } else {
      this.posts = this.mainPosts;
      this.spinner.hide();
    }
  }

  // onChangeLessonLearnedOperation(e, index) {
  //   if (e.checked) {
  //     this.lessonLearnedFiltredOp.push(this.lessonLearnedOperations[index]);
  //   } else {
  //     const topicIndex = this.lessonLearnedFiltredOp.filter(v => v.ID !== this.lessonLearnedOperations[index].ID);
  //     this.lessonLearnedFiltredOp = topicIndex;
  //   }
  //   if (this.lessonLearnedFiltredOp.length !== 0) {
  //     console.log(this.posts);
  //     this.posts = this.mainPosts.filter(v => {
  //       for (let i = 0; i < this.lessonLearnedFiltredOp.length; i++) {
  //         if (v.OperationKind.ID === this.lessonLearnedFiltredOp[i].ID) {
  //           return true;
  //         }
  //       }
  //     });
  //   } else {
  //     this.posts = this.mainPosts;
  //   }
  // }


  onPostClick(id: number, author: string) {
    this.router.navigate(['post'], {queryParams: {ID: id}, queryParamsHandling: 'merge'});
    this.relatedLessonLearened(author);
  }

  relatedLessonLearened(author: string) {
    this.kmsService.relatedLessons = this.posts.filter(x => x.Author === author);
    console.log(this.kmsService.relatedLessons);
  }

  onSearch(e) {
    if (e.target.value === '') {
      this.posts = this.postsSearchDef;
    }
    const val = e.target.value.replace(/ي/g, 'ی').replace(/ئ/g, 'ی').replace(/ك/g, 'ک').replace(/أ/g, 'ا').toLocaleLowerCase();
    console.log(val);
    this.posts = this.postsSearchDef.filter(v => v.Title.replace(/ي/g, 'ی').replace(/ئ/g, 'ی').replace(/ك/g, 'ک').replace(/أ/g, 'ا').toLocaleLowerCase().includes(val));
  }

  onAuthorSearch(e) {
    if (e.target.value === '') {
      this.posts = this.postsSearchDef;
    }
    const val = e.target.value.replace(/ي/g, 'ی').replace(/ئ/g, 'ی').replace(/ك/g, 'ک').replace(/أ/g, 'ا').toLocaleLowerCase();
    this.posts = this.postsSearchDef.filter(v => v.Author.replace(/ي/g, 'ی').replace(/ئ/g, 'ی').replace(/ك/g, 'ک').replace(/أ/g, 'ا').toLocaleLowerCase().includes(val));
  }

  sortData(sortValue: string) {
    this.spinner.show();
    if (sortValue === 'topScore') {
      this.kmsService.getTopLessonLearnedsForTopScoresSort().subscribe(
        (data: PostModel[]) => {
          this.posts = data;
          console.log(data);
          this.postsSearchDef = this.posts;
          this.mainPosts = data;
          this.checking = true;
          this.spinner.hide();
        }
      );
    }
    if (sortValue === 'bottomScore') {
      this.kmsService.getTopLessonLearnedsForTopScoresSort().subscribe(
        (data: PostModel[]) => {
          this.posts = data;
          console.log(data);
          this.postsSearchDef = this.posts;
          this.mainPosts = data;
          this.checking = true;
          this.posts.reverse();
          this.spinner.hide();
        }
      );
    }
    if (sortValue === 'topLike') {
      this.kmsService.getAllPostLikeForSort().subscribe(
        (data: { ID, PostId }[]) => {
          this.topLessonLearnedsLikes = data;
          console.log(this.topLessonLearnedsLikes);
          this.posts = this.posts.filter(v => {
            for (let i = 0; i < this.topLessonLearnedsLikes.length; i++) {
              if (v.ID === this.topLessonLearnedsLikes[i].PostId) {
                return true;
              }
            }
          });
          this.spinner.hide();
          console.log(this.posts);
        });
    }
    if (sortValue === 'topDate') {
      this.kmsService.getAllLessonLearned().subscribe(
        (data: PostModel[]) => {
          this.posts = data;
          console.log(data);
          this.postsSearchDef = this.posts;
          this.mainPosts = data;
          this.checking = true;
          this.spinner.hide();
        }
      );
    }
    if (sortValue === 'bottomDate') {
      this.kmsService.getAllLessonLearned().subscribe(
        (data: PostModel[]) => {
          this.posts = data;
          console.log(data);
          this.postsSearchDef = this.posts;
          this.mainPosts = data;
          this.checking = true;
          this.posts.reverse();
          this.spinner.hide();
        }
      );
    }
  }


  onClickForSearch() {
    const dialogRef = this.dialog.open(KmsSearchInDescriptionComponent, {
      width: '700px',
      height: '700px',
    });
  }

  resetFilter() {
    this.spinner.show();
    this.kmsService.getAllLessonLearned().subscribe(
      (data: PostModel[]) => {
        this.posts = data;
        this.showResetFilter = false;
        this.spinner.hide();
      }
    );
  }
}
