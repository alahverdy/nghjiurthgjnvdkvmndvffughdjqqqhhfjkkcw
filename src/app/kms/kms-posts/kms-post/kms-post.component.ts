import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {KmsService} from '../../../shared/services/kms.service';
import {FileModel} from '../../../shared/models/kms/File.model';
import {PostModel} from '../../../shared/models/kms/Post.model';
import {LessonLearnedDescModel} from '../../../shared/models/kms/LessonLearnedDesc.model';
import {MatDialog} from '@angular/material';
import {KmsContractComponent} from './kms-contract/kms-contract.component';
import {FormGroup} from '@angular/forms';
import {KmsAddCommentFormComponent} from '../../kms-forms/kms-lesson-learned-form/kms-add-comment-form/kms-add-comment-form.component';
import {isUndefined} from 'util';
import {CommentModel} from '../../../shared/models/kms/Comment.model';
import Swal from 'sweetalert2';
import {UserProfileDataModel} from '../../../shared/models/kms/UserProfileData.model';
import {RelatedQuestionAndAnwserModel} from '../../../shared/models/kms/RelatedQuestionAndAnwser.model';
import {CurrentUserModel} from '../../../shared/models/kms/CurrentUser.model';
import {MyJudgePostModel} from '../../../shared/models/kms/MyJudgePost.model';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';

@Component({
  selector: 'app-kms-post',
  templateUrl: './kms-post.component.html',
  styleUrls: ['./kms-post.component.scss']
})
export class KmsPostComponent implements OnInit {
  post: PostModel;
  postDesc: LessonLearnedDescModel;
  tabs = [
    'شرح داستان',
    'راهکار پیشنهادی',
    'درس آموخته',
    'نظرات کاربران',
    'پرسش های مرتبط',
    'مستندات',
  ];
  documents: FileModel[] = [];
  isLiked = false;
  likes = 0;
  comments: CommentModel[] = [];
  todayFa: string;
  questionAndAnwsers: RelatedQuestionAndAnwserModel[] = [];
  isJudge = false;
  judgeId: number;
  myJudge: MyJudgePostModel;
  // config: ExportAsConfig = {
  //   type: 'pdf',
  //   elementId: 'mytable',
  //   options: {
  //     jsPDF: {
  //       orientation: 'landscape',
  //     },
  //   }
  // };


