import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpRequest, HttpResponse} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {PostModel} from '../models/kms/Post.model';
import {LessonLearnedDescModel} from '../models/kms/LessonLearnedDesc.model';
import {CommentModel} from '../models/kms/Comment.model';
import {LessonLearnedTopicModel} from '../models/kms/LessonLearnedTopic.model';
import {LessonLearnedStepModel} from '../models/kms/LessonLearnedStep.model';
import {OperationKindModel} from '../models/kms/OperationKind.model';
import {ContractModel} from '../models/kms/Contract.model';
import {UnitModel} from '../models/kms/Unit.model';
import {SubUnitModel} from '../models/kms/SubUnit.model';
import {RaiPartsModel} from '../models/kms/RaiParts.model';
import {FileModel} from '../models/kms/File.model';
import {ContentModel} from '../models/kms/Content.model';
import {CurrentUserModel} from '../models/kms/CurrentUser.model';
import {PositionModel} from '../models/kms/Position.model';
import {EducationLevelModel} from '../models/kms/EducationLevel.model';
import {UserProfileDataModel} from '../models/kms/UserProfileData.model';
import {SearchListModel} from '../models/kms/SearchList.model';
import {UserModel} from '../models/kms/User.model';
import {Subject} from 'rxjs/index';
import {ContractorModel} from '../models/kms/Contractor.model';
import * as moment from 'jalali-moment';
import {UserAdminModel} from '../models/kms/UserAdmin.model';
import {KmsUserModel} from '../models/kms/KmsUser.model';
import {FileTypeModel} from '../models/kms/FileType.model';
import {RelatedQuestionAndAnwserModel} from '../models/kms/RelatedQuestionAndAnwser.model';
import {AnswerModel} from '../models/kms/Answer.model';
import {MyJudgePostModel} from '../models/kms/MyJudgePost.model';
import {CriteriasModel} from '../models/kms/Criterias.model';
import {PostLikesModel} from '../models/kms/PostLikes.model';
import {LessonLearnedModel} from '../models/kms/LessonLearned.model';

@Injectable({
  providedIn: 'root',
})
export class KmsService {
  public userProfileDataSubject = new Subject();
  userProfileData: UserProfileDataModel;
  selectedTabSubject = new Subject();
  todayFaSubject = new Subject();
  todayFa: string;
  posts: PostModel[] = [];
  relatedLessons: PostModel[] = [];

  constructor(private http: HttpClient) {
  }

  serachInPosts(searchedValue: string, searchedValue2: string) {
    const mainData: SearchListModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Posts\')/items?$filter=(StatusId ne 3) and (StatusId ne 2) and ((substringof(\'' + searchedValue + '\',Title)) or (substringof(\'' + searchedValue2 + '\',Title)))&$select=ID,Title',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            new SearchListModel(
              data[i].ID,
              data[i].Title,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getUserProfileData(id: number) {
    let mainData: UserProfileDataModel;
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/_api/web/lists/getbytitle(\'Users\')/items?$filter=AccountId eq ' + id + '&$select=ID,Title,Email,Experience,RaiPartId,PositionId,EducationlevelId,ContractorId,Gen,MobileNumber,JobTitle1,PhoneNumber,LocationAddress,ActivityScope,Major,Birth,IsComplete&$top=1000',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results[0];
        if (!data) {
        } else {
          let date = null;
          if (data.Birth) {
            date = moment(data.Birth, 'YYYY/M/D').format('jYYYY/jM/jD');
            // console.log(date);
            const splitedDate = date.split('/');
            date = splitedDate[0] + '/' + this.addZeroToMonth(splitedDate[1]) + '/' + this.addZeroToMonth(splitedDate[1]);
          }
          mainData = {
            ID: data.ID,
            Title: data.Title,
            Experience: data.Experience,
            Email: data.Email,
            RaiPart: data.RaiPartId,
            Contractor: data.ContractorId,
            EducationLevel: data.EducationlevelId,
            Position: data.PositionId,
            Gender: data.Gen,
            MobileNumber: data.MobileNumber,
            JobTitle: data.JobTitle1,
            PhoneNumber: data.PhoneNumber,
            Address: data.LocationAddress,
            ActivityScope: data.ActivityScope,
            Major: data.Major,
            BirthDate: date,
            IsComplete: data.IsComplete
          };
        }
        this.userProfileDataSubject.next(mainData);
        this.userProfileData = mainData;
        return mainData;
      }
    ));
  }

  getUserProfileDataById(id: number) {
    let mainData: UserProfileDataModel;
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/_api/web/lists/getbytitle(\'Users\')/items?$filter=ID eq ' + id + '&$select=ID,Title,Email,Experience,RaiPartId,Position/Title,RaiPart/Title,Contractor/Title,Educationlevel/ID,Educationlevel/Title,ContractorId,Gen,MobileNumber,JobTitle1,PhoneNumber,LocationAddress,ActivityScope,Major,Birth,IsComplete&$expand=Position,RaiPart,Contractor,Educationlevel&$top=1000',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results[0];
        if (!data) {
        } else {
          let date = null;
          if (data.Birth) {
            date = moment(data.Birth, 'YYYY/M/D').format('jYYYY/jM/jD');
            const splitedDate = date.split('/');
            date = splitedDate[0] + '/' + this.addZeroToMonth(splitedDate[1]) + '/' + this.addZeroToMonth(splitedDate[1]);
          }
          mainData = {
            ID: data.ID,
            Title: data.Title,
            Experience: data.Experience,
            Email: data.Email,
            RaiPart: data.RaiPart.Title,
            Contractor: data.Contractor.Title,
            EducationLevel: data.Educationlevel.Title,
            Position: data.Position.Title,
            Gender: data.Gen,
            MobileNumber: data.MobileNumber,
            JobTitle: data.JobTitle1,
            PhoneNumber: data.PhoneNumber,
            Address: data.LocationAddress,
            ActivityScope: data.ActivityScope,
            Major: data.Major,
            BirthDate: date,
            IsComplete: data.IsComplete
          };
        }
        // this.userProfileDataSubject.next(mainData);
        // this.userProfileData = mainData;
        return mainData;
      }
    ));
  }

  getUserTitle(id: number) {
    let mainData: { ID: number, Title: string };
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/_api/web/lists/getbytitle(\'Users\')/items?$filter=ID eq ' + id + '&$select=ID,Title',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results[0];
        mainData = {
          ID: data.ID,
          Title: data.Title,
        };
        return mainData;
      }
    ));
  }

  getUserProfileDataWithIsComplete(id: number) {
    let mainData: UserProfileDataModel;
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/_api/web/lists/getbytitle(\'Users\')/items?$filter=AccountId eq ' + id + '&$select=ID,Title,Email,Experience,RaiPartId,PositionId,EducationlevelId,ContractorId,Gen,MobileNumber,JobTitle1,PhoneNumber,LocationAddress,ActivityScope,Major,Birth,IsComplete&$top=1000',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results[0];
        if (!data) {
        } else {
          let date = null;
          if (data.Birth) {
            date = moment(data.Birth, 'YYYY/M/D').format('jYYYY/jM/jD');
          }
          mainData = {
            ID: data.ID,
            Title: data.Title,
            Experience: data.Experience,
            Email: data.Email,
            RaiPart: data.RaiPartId,
            Contractor: data.ContractorId,
            EducationLevel: data.EducationlevelId,
            Position: data.PositionId,
            Gender: data.Gen,
            MobileNumber: data.MobileNumber,
            JobTitle: data.JobTitle1,
            PhoneNumber: data.PhoneNumber,
            Address: data.LocationAddress,
            ActivityScope: data.ActivityScope,
            Major: data.Major,
            BirthDate: date,
            IsComplete: data.IsComplete
          };
        }
        this.userProfileDataSubject.next(mainData);
        this.userProfileData = mainData;
        return mainData;
      }
    ));
  }

  deleteItem(DigestValue, listName: string, id: number) {
    const headers = new HttpHeaders({
      'X-RequestDigest': DigestValue,
      'content-type': 'application/json;odata=verbose',
      'accept': 'application/json;odata=verbose',
      'IF-MATCH': '*',
      'X-HTTP-Method': 'DELETE'
    });
    return this.http.post(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'' + listName + '\')/items(' + id + ')',
      '',
      {headers: headers}
    );
  }


  sendJudgeScore(DigestValue: any, refereePostAssignment: number, criteria: number, score: number) {
    console.log(refereePostAssignment, criteria, score);
    const headers = new HttpHeaders({
      'X-RequestDigest': DigestValue,
      'content-type': 'application/json;odata=verbose',
      'accept': 'application/json;odata=verbose',
    });
    const body = {
      '__metadata': {'type': 'SP.Data.RefereeScoresListItem'},
      'RefereePostAssignmentId': refereePostAssignment,
      'LessonLearnedCriteriaId': criteria,
      'Score': score,
    };
    return this.http.post(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'RefereeScores\')/items',
      body,
      {headers: headers}
    );
  }

  updateRefereePostAssignments(DigestValue: any, data, id: number) {
    const headers = new HttpHeaders({
      'X-RequestDigest': DigestValue,
      'content-type': 'application/json;odata=verbose',
      'accept': 'application/json;odata=verbose',
      'IF-MATCH': '*',
      'X-HTTP-Method': 'MERGE'
    });
    const body = {
      '__metadata': {'type': 'SP.Data.RefereePostAssignmentsListItem'},
      'Score': data.Score,
      'IsJudged': true,
      'FullDescription': data.Desc,
    };
    return this.http.post(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'RefereePostAssignments\')/items(' + id + ')',
      body,
      {headers: headers}
    );
  }

  updatePostDesc(DigestValue: any, data, id: number) {
    const headers = new HttpHeaders({
      'X-RequestDigest': DigestValue,
      'content-type': 'application/json;odata=verbose',
      'accept': 'application/json;odata=verbose',
      'IF-MATCH': '*',
      'X-HTTP-Method': 'MERGE'
    });
    const body = {
      '__metadata': {'type': 'SP.Data.LessonLearnedListItem'},
      'Story': data.Story,
      'FullDescription': data.FullDescription,
      'ProposedSolution': data.ProposedSolution,
      'LessonLearnedStepId': data.lessonLearnedStep,
      'PostId': data.Post,
    };
    return this.http.post(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'LessonLearned\')/items(' + id + ')',
      body,
      {headers: headers}
    );
  }

  addRefereePostAssignment(DigestValue: any, data, counter: number) {
    console.log(data.Judges[counter].User.ID);
    console.log(data.Judges[counter].ID);
    const headers = new HttpHeaders({
      'X-RequestDigest': DigestValue,
      'content-type': 'application/json;odata=verbose',
      'accept': 'application/json;odata=verbose',
    });
    const body = {
      '__metadata': {'type': 'SP.Data.RefereePostAssignmentsListItem'},
      'PostId': data.Post,
      'User1Id': data.Judges[counter].User.ID,
    };
    return this.http.post(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'RefereePostAssignments\')/items',
      body,
      {headers: headers}
    );
  }

  addLikePost(DigestValue: any, isLiked: boolean, post: number, user: number) {
    const headers = new HttpHeaders({
      'X-RequestDigest': DigestValue,
      'content-type': 'application/json;odata=verbose',
      'accept': 'application/json;odata=verbose',
    });
    const body = {
      '__metadata': {'type': 'SP.Data.PostLikesListItem'},
      'User1Id': user,
      'PostId': post,
    };
    return this.http.post(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'PostLikes\')/items',
      body,
      {headers: headers}
    );
  }

  deleteLikePost(DigestValue: any, isLiked: boolean, post: number, user: number) {
    const headers = new HttpHeaders({
      'X-RequestDigest': DigestValue,
      'content-type': 'application/json;odata=verbose',
      'accept': 'application/json;odata=verbose',
    });
    const body = {
      '__metadata': {'type': 'SP.Data.PostLikesListItem'},
      'User1Id': user,
      'PostId': post,
    };
    return this.http.post(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'PostLikes\')/items',
      body,
      {headers: headers}
    );
  }

  sendPostDesc(DigestValue: any, data) {
    const headers = new HttpHeaders({
      'X-RequestDigest': DigestValue,
      'content-type': 'application/json;odata=verbose',
      'accept': 'application/json;odata=verbose',
    });
    const body = {
      '__metadata': {'type': 'SP.Data.LessonLearnedListItem'},
      'Story': data.Story,
      'FullDescription': data.FullDescription,
      'ProposedSolution': data.ProposedSolution,
      'LessonLearnedStepId': data.lessonLearnedStep,
      'PostId': data.Post,
    };
    return this.http.post(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'LessonLearned\')/items',
      body,
      {headers: headers}
    );
  }

  sendKMSContracts(DigestValue: any, data) {
    const headers = new HttpHeaders({
      'X-RequestDigest': DigestValue,
      'content-type': 'application/json;odata=verbose',
      'accept': 'application/json;odata=verbose',
    });
    const body = {
      '__metadata': {'type': 'SP.Data.KMSContractsListItem'},
      'Title': data.Title,
      'UnitId': {'results': [data.Unit]},
      'SubUnitId': data.SubUnit,
      'RaiPartId': data.RaiPart,
      'StartDate1': moment(data.StartDate, 'jYYYY/jM/jD').format('YYYY/M/D'),
      'PMFullName': data.PM,
      'ContractorFullName': data.Contractor,
    };
    return this.http.post(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'KMSContracts\')/items',
      body,
      {headers: headers}
    );
  }

  updatePostStatus(DigestValue: any, id: number) {
    const headers = new HttpHeaders({
      'X-RequestDigest': DigestValue,
      'content-type': 'application/json;odata=verbose',
      'accept': 'application/json;odata=verbose',
      'IF-MATCH': '*',
      'X-HTTP-Method': 'MERGE'
    });
    const body = {
      '__metadata': {'type': 'SP.Data.PostsListItem'},
      'StatusIdId': 4,
    };
    return this.http.post(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Posts\')/items(' + id + ')',
      body,
      {headers: headers}
    );
  }

  updatePost(DigestValue: any, data, id: number, mainAuthor: number, authors: number[], docsFolder) {
    const headers = new HttpHeaders({
      'X-RequestDigest': DigestValue,
      'content-type': 'application/json;odata=verbose',
      'accept': 'application/json;odata=verbose',
      'IF-MATCH': '*',
      'X-HTTP-Method': 'MERGE'
    });
    const body = {
      '__metadata': {'type': 'SP.Data.PostsListItem'},
      'Title': data.Title,
      'PostTypeId': data.PostType,
      'StatusIdId': data.StatusId,
      'LessonLearnedTopicId': data.lessonLearnedTopic,
      'MainAuthorId': mainAuthor,
      'AuthorIdId': {'results': authors},
      'KMSContractId': data.KMSContract,
      'KMSTempContractId': data.Contract,
      'OperationKindId': data.OperationKind,
      'Docs': docsFolder
    };
    return this.http.post(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Posts\')/items(' + id + ')',
      body,
      {headers: headers}
    );
  }

  createUserProfileData(DigestValue: any, data, isComplete: boolean) {
    const headers = new HttpHeaders({
      'X-RequestDigest': DigestValue,
      'content-type': 'application/json;odata=verbose',
      'accept': 'application/json;odata=verbose',
    });
    let raiPart = null;
    let contractor = null;
    if (+data.JobLocation === 1) {
      raiPart = data.JobLocationList;
    } else {
      contractor = data.JobLocationList;
    }
    const body = {
      '__metadata': {'type': 'SP.Data.UsersListItem'},
      'Title': data.Title,
      'Account\Id': data.Account,
      'Experience': +data.Experience,
      'Email': data.Email,
      'PositionId': data.Position,
      'EducationlevelId': data.EducationLevel,
      'Gen': data.Gender,
      'JobTitle1': data.JobTitle,
      'Major': data.Major,
      'MobileNumber': data.MobileNumber,
      'PhoneNumber': data.PhoneNumber,
      'LocationAddress': data.Address,
      'ActivityScope': data.ActivityScope,
      'RaiPartId': raiPart,
      'ContractorId': contractor,
      'IsComplete': isComplete,
      'Birth': moment(data.BirthDate, 'jYYYY/jM/jD').format('YYYY/M/D'),
    };
    return this.http.post(
      'http://rpmo.rai.ir/PWA/_api/web/lists/getbytitle(\'Users\')/items',
      body,
      {headers: headers}
    );
  }

  updateUserProfileData(DigestValue: any, data, id: number, isComplete: boolean) {
    const headers = new HttpHeaders({
      'X-RequestDigest': DigestValue,
      'content-type': 'application/json;odata=verbose',
      'accept': 'application/json;odata=verbose',
      'IF-MATCH': '*',
      'X-HTTP-Method': 'MERGE'
    });
    let raiPart = null;
    let contractor = null;
    if (+data.JobLocation === 1) {
      raiPart = data.JobLocationList;
    } else {
      contractor = data.JobLocationList;
    }
    const body = {
      '__metadata': {'type': 'SP.Data.UsersListItem'},
      'Title': data.Title,
      'Account\Id': data.Account,
      'Experience': +data.Experience,
      'Email': data.Email,
      'PositionId': data.Position,
      'EducationlevelId': data.EducationLevel,
      'Gen': data.Gender,
      'JobTitle1': data.JobTitle,
      'Major': data.Major,
      'MobileNumber': data.MobileNumber,
      'PhoneNumber': data.PhoneNumber,
      'LocationAddress': data.Address,
      'ActivityScope': data.ActivityScope,
      'RaiPartId': raiPart,
      'ContractorId': contractor,
      'IsComplete': isComplete,
      'Birth': moment(data.BirthDate, 'jYYYY/jM/jD').format('YYYY/M/D'),
    };
    return this.http.post(
      'http://rpmo.rai.ir/PWA/_api/web/lists/getbytitle(\'Users\')/items(' + id + ')',
      body,
      {headers: headers}
    );
  }

  sendAuthor(DigestValue: any, data: UserModel) {
    const headers = new HttpHeaders({
      'X-RequestDigest': DigestValue,
      'content-type': 'application/json;odata=verbose',
      'accept': 'application/json;odata=verbose',
    });
    const body = {
      '__metadata': {'type': 'SP.Data.AuthorsListItem'},
      'Title': data.Title,
      'User1Id': data.ID,
    };
    return this.http.post(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Authors\')/items',
      body,
      {headers: headers}
    );
  }

  sendPost(DigestValue: any, data, mainAuthor: number, authors: number[], docsFolder) {
    const headers = new HttpHeaders({
      'X-RequestDigest': DigestValue,
      'content-type': 'application/json;odata=verbose',
      'accept': 'application/json;odata=verbose',
    });
    const body = {
      '__metadata': {'type': 'SP.Data.PostsListItem'},
      'Title': data.Title,
      'MainAuthorId': mainAuthor,
      'PostTypeId': data.PostType,
      'StatusIdId': data.StatusId,
      'LessonLearnedTopicId': data.lessonLearnedTopic,
      'OperationKindId': data.OperationKind,
      'AuthorIdId': {'results': authors},
      'KMSContractId': data.KMSContract,
      'KMSTempContractId': data.Contract,
      'User1Id': this.userProfileData.ID,
      'Docs': docsFolder
    };
    return this.http.post(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Posts\')/items',
      body,
      {headers: headers}
    );
  }

  addComment(DigestValue: any, id: number, data: { Title, Desc }) {
    const headers = new HttpHeaders({
      'X-RequestDigest': DigestValue,
      'content-type': 'application/json;odata=verbose',
      'accept': 'application/json;odata=verbose',
    });
    console.log(data);
    console.log(id);
    console.log(this.userProfileData.ID);
    const body = {
      '__metadata': {'type': 'SP.Data.CommentsListItem'},
      'Title': data.Title,
      'Text': data.Desc,
      'User1Id': this.userProfileData.ID,
      'PostId': id,
    };
    return this.http.post(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Comments\')/items',
      body,
      {headers: headers}
    );
  }

  addQuestion(DigestValue: any, UserId: number, data: { Title, Desc, Posts }, postType: number, questionId: number = null) {
    const headers = new HttpHeaders({
      'X-RequestDigest': DigestValue,
      'content-type': 'application/json;odata=verbose',
      'accept': 'application/json;odata=verbose',
    });
    const body = {
      '__metadata': {'type': 'SP.Data.QuestionsAndAnswersListItem'},
      'Title': data.Title,
      'Body1': data.Desc,
      'User1Id': UserId,
      'PostTypeId': postType,
      'QuestionAndAnswerId': questionId
    };
    return this.http.post(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'QuestionsAndAnswers\')/items',
      body,
      {headers: headers}
    );
  }

  addQLLAssignments(DigestValue: any, postId: number, questionAndAnswer: number) {
    const headers = new HttpHeaders({
      'X-RequestDigest': DigestValue,
      'content-type': 'application/json;odata=verbose',
      'accept': 'application/json;odata=verbose',
    });
    const body = {
      '__metadata': {'type': 'SP.Data.QuestionLessonLearnedAssignmentsListItem'},
      'PostId': postId,
      'QuestionAndAnswerId': questionAndAnswer
    };
    return this.http.post(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'QuestionLessonLearnedAssignments\')/items',
      body,
      {headers: headers}
    );
  }

  approvePost(DigestValue: any, id: number, approvalStatus: number) {
    const headers = new HttpHeaders({
      'X-RequestDigest': DigestValue,
      'content-type': 'application/json;odata=verbose',
      'accept': 'application/json;odata=verbose',
      'IF-MATCH': '*',
      'X-HTTP-Method': 'MERGE'
    });
    const body = {
      '__metadata': {'type': 'SP.Data.PostsListItem'},
      'StatusIdId': approvalStatus,
    };
    return this.http.post(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Posts\')/items(' + id + ')',
      body,
      {headers: headers}
    );
  }

  getDataFromContextInfo() {
    const headers = new HttpHeaders({'ACCEPT': 'application/json;odata=verbose'});
    return this.http.post(
      'http://rpmo.rai.ir/PWA/kms/_api/contextinfo',
      '',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.GetContextWebInformation.FormDigestValue;
        return data;
      }
    ));
  }

  getDataFromContextInfoForDocs() {
    const headers = new HttpHeaders({'ACCEPT': 'application/json;odata=verbose'});
    return this.http.post(
      'http://rpmo.rai.ir/Docs/kms/_api/contextinfo',
      '',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.GetContextWebInformation.FormDigestValue;
        return data;
      }
    ));
  }

  deleteDoc(DigestValue: any, folderName) {
    const headers = new HttpHeaders({
      'X-RequestDigest': DigestValue,
      'content-type': 'application/json;odata=verbose',
      'accept': 'application/json;odata=verbose',
      'IF-MATCH': '*',
      'X-HTTP-Method': 'DELETE'
    });

    return this.http.post(
      'http://rpmo.rai.ir/Docs/kms/_api/web/GetFileByServerRelativeUrl(\'' + folderName + '\')',
      '',
      {headers: headers}
    );
  }

  buildFolder(DigestValue: any, folderName) {
    const headers = new HttpHeaders({
      'X-RequestDigest': DigestValue,
      'content-type': 'application/json;odata=verbose',
      'accept': 'application/json;odata=verbose',
    });

    const body = {
      '__metadata': {'type': 'SP.Folder'},
      'ServerRelativeUrl': '/Docs/kms/LessonLearneds/' + folderName
    };

    return this.http.post(
      'http://rpmo.rai.ir/Docs/kms/_api/web/folders',
      body,
      {headers: headers}
    );
  }

  uploadFile(DigestValue: any, body, fileName, folderName) {
    const headers = new HttpHeaders({
      'X-RequestDigest': DigestValue,
      'content-type': 'application/json;odata=verbose',
      'accept': 'application/json;odata=verbose',
    });

    const options = {
      headers: headers,
      reportProgress: true,
    };

    const req = new HttpRequest(
      'POST',
      'http://rpmo.rai.ir/Docs/kms/_api/web/GetFolderByServerRelativeUrl(\'LessonLearneds/' + folderName + '\')/Files/Add(url=\'' + fileName + '\', overwrite=true)',
      body,
      options);

    return this.http.request(req);

    // const body = {
    //   '__metadata': {'type': 'SP.Data.TempContractsListItem'},
    //   'Json_TempContract': JSON.stringify(this.stepFormsData),
    //   'Code_TempContract': this.stepFormsData.contractsForm.Code_Contract,
    //   'AccountUser_PM\Id': +this.stepFormsData.contractsForm.PMId_User,
    //   'ImporterId_TempContract': this.stepFormsData.contractsForm.Id_Importer,
    //   'PMOExpertId_TempContract\Id': this.stepFormsData.contractsForm.PMOExpertId_User
    // };
    // 'http://rpmo.rai.ir/PWA/kms/_api/web/GetFolderByServerRelativeUrl(\'LessonLearnedsDocs/' + id + '\')/Files',
    //   console.log(body);
    //   const id = 1;
    // return this.http.post(
    //   'http://rpmo.rai.ir/PWA/kms/_api/web/GetFolderByServerRelativeUrl(\'LessonLearnedsDocs/' + id + '\')/Files/Add(url=\'' + fileName + '\', overwrite=true)',
    //   body,
    //   {headers: headers}
    // );
  }

  getAllFiles(id: number) {
    const mainData: FileModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/Docs/kms/_api/web/GetFolderByServerRelativeUrl(\'LessonLearneds/' + id + '\')/Files',
      {headers: headers}
    ).pipe(map((response: Response) => {
        console.log(response);
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            new FileModel(
              data[i].Name,
              data[i].ServerRelativeUrl,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getContent(id: number) {
    let mainData: ContentModel;
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Contents\')/items?$filter=ID eq ' + id + '&$select=ID,Title,Body1,ContentKind/ID&$expand=ContentKind',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results[0];
        mainData = {
          ID: data.ID,
          Title: data.Title,
          ContentKind: data.ContentKind.Title,
          Body: data.Body1,
        };
        return mainData;
      }
    ));
  }

  getNewsFromContent(id: number) {
    const mainData: ContentModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Contents\')/items?$filter=ContentKindId eq ' + id + '&$select=ID,Title,Body1,ContentKind/ID&$expand=ContentKind',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            new ContentModel(
              data[i].ID,
              data[i].Title,
              data[i].ContentKind.ID,
              data[i].Body1,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getAllCriterias() {
    const mainData: CriteriasModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'LessonLearnedCriterias\')/items?$select=ID,Title,ScoreWeight',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            new CriteriasModel(
              data[i].ID,
              data[i].Title,
              data[i].ScoreWeight,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getAllContents() {
    const mainData: ContentModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Contents\')/items?$select=ID,Title,Body1,ContentKind/ID&$expand=ContentKind',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            new ContentModel(
              data[i].ID,
              data[i].Title,
              data[i].ContentKind.ID,
              data[i].Body1,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getAllJudgedsFromRefereePostAssignments() {
    const mainData: MyJudgePostModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'RefereePostAssignments\')/items?$select=ID,PostId,Score,User1Id,IsJudged&$top=10000',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            new MyJudgePostModel(
              data[i].ID,
              {
                ID: data[i].PostId,
                Created: null,
                Title: null,
                User: null,
                Contract: null,
              },
              data[i].Score,
              data[i].User1Id,
              data[i].IsJudged,
              null,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getAllJudges(id: number) {
    const mainData: KmsUserModel[] = [];
    let headers = new HttpHeaders();
    // 'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'KMSUsers\')/items?$select=ID,Title,User1/Title&$expand=User1Id',
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'KMSUsers\')/items?$filter=UserRole eq ' + id + ' or UserRole eq 1 &$select=ID,Title,User1Id',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            new KmsUserModel(
              data[i].ID,
              {
                ID: data[i].User1Id,
                Title: null,
              },
            )
          );
        }
        return mainData;
      }
    ));
  }

  getAllUsersName() {
    const mainData: { ID, Title }[] = [];
    let headers = new HttpHeaders();
    // 'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'KMSUsers\')/items?$select=ID,Title,User1/Title&$expand=User1Id',
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/_api/web/lists/getbytitle(\'Users\')/items?$select=ID, Title&$top=1000',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            {ID: data[i].ID, Title: data[i].Title}
          );
        }
        return mainData;
      }
    ));
  }

  getAllUsersRaiPart() {
    const mainData: { ID, RaiPart }[] = [];
    let headers = new HttpHeaders();
    // 'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'KMSUsers\')/items?$select=ID,Title,User1/Title&$expand=User1Id',
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/_api/web/lists/getbytitle(\'Users\')/items?$select=ID, RaiPartId&$top=1000',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            {ID: data[i].ID, RaiPart: data[i].RaiPartId}
          );
        }
        return mainData;
      }
    ));
  }

  getAllRaiParts() {
    const mainData: RaiPartsModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/_api/web/lists/getbytitle(\'RaiParts\')/items',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            new RaiPartsModel(
              data[i].ID,
              data[i].Title,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getLessonLearnedStep() {
    const mainData: LessonLearnedModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'LessonLearned\')/items?$select=ID,Post/Title,FullDescription,LessonLearnedStep/Title,LessonLearnedStep/ID&$expand=LessonLearnedStep,Post&$top=1000',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            new LessonLearnedModel(
              data[i].ID,
              {
                Title: data[i].Post.Title
              },
              data[i].FullDescription,
              {
                ID: data[i].LessonLearnedStep.ID,
                Title: data[i].LessonLearnedStep.Title
              },
            )
          );
        }
        return mainData;
      }
    ));
  }

  // getLessonLearnedFullDescription(searchedValue) {
  //   const mainData: LessonLearnedModel[] = [];
  //   let headers = new HttpHeaders();
  //   headers = headers.set('ACCEPT', 'application/json;odata=verbose');
  //   return this.http.get(
  //     'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'LessonLearned\')/items?$filter=((substringof(\'' + searchedValue + '\',ID)))&$select=ID,Post/Title,FullDescription,LessonLearnedStep/Title,LessonLearnedStep/ID&$expand=LessonLearnedStep,Post&$top=10000',
  //     {headers: headers}
  //   ).pipe(map((response: Response) => {
  //       const data = (<any>response).d.results;
  //       for (let i = 0; i < data.length; i++) {
  //         mainData.push(
  //           new LessonLearnedModel(
  //             data[i].ID,
  //             data[i].Post,
  //             data[i].FullDescription,
  //             {
  //               ID: data[i].LessonLearnedStep.ID,
  //               Title: data[i].LessonLearnedStep.Title
  //             },
  //           )
  //         );
  //       }
  //       return mainData;
  //     }
  //   ));
  // }
  getLessonLearnedFullDescription() {
    const mainData: LessonLearnedModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'LessonLearned\')/items?$select=ID,Post/Title,FullDescription,LessonLearnedStep/Title,LessonLearnedStep/ID&$expand=LessonLearnedStep,Post&$top=10000',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            new LessonLearnedModel(
              data[i].ID,
              data[i].Post,
              data[i].FullDescription,
              {
                ID: data[i].LessonLearnedStep.ID,
                Title: data[i].LessonLearnedStep.Title
              },
            )
          );
        }
        return mainData;
      }
    ));
  }

  getAllContractors() {
    const mainData: ContractorModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/_api/web/lists/getbytitle(\'Contractors\')/items',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            new ContractorModel(
              data[i].ID,
              data[i].Title,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getAllPositions() {
    const mainData: PositionModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/_api/web/lists/getbytitle(\'Positions\')/items',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            new PositionModel(
              data[i].ID,
              data[i].Title,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getAllEducationLevels() {
    const mainData: EducationLevelModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/_api/web/lists/getbytitle(\'EducationLevels\')/items',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            new EducationLevelModel(
              data[i].ID,
              data[i].Title,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getAllSubUnits() {
    const mainData: SubUnitModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/_api/web/lists/getbytitle(\'SubUnits\')/items?&$select=ID,Title,UnitId',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            new SubUnitModel(
              data[i].ID,
              data[i].Title,
              data[i].UnitId.results,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getAllUnits() {
    const mainData: UnitModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/_api/web/lists/getbytitle(\'Units\')/items',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            new UnitModel(
              data[i].ID,
              data[i].Title,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getUnit(id: number) {
    let mainData;
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/_api/web/lists/getbytitle(\'Units\')/items?$filter=ID eq ' + id + '&$select=Title',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results[0];
        mainData = {
          ID: id,
          Title: data.Title,
        };
        return mainData;
      }
    ));
  }

  getSubUnit(id: number) {
    let mainData;
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/_api/web/lists/getbytitle(\'SubUnits\')/items?$filter=ID eq ' + id + '&$select=Title',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results[0];
        mainData = {
          ID: id,
          Title: data.Title,
        };
        return mainData;
      }
    ));
  }

  getKMSUserRole(id: number) {
    let mainData;
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'KMSUsers\')/items?$filter=User1Id eq ' + id + '&$select=ID,UserRoleId',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results[0];
        if (data) {
          mainData = {
            ID: data.ID,
            Role: data.UserRoleId.results,
          };
        } else {
          mainData = null;
        }
        return mainData;
      }
    ));
  }

  getAllLikes(id: number) {
    let mainData = null;
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'PostLikes\')/items?$filter=PostId eq ' + id,
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        return data.length;
      }
    ));
  }

  getUserPostLike(id: number, post: number) {
    let mainData = null;
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'PostLikes\')/items?$filter=User1Id eq ' + id + ' and PostId eq ' + post,
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results[0];
        if (data) {
          mainData = {
            ID: data.ID,
          };
        }
        return mainData;
      }
    ));
  }

  getRaiPart(id: number) {
    let mainData;
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/_api/web/lists/getbytitle(\'RaiParts\')/items?$filter=ID eq ' + id + '&$select=Title',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results[0];
        mainData = {
          ID: id,
          Title: data.Title,
        };
        return mainData;
      }
    ));
  }

  getKMSContract(id: number) {
    let mainData: ContractModel;
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'KMSContracts\')/items?$filter=ID eq ' + id + '&$select=ID,Title,StartDate1,PMFullName,ContractorFullName,UnitId,SubUnitId,RaiPartId',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results[0];
        const date = moment(data.StartDate1.substring(0, 10), 'YYYY/M/D').format('jYYYY/jM/jD');

        mainData = {
          ID: data.ID,
          Title: data.Title,
          Unit: data.UnitId.results[0],
          SubUnit: data.SubUnitId,
          PM: data.PMFullName,
          StartDate: date,
          Contractor: data.ContractorFullName,
          RaiPart: data.RaiPartId,
          ContractType: 1,
        };
        return mainData;
      }
    ));
  }

  getAllContracts() {
    const mainData: ContractModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'KMSTempContracts\')/items?$select=ID,Title,UnitName,SubUnitName,StartDate,ContractorName&$top=1000',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            new ContractModel(
              data[i].ID,
              data[i].Title,
              data[i].UnitName,
              data[i].SubUnitName,
              null,
              data[i].StartDate,
              data[i].ContractorName,
              null,
              0,
            )
          );
        }
        return mainData;
      }
    ));
  }

  // getAllContracts() {
  //   const mainData: ContractModel[] = [];
  //   let headers = new HttpHeaders();
  //   headers = headers.set('ACCEPT', 'application/json;odata=verbose');
  //   return this.http.get(
  //     'http://rpmo.rai.ir/PWA/_api/web/lists/getbytitle(\'Contracts\')/items?$select=ID,Title,StartDate1,Unit/Title,SubUnit/Title,PM/ID,Contractor/Title,RaiPart/Title&$expand=Unit,SubUnit,PM,Contractor,RaiPart',
  //     {headers: headers}
  //   ).pipe(map((response: Response) => {
  //       const data = (<any>response).d.results;
  //       for (let i = 0; i < data.length; i++) {
  //         mainData.push(
  //           new ContractModel(
  //             data[i].ID,
  //             data[i].Title,
  //             data[i].Unit.results[0].Title,
  //             data[i].SubUnit.Title,
  //             data[i].PM.ID,
  //             data[i].StartDate1.substring(0, 10),
  //             data[i].Contractor.Title,
  //             data[i].RaiPart.Title,
  //           )
  //         );
  //       }
  //       console.log(data);
  //       console.log(mainData);
  //       return mainData;
  //     }
  //   ));
  // }

  getAllFileTypes() {
    const mainData: FileTypeModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'LessonLearnedFileTypes\')/items',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            new FileTypeModel(
              data[i].ID,
              data[i].Title,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getAllOperationKinds() {
    const mainData: OperationKindModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'OperationKinds\')/items',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            new OperationKindModel(
              data[i].ID,
              data[i].Title,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getAllUsers() {
    const mainData: UserModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/_api/web/lists/getbytitle(\'Users\')/items?$select=ID,Title&$top=1000',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            new UserModel(
              data[i].ID,
              data[i].Title,
              true,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getAllLessonLearnedSteps() {
    const mainData: LessonLearnedStepModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'LessonLearnedSteps\')/items',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            new LessonLearnedStepModel(
              data[i].ID,
              data[i].Title,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getAllLessonLearnedTopics() {
    const mainData: LessonLearnedTopicModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'LessonLearnedTopics\')/items',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push(
            new LessonLearnedTopicModel(
              data[i].ID,
              data[i].Title,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getLessonLearnedDesc(id: number) {
    let mainData: LessonLearnedDescModel;
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'LessonLearned\')/items?$filter=PostId eq ' + id + '&$select=ID,Title,Body1,Story,ProposedSolution,FullDescription,LessonLearnedStep/Title,LessonLearnedStep/ID&$expand=LessonLearnedStep',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results[0];
        mainData = {
          ID: data.ID,
          Post: id,
          Body: data.Body1,
          Story: data.Story,
          ProposedSolution: data.ProposedSolution,
          FullDescription: data.FullDescription,
          LessonLearnedStep: {
            ID: data.LessonLearnedStep.ID,
            Title: data.LessonLearnedStep.Title
          }
        };
        return mainData;
      }
    ));
  }

  getLessonLearned(id: number) {
    let mainData: PostModel;
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Posts\')/items?$filter=ID eq ' + id + '&$select=ID,Title,Docs,Score,PostType/Title,StatusId/Title,KMSContract/Title,KMSContract/ID,KMSTempContract/Title,KMSTempContract/ID,Post/Title,AuthorId/Title,MainAuthor/Title,LessonLearnedTopic/Title,LessonLearnedTopic/ID,OperationKind/ID,OperationKind/Title,Created&$expand=PostType,StatusId,KMSContract,KMSTempContract,Post,MainAuthor,LessonLearnedTopic,OperationKind,AuthorId',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results[0];
        let contractType = 0;
        if (data.KMSContract.ID) {
          contractType = 1;
        }
        let authors: string[] = [];
        for (let i = 0; i < data.AuthorId.results.length; i++) {
          authors.push(data.AuthorId.results[i].Title);
        }
        let date = null;
        let dateByTime = null;
        if (data.Created) {
          date = moment(data.Created.substring(0, 10), 'YYYY/M/D').format('jYYYY/jM/jD');
          dateByTime = data.Created.substring(0, 16).replace('T', ' ');
        }
        mainData = {
          ID: data.ID,
          Title: data.Title,
          ParentPost: data.Post.Title,
          Author: data.MainAuthor.Title,
          Authors: authors,
          MainScore: data.Score,
          PostType: data.PostType.Title,
          StatusId: data.StatusId.Title,
          Contract: {
            ID: data.KMSTempContract.ID,
            Title: data.KMSTempContract.Title
          },
          KMSContract: {
            ID: data.KMSContract.ID,
            Title: data.KMSContract.Title
          },
          CreatedDate: date,
          LessonLearnedTopic: {
            ID: data.LessonLearnedTopic.ID,
            Title: data.LessonLearnedTopic.Title,
          },
          OperationKind: {
            ID: data.OperationKind.ID,
            Title: data.OperationKind.Title,
          },
          CreatedDateByTime: dateByTime,
          Creator: null,
          RaiPart: null,
          Docs: data.Docs
        };
        return mainData;
      }
    ));
  }

  getAllComments(id: number) {
    const mainData: CommentModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Comments\')/items?$filter=PostId eq ' + id + '&$select=ID,Title,Text,Created,User1Id&$OrderBy=Created desc',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        // console.log(data);
        for (let i = 0; i < data.length; i++) {
          let date = null;
          // let dateByTime = null;
          if (data[i].Created) {
            date = moment(data[i].Created.substring(0, 10), 'YYYY/M/D').format('jYYYY/jM/jD');
            // dateByTime = data[i].Created.substring(0, 16).replace('T', ' ');
          }
          mainData.push(
            new CommentModel(
              data[i].ID,
              data[i].Title,
              id,
              {
                ID: data[i].User1Id,
                Title: ''
              },
              data[i].Text,
              date,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getRelatedQuestionAndLessonLearned(id: number) {
    const mainData: RelatedQuestionAndAnwserModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'QuestionLessonLearnedAssignments\')/items?$filter=PostId eq ' + id + '&$select=ID,Created,QuestionAndAnswer/ID,QuestionAndAnswer/Title&$expand=QuestionAndAnswer&$OrderBy=Created desc',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        // console.log(data);
        for (let i = 0; i < data.length; i++) {
          let date = null;
          // let dateByTime = null;
          if (data[i].Created) {
            date = moment(data[i].Created.substring(0, 10), 'YYYY/M/D').format('jYYYY/jM/jD');
            // dateByTime = data[i].Created.substring(0, 16).replace('T', ' ');
          }
          mainData.push(
            new RelatedQuestionAndAnwserModel(
              data[i].ID,
              +id,
              {
                ID: data[i].QuestionAndAnswer.ID,
                Title: data[i].QuestionAndAnswer.Title,
              },
              date,
            )
          );
        }
        console.log(mainData);
        return mainData;
      }
    ));
  }

  getRelatedQuestionAndLessonLearnedByQ(id: number) {
    const mainData: RelatedQuestionAndAnwserModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'QuestionLessonLearnedAssignments\')/items?$filter=QuestionAndAnswerId eq ' + id + '&$select=ID,Created,Post/ID,Post/Title&$expand=Post&$OrderBy=Created desc',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        // console.log(data);
        for (let i = 0; i < data.length; i++) {
          let date = null;
          // let dateByTime = null;
          if (data[i].Created) {
            date = moment(data[i].Created.substring(0, 10), 'YYYY/M/D').format('jYYYY/jM/jD');
            // dateByTime = data[i].Created.substring(0, 16).replace('T', ' ');
          }
          mainData.push(
            new RelatedQuestionAndAnwserModel(
              data[i].ID,
              +id,
              {
                ID: data[i].Post.ID,
                Title: data[i].Post.Title,
              },
              date,
            )
          );
        }
        console.log(mainData);
        return mainData;
      }
    ));
  }

  getAllQuestionAndAnswers(id: number) {
    const mainData: AnswerModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'QuestionsAndAnswers\')/items?$filter=QuestionAndAnswerId eq ' + id + 'or (ID eq ' + id + ')&$select=ID,Title,Created,User1Id,PostTypeId,IsBest,Body1&$OrderBy=Created asc',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        // console.log(data);
        for (let i = 0; i < data.length; i++) {
          let date = null;
          // let dateByTime = null;
          if (data[i].Created) {
            date = moment(data[i].Created.substring(0, 10), 'YYYY/M/D').format('jYYYY/jM/jD');
            // dateByTime = data[i].Created.substring(0, 16).replace('T', ' ');
          }
          mainData.push(
            new AnswerModel(
              data[i].ID,
              data[i].Body1,
              {
                ID: data[i].User1Id,
                Title: ''
              },
              date,
              data[i].IsBest,
              data[i].PostTypeId,
              data[i].Title,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getAllAnswers() {
    const mainData: AnswerModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'QuestionsAndAnswers\')/items?$filter=PostTypeId eq 2&$select=ID,Title,Created,User1Id,PostTypeId,IsBest,Body1&$OrderBy=Created asc',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        // console.log(data);
        for (let i = 0; i < data.length; i++) {
          let date = null;
          // let dateByTime = null;
          if (data[i].Created) {
            date = moment(data[i].Created.substring(0, 10), 'YYYY/M/D').format('jYYYY/jM/jD');
            // dateByTime = data[i].Created.substring(0, 16).replace('T', ' ');
          }
          mainData.push(
            new AnswerModel(
              data[i].ID,
              data[i].Body1,
              {
                ID: data[i].User1Id,
                Title: ''
              },
              date,
              data[i].IsBest,
              data[i].PostTypeId,
              data[i].Title,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getCurrentUser() {
    let mainData: CurrentUserModel = null;
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/Web/CurrentUser',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d;
        mainData = {
          Id: data.Id,
          LoginName: data.LoginName,
          IsSiteAdmin: data.IsSiteAdmin
        };
        return mainData;
      }
    ));
  }

  getTodayDateFromContextInfo() {
    const headers = new HttpHeaders({'ACCEPT': 'application/json;odata=verbose'});
    return this.http.post(
      'http://rpmo.rai.ir/PWA/kms/_api/contextinfo',
      '',
      {headers: headers}
    ).pipe(map((response: Response) => {
        let data = (<any>response).d.GetContextWebInformation.FormDigestValue;
        const first = data.substring(data.length - 50).split(',')[1];
        // console.log(new Date(first).toISOString());
        data = new Date(first).toISOString().substring(0, 16).replace('T', ' ');
        const todayFa = moment(data.substring(0, 10), 'YYYY/M/D').format('jYYYY/jM/jD');
        this.todayFaSubject.next(todayFa);
        this.todayFa = todayFa;
        return data;
      }
    ));
  }

  getAllLessonLearnedOfMine(id: number) {
    const mainData: PostModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Posts\')/items?$filter=User1Id eq ' + id + '&$select=ID,Title,Score,PostType/Title,StatusId/Title,KMSContract/Title,KMSContract/ID,KMSTempContract/Title,KMSTempContract/ID,Post/Title,MainAuthor/Title,Created&$expand=PostType,StatusId,KMSContract,KMSTempContract,Post,MainAuthor&$top=10000',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          let date = null;
          let dateByTime = null;
          if (data[i].Created) {
            date = moment(data[i].Created.substring(0, 10), 'YYYY/M/D').format('jYYYY/jM/jD');
            dateByTime = data[i].Created.substring(0, 16).replace('T', ' ');
          }
          mainData.push(
            new PostModel(
              data[i].ID,
              data[i].Title,
              data[i].Post.Title,
              data[i].MainAuthor.Title,
              null,
              +data[i].Score,
              data[i].PostType.Title,
              data[i].StatusId.Title,
              {
                ID: data[i].KMSTempContract.ID,
                Title: data[i].KMSTempContract.Title,
              },
              {
                ID: data[i].KMSContract.ID,
                Title: data[i].KMSContract.Title,
              },
              date,
              null,
              null,
              dateByTime,
            )
          );
        }
        return mainData;
      }
    ));
  }

  searchInLessonLearnedOfMyJudge(id: any, user: number) {
    console.log(id, user);
    const url = 'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'RefereePostAssignments\')/items?$filter=User1Id eq ' + user + 'and IsJudged eq false and PostId eq ' + id + '&$select=ID,Post/ID,Post/Created,Post/Title,Score,User1Id,IsJudged,Created&$expand=Post';
    const mainData: MyJudgePostModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      url,
      {headers: headers}
    ).pipe(map((response: Response) => {
        console.log(response);
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          let date = null;
          if (data[i].Post.Created) {
            date = moment(data[i].Post.Created.substring(0, 10), 'YYYY/M/D').format('jYYYY/jM/jD');
          }
          let date2 = null;
          if (data[i].Created) {
            date2 = moment(data[i].Created.substring(0, 10), 'YYYY/M/D').format('jYYYY/jM/jD');
          }
          mainData.push(
            new MyJudgePostModel(
              data[i].ID,
              {
                ID: data[i].Post.ID,
                Title: data[i].Post.Title,
                Created: date,
                User: null,
                Contract: null,
              },
              data[i].Score,
              data[i].User1Id,
              data[i].IsJudged,
              date2,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getAllLessonLearnedOfMyJudge(id: any, isJudged: boolean) {
    let url = 'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'RefereePostAssignments\')/items?$filter=User1Id eq ' + id + 'and IsJudged eq ' + isJudged + '&$select=ID,Post/ID,Post/Created,Post/Title,Score,User1Id,IsJudged,Created&$expand=Post';
    if (!isJudged) {
      url = 'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'RefereePostAssignments\')/items?$filter=User1Id eq ' + id + 'and IsJudged ne ' + !isJudged + '&$select=ID,Post/ID,Post/Created,Post/Title,Score,User1Id,IsJudged,Created&$expand=Post';
    }
    // id = ',' + id + ',';
    const mainData: MyJudgePostModel[] = [];
    let headers = new HttpHeaders();
    // 'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Posts\')/items?$filter=User1Id eq ' + id + ' and ' + 'StatusId eq ' + status + '&$select=ID,Title,MainScore,PostType/Title,StatusId/Title,KMSContract/Title,KMSContract/ID,KMSTempContract/Title,KMSTempContract/ID,Post/Title,MainAuthor/Title,Created&$expand=PostType,StatusId,KMSContract,KMSTempContract,Post,MainAuthor',
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      url,
      {headers: headers}
    ).pipe(map((response: Response) => {
        console.log(response);
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          let date = null;
          if (data[i].Post.Created) {
            date = moment(data[i].Post.Created.substring(0, 10), 'YYYY/M/D').format('jYYYY/jM/jD');
          }
          let date2 = null;
          if (data[i].Created) {
            date2 = moment(data[i].Created.substring(0, 10), 'YYYY/M/D').format('jYYYY/jM/jD');
          }
          mainData.push(
            new MyJudgePostModel(
              data[i].ID,
              {
                ID: data[i].Post.ID,
                Title: data[i].Post.Title,
                Created: date,
                User: null,
                Contract: null,
              },
              data[i].Score,
              data[i].User1Id,
              data[i].IsJudged,
              date2,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getTopJudgedLessonLearneds() {
    const mainData: { ID, Title, Created }[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Posts\')/items?$filter=StatusId eq 5&$select=ID,Title,Created&$OrderBy=Created desc&$top=3',
      {headers: headers}
    ).pipe(map((response: Response) => {
        console.log(response);
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          let date = null;
          if (data[i].Created) {
            date = moment(data[i].Created.substring(0, 10), 'YYYY/M/D').format('jYYYY/jM/jD');
          }
          mainData.push({
            ID: data[i].ID,
            Title: data[i].Title,
            Created: date
          });
        }
        return mainData;
      }
    ));
  }

  getAllPostLikes() {
    const mainData: { ID, PostId }[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'PostLikes\')/items?&$select=ID,PostId&$OrderBy=PostId desc&$top=10000',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push({
              ID: data[i].ID,
              PostId: data[i].PostId
            }
          );
        }
        return mainData;
      }
    ));
  }

  getTopLessonLearnedsLikes(id1: number) {
    const mainData: { Title }[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Posts\')/items?$filter=ID eq ' + id1 + '&$select=Title',
      {headers: headers}
    ).pipe(map((response: Response) => {
        console.log(response);
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push({
            Title: data[i].Title
          });
        }
        return mainData;
      }
    ));
  }

  getTopLessonLearneds() {
    const mainData: { ID, Title, Created }[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Posts\')/items?$filter=(StatusId ne 3) and (StatusId ne 2)&$select=ID,Title,Created&$OrderBy=Created desc&$top=3',
      {headers: headers}
    ).pipe(map((response: Response) => {
        console.log(response);
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          let date = null;
          if (data[i].Created) {
            date = moment(data[i].Created.substring(0, 10), 'YYYY/M/D').format('jYYYY/jM/jD');
          }
          mainData.push({
            ID: data[i].ID,
            Title: data[i].Title,
            Created: date
          });
        }
        return mainData;
      }
    ));
  }

  getTopLessonLearnedsForTopScores() {
    const mainData: { ID, Title, Score }[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Posts\')/items?$filter=(StatusId ne 3) and (StatusId ne 2)&$select=ID,Title,Score&$OrderBy=Score desc&$top=3',
      {headers: headers}
    ).pipe(map((response: Response) => {
        console.log(response);
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {

          mainData.push({
            ID: data[i].ID,
            Title: data[i].Title,
            Score: data[i].Score
          });
        }
        return mainData;
      }
    ));
  }

  getTopLessonLearnedsForTopScoresSort() {
    const mainData: PostModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Posts\')/items?$filter=(StatusId ne 3) and (StatusId ne 2)&$select=ID,Title,Score,PostType/Title,LessonLearnedTopic/ID,LessonLearnedTopic/Title,OperationKind/ID,OperationKind/Title,StatusId/Title,KMSContract/Title,User1Id,Post/Title,MainAuthor/Title,Created&$expand=PostType,StatusId,KMSContract,Post,MainAuthor,LessonLearnedTopic,OperationKind&$OrderBy=Score desc&$top=10000',
      {headers: headers}
    ).pipe(map((response: Response) => {
        console.log(response);
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          let date = null;
          if (data[i].Created) {
            date = moment(data[i].Created.substring(0, 10), 'YYYY/M/D').format('jYYYY/jM/jD');
          }
          mainData.push(
            new PostModel(
              data[i].ID,
              data[i].Title,
              data[i].Post.Title,
              data[i].MainAuthor.Title,
              null,
              data[i].Score,
              data[i].PostType.Title,
              data[i].StatusId.Title,
              null,
              data[i].KMSContract.Title,
              date,
              {
                ID: data[i].LessonLearnedTopic.ID,
                Title: data[i].LessonLearnedTopic.Title,
              },
              {
                ID: data[i].OperationKind.ID,
                Title: data[i].OperationKind.Title,
              },
              null,
              data[i].User1Id,
              null,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getAllPostLikeForSort() {
    const mainData: { ID, PostId }[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'PostLikes\')/items?&$select=ID,PostId&$OrderBy=PostId desc&$top=10000',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          mainData.push({
              ID: data[i].ID,
              PostId: data[i].PostId
            }
          );
        }
        return mainData;
      }
    ));
  }

  getTopQuestions() {
    const mainData: { ID, Title, Created }[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'QuestionsAndAnswers\')/items?$filter=PostTypeId eq 2&$select=ID,Title,Created&$OrderBy=Created desc&$top=3',
      {headers: headers}
    ).pipe(map((response: Response) => {
        console.log(response);
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          let date = null;
          if (data[i].Created) {
            date = moment(data[i].Created.substring(0, 10), 'YYYY/M/D').format('jYYYY/jM/jD');
          }
          mainData.push({
            ID: data[i].ID,
            Title: data[i].Title,
            Created: date
          });
        }
        return mainData;
      }
    ));
  }

  getAllLessonLearned() {
    const mainData: PostModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Posts\')/items?$filter=(StatusId ne 3) and (StatusId ne 2)&$select=ID,Title,Score,PostType/Title,LessonLearnedTopic/ID,LessonLearnedTopic/Title,OperationKind/ID,OperationKind/Title,StatusId/Title,KMSContract/Title,User1Id,Post/Title,MainAuthor/Title,Created&$expand=PostType,StatusId,KMSContract,Post,MainAuthor,LessonLearnedTopic,OperationKind&$OrderBy=Created desc&$top=10000',
      {headers: headers}
    ).pipe(map((response: Response) => {
        console.log(response);
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          let date = null;
          if (data[i].Created) {
            date = moment(data[i].Created.substring(0, 10), 'YYYY/M/D').format('jYYYY/jM/jD');
          }
          mainData.push(
            new PostModel(
              data[i].ID,
              data[i].Title,
              data[i].Post.Title,
              data[i].MainAuthor.Title,
              null,
              data[i].Score,
              data[i].PostType.Title,
              data[i].StatusId.Title,
              null,
              data[i].KMSContract.Title,
              date,
              {
                ID: data[i].LessonLearnedTopic.ID,
                Title: data[i].LessonLearnedTopic.Title,
              },
              {
                ID: data[i].OperationKind.ID,
                Title: data[i].OperationKind.Title,
              },
              null,
              data[i].User1Id,
              null,
            )
          );
        }
        console.log(mainData);
        this.posts = mainData;
        return mainData;
      }
    ));
  }

  getAllLessonLearnedForBests() {
    const mainData: PostModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Posts\')/items?$filter=(StatusId ne 3) and (StatusId ne 2)&$select=ID,Title,Score,Created&$expand=PostType desc&$top=10000',
      {headers: headers}
    ).pipe(map((response: Response) => {
        console.log(response);
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          let date = null;
          if (data[i].Created) {
            date = moment(data[i].Created.substring(0, 10), 'YYYY/M/D').format('jYYYY/jM/jD');
          }
          mainData.push(
            new PostModel(
              data[i].ID,
              data[i].Title,
              null,
              null,
              null,
              data[i].Score,
              null,
              null,
              null,
              null,
              date,
              null,
              null,
              null,
              null,
              null,
            )
          );
        }
        return mainData;
      }
    ));
  }

  getAllLessonLearnedCounts() {
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Posts\')/items?$filter=(StatusId ne 3) and (StatusId ne 2)&$select=ID&$top=10000',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        console.log(data);
        return data.length;
      }
    ));
  }

  getAllQuestionCounts() {
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'QuestionsAndAnswers\')/items?$filter=PostTypeId eq 2&$select=ID&$top=10000',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        console.log(data);
        return data.length;
      }
    ));
  }

  getAllJudgedCounts() {
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Posts\')/items?$filter=StatusId eq 5&$select=ID&$top=10000',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        console.log(data);
        return data.length;
      }
    ));
  }

  getAllUserCounts() {
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/_api/web/lists/getbytitle(\'Users\')/items?$filter=IsComplete ne false&$select=ID&$top=10000',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        console.log(data);
        return data.length;
      }
    ));
  }

  getAllFilteredUsers() {
    const mainData: UserAdminModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/_api/web/lists/getbytitle(\'Users\')/items?$filter=IsComplete ne false&$select=ID,Title,RaiPart/ID,RaiPart/Title,Contractor/ID,Contractor/Title,Educationlevel/ID,Educationlevel/Title,Position/ID,Position/Title,JobTitle1,Birth,IsComplete&$expand=RaiPart,Contractor,Educationlevel,Position&$top=1000&$OrderBy=IsComplete desc',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          let date = null;
          if (data[i].Birth) {
            date = moment(data[i].Birth, 'YYYY/M/D').format('jYYYY/jM/jD');
            const splitedDate = date.split('/');
            date = splitedDate[0] + '/' + this.addZeroToMonth(splitedDate[1]) + '/' + this.addZeroToMonth(splitedDate[1]);
          }
          mainData.push(
            new UserAdminModel(
              data[i].ID,
              data[i].Title,
              data[i].JobTitle1,
              date,
              data[i].IsComplete,
              {
                ID: data[i].Position.ID,
                Title: data[i].Position.Title,
              },
              {
                ID: data[i].RaiPart.ID,
                Title: data[i].RaiPart.Title,
              },
              {
                ID: data[i].Contractor.ID,
                Title: data[i].Contractor.Title,
              },
              {
                ID: data[i].Educationlevel.ID,
                Title: data[i].Educationlevel.Title,
              },
            )
          );
        }
        return mainData;
      }
    ));
  }

  getAllFilteredLessonLearned(id: number) {
    const mainData: PostModel[] = [];
    let headers = new HttpHeaders();
    headers = headers.set('ACCEPT', 'application/json;odata=verbose');
    return this.http.get(
      'http://rpmo.rai.ir/PWA/kms/_api/web/lists/getbytitle(\'Posts\')/items?$filter=StatusId eq ' + id + '&$select=ID,Title,MainScore,PostType/Title,StatusId/Title,KMSContract/Title,KMSContract/ID,User1Id,KMSTempContract/Title,KMSTempContract/ID,OperationKind/ID,OperationKind/Title,Post/Title,MainAuthor/Title,Created&$expand=PostType,StatusId,KMSContract,Post,MainAuthor,KMSTempContract,OperationKind&$top=10000',
      {headers: headers}
    ).pipe(map((response: Response) => {
        const data = (<any>response).d.results;
        for (let i = 0; i < data.length; i++) {
          let date = null;
          if (data[i].Created) {
            date = moment(data[i].Created.substring(0, 10), 'YYYY/M/D').format('jYYYY/jM/jD');
          }
          mainData.push(
            new PostModel(
              data[i].ID,
              data[i].Title,
              data[i].Post.Title,
              data[i].MainAuthor.Title,
              null,
              data[i].MainScore,
              data[i].PostType.Title,
              data[i].StatusId.Title,
              {
                ID: data[i].KMSTempContract.ID,
                Title: data[i].KMSTempContract.Title,
              },
              {
                ID: data[i].KMSContract.ID,
                Title: data[i].KMSContract.Title,
              },
              date,
              null,
              data[i].OperationKind.Title,
              null,
              data[i].User1Id,
            )
          );
        }
        return mainData;
      }
    ));
  }

  // getAllImporters() {
  //   const mainData2: ImporterList[] = [];
  //   let headers = new HttpHeaders();
  //   headers = headers.set('ACCEPT', 'application/json;odata=verbose');
  //   return this.http.get(
  //     'http://pmo.rai.ir/PO/References/_api/web/lists/getbytitle(\'Importers\')/items',
  //     {headers: headers}
  //   ).pipe(map((response: Response) => {
  //       const data = (<any>response).d.res ults;
  //       for (let i = 0; i < data.length; i++) {
  //         mainData2.push(
  //           new ImporterList(
  //             data[i].Id_Importer,
  //             data[i].Name_Importer,
  //             data[i].PossibleUnitIds_Importer.split(';'),
  //           )
  //         );
  //       }
  //       console.log(mainData2);
  //       return mainData2;
  //     }
  //   ));
  // }

  // getCurrentUser() {
  //   const headers = new HttpHeaders({
  //     'Authorization': this.apiToken,
  //     'content-type': 'application/json;odata=verbose',
  //     'accept': 'application/json;odata=verbose',
  //   });
  //   return this.http.get(
  //     'http://rpmo.rai.ir/_api/web/currentUser',
  //     {headers: headers}
  //   ).pipe(map((response: Response) => {
  //       console.log(response);
  //       return response;
  //     }
  //   ));
  // }

  //
  // getDataFromContextInfoRPMO() {
  //   const headers = new HttpHeaders({
  //     'Authorization': this.apiToken,
  //     'content-type': 'application/json;odata=verbose',
  //     'accept': 'application/json;odata=verbose',
  //   });
  //   return this.http.post(
  //     'http://rpmo.rai.ir/_api/contextinfo',
  //     '',
  //     {headers: headers},
  //   ).pipe(map((response: Response) => {
  //     console.log(response);
  //     const data = (<any>response).d.GetContextWebInformation.FormDigestValue;
  //       return data;
  //     },
  //   ));
  // }

  addZeroToMonth(month) {
    if (+month < 10) {
      return '0' + month;
    } else {
      return month;
    }
  }

  convertDateToMinutes(today) {
    const repToday = today.replace('-', ' ').replace('-', ' ').replace(':', ' ').split(' ');
    repToday[0] = +repToday[0] * 525600;
    repToday[1] = +repToday[1] * 43200;
    repToday[2] = +repToday[2] * 1440;
    repToday[3] = +repToday[3] * 60;
    const finalTodayByMinutes = +repToday[0] + +repToday[1] + +repToday[2] + +repToday[3] + +repToday[4];
    return finalTodayByMinutes;
  }
}