  constructor(private route: ActivatedRoute,
              public kmsService: KmsService,
              private router: Router, private exportAsService: ExportAsService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.kmsService.todayFaSubject.subscribe(
      (todayFa: any) => {
        this.todayFa = todayFa;
      }
    );
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params.ID) {
          this.kmsService.getRelatedQuestionAndLessonLearned(params.ID).subscribe(
            (questionAndAnwsers: RelatedQuestionAndAnwserModel[]) => {
              this.questionAndAnwsers = questionAndAnwsers;
            }
          );
          this.kmsService.getAllComments(params.ID).subscribe(
            (comments: CommentModel[]) => {
              this.comments = comments;
            }
          );
          this.kmsService.getLessonLearned(params.ID).subscribe(
            (data: PostModel) => {
              this.post = data;
              console.log(this.post);
              this.kmsService.getAllFiles(this.post.Docs).subscribe(
                (data: FileModel[]) => {
                  this.documents = data;
                }
              );
              this.kmsService.userProfileDataSubject.subscribe(
                (userProflieData: UserProfileDataModel) => {
                  this.kmsService.getUserPostLike(userProflieData.ID, this.post.ID).subscribe(
                    (postlike: any) => {
                      if (postlike) {
                        this.isLiked = true;
                      } else {
                        this.isLiked = false;
                      }
                    }
                  );
                  this.onGetLikes();
                }
              );
              this.kmsService.getLessonLearnedDesc(params.ID).subscribe(
                (data: LessonLearnedDescModel) => {
                  this.postDesc = data;
                }
              );
            }
          );
        }
        if (params.Judging) {
          this.kmsService.getCurrentUser().subscribe(
            (currentUser: CurrentUserModel) => {
              this.judgeId = currentUser.Id;
              this.kmsService.getUserProfileDataWithIsComplete(currentUser.Id).subscribe(
                (userProfile: UserProfileDataModel) => {
                  this.kmsService.getKMSUserRole(this.kmsService.userProfileData.ID).subscribe(
                    (data: { ID, Role: number[] }) => {
                      this.kmsService.searchInLessonLearnedOfMyJudge(this.post.ID, userProfile.ID).subscribe(
                        (myJudge: MyJudgePostModel[]) => {
                          if (myJudge.length !== 0) {
                            this.myJudge = myJudge[0];
                            const userRole = data;
                            if (userRole.Role[0] === 2 || userRole.Role[0] === 1) {
                              this.isJudge = true;
                            }
                          }
                        }
                      );
                    }
                  );
                }
              );
            }
          );
          console.log(params.Judging);
        }
      }
    );
    // this.kmsService.getAllLessonLearned().subscribe(
    //   (data: PostModel[]) => {
    //     this.posts = data;
    //   }
    // );
  }

  onGetLikes() {
    this.kmsService.getAllLikes(this.post.ID).subscribe(
      (likes: any) => {
        this.likes = likes;
      }
    );
  }


  onLikeClick() {
    this.isLiked = !this.isLiked;
    if (this.isLiked) {
      this.likes++;
    } else {
      this.likes--;
    }
    try {
      this.likeOrDisLike();
    } catch {
      this.onLikeClick();
    }
  }

  likeOrDisLike() {
    this.kmsService.getUserPostLike(this.kmsService.userProfileData.ID, this.post.ID).subscribe(
      (postLike: any) => {
        if (postLike) {
          this.kmsService.getDataFromContextInfo().subscribe(
            (digestValue) => {
              this.kmsService.deleteItem(digestValue, 'PostLikes', postLike.ID).subscribe(
                () => {
                }
              );
            }
          );
        } else {
          this.kmsService.getDataFromContextInfo().subscribe(
            (digestValue) => {
              this.kmsService.addLikePost(digestValue, this.isLiked, this.post.ID, this.kmsService.userProfileData.ID).subscribe(
                () => {

                }
              );
            }
          );
        }
      }
    );
  }

  onAddComment() {
    const dialogRef = this.dialog.open(KmsAddCommentFormComponent, {
      width: '700px',
      height: '700px',
      data: this.post.ID,
    });
    dialogRef.afterClosed().subscribe(
      (result: FormGroup) => {
        if (isUndefined(result)) {
        } else {
          if (result.valid) {
            this.kmsService.getDataFromContextInfo().subscribe(
              (digestValue) => {
                this.kmsService.addComment(digestValue, this.post.ID, result.value).subscribe(
                  (data: any) => {
                    Swal({
                      title: 'نظر با موفقیت ثبت گردید!',
                      type: 'success',
                    });
                    this.comments.unshift({
                      ID: data.ID,
                      Title: result.value.Title,
                      Text: result.value.Desc,
                      User: {
                        ID: this.kmsService.userProfileData.ID,
                        Title: this.kmsService.userProfileData.Title,
                      },
                      Post: this.post.ID,
                      Created: this.todayFa
                    });
                  }
                );
              }
            );
          } else {
            Swal({
              title: 'اطلاعات دارای اشکال می باشند!',
              type: 'error',
            });
          }
        }
      });
  }

  onClickItem(contract, Title) {
    const dialogRef = this.dialog.open(KmsContractComponent, {
      width: '700px',
      height: '700px',
      data: contract,
    });
  }

  onPostClick(pageName: string, id: number) {
    this.router.navigate([pageName], {queryParams: {ID: id}, queryParamsHandling: 'merge'});
  }
  onPostClickForRelated(id: number) {
    this.router.navigate(['post'], {queryParams: {ID: id}, queryParamsHandling: 'merge'});
  }
  onPostClickPage(pageName: string) {
    this.router.navigate([pageName]);
  }

  //
  // exportAs(type, opt?: string) {
  //   this.config.type = type;
  //   if (opt) {
  //     this.config.options.jsPDF.orientation = opt;
  //   }
  //   this.exportAsService.save(this.config, 'myFile').subscribe(() => {
  //     // save started
  //   });
  // }
  //
  // exportAs1(type) {
  //   this.config.type = type;
  //   // if (opt) {
  //   //   this.config.options.jsPDF.orientation = opt;
  //   // }
  //   this.exportAsService.save(this.config, 'myFile').subscribe(() => {
  //     // save started
  //   });
  // }
}
