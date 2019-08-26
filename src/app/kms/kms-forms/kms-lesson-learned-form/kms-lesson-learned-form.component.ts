import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map, startWith, subscribeOn, takeUntil} from 'rxjs/internal/operators';
import {KmsService} from '../../../shared/services/kms.service';
import {LessonLearnedTopicModel} from '../../../shared/models/kms/LessonLearnedTopic.model';
import {LessonLearnedStepModel} from '../../../shared/models/kms/LessonLearnedStep.model';
import {OperationKindModel} from '../../../shared/models/kms/OperationKind.model';
import {Observable, ReplaySubject, Subject} from 'rxjs/index';
import {ContractModel} from '../../../shared/models/kms/Contract.model';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {MatDialog, MatSelect} from '@angular/material';
import {KmsAddContractFormComponent} from './kms-add-contract-form/kms-add-contract-form.component';
import {isUndefined} from 'util';
import {PostModel} from '../../../shared/models/kms/Post.model';
import {LessonLearnedDescModel} from '../../../shared/models/kms/LessonLearnedDesc.model';
import {KmsAddAuthorFormComponent} from './kms-add-author-form/kms-add-author-form.component';
import {UserProfileDataModel} from '../../../shared/models/kms/UserProfileData.model';
import {UserModel} from '../../../shared/models/kms/User.model';
import Swal from 'sweetalert2';
import {ChangeEvent} from '@ckeditor/ckeditor5-angular/ckeditor.component';
import {CurrentUserModel} from '../../../shared/models/kms/CurrentUser.model';
import {FileTypeModel} from '../../../shared/models/kms/FileType.model';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {FileModel} from '../../../shared/models/kms/File.model';
import {take} from 'rxjs/operators';

export interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-kms-lesson-learned-form',
  templateUrl: './kms-lesson-learned-form.component.html',
  styleUrls: ['./kms-lesson-learned-form.component.scss']
})
export class KmsLessonLearnedFormComponent implements OnInit, OnDestroy, AfterViewInit {
  public formGp: FormGroup;
  @ViewChild('search') search;
  @ViewChild('Story') Story;
  lessonLearnedTopics: LessonLearnedTopicModel[];
  lessonLearnedSteps: LessonLearnedStepModel[];
  operationKinds: OperationKindModel[];
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];
  filteredOptionsPM: Observable<any[]>;
  projectManagers = [{Name: 'aaaa', ID: 2222}];
  defaultContracts: ContractModel[] = [];
  contracts: ContractModel[] = [];
  selectedContract: ContractModel;
  AddContractShow = false;
  public Editor = ClassicEditor;
  public model = {
    editorData: ''
  };
  public model2 = {
    editorData: ''
  };
  public model3 = {
    editorData: ''
  };
  ckConfig = {toolbar: ['heading', '|', 'bold', 'italic', 'link', 'Bulletedlist', 'Numberedlist', 'Blockquote', 'Inserttable', 'Undo', 'Redo']};

  postEdit: PostModel;
  postEditDesc: LessonLearnedDescModel;
  checking = false;
  bankMultiCtrl = new FormControl();
  bankMultiFilterCtrl = new FormControl();
  contractMultiCtrl = new FormControl();
  contractMultiFilterCtrl = new FormControl();
  banks: any[] = [
    {name: 'علی مهدوی', id: 'A'},
    {name: 'اکبر اکبری', id: 'B'},
    {name: 'حسن حسنی', id: 'C'},
    {name: 'مریم مریمی', id: 'D'},
    {name: 'عجب عجبی', id: 'E'},
  ];
  public filteredBanksMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('multiSelect') multiSelect: MatSelect;
  public filteredContract: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('singleSelect') singleSelect: MatSelect;
  private _onDestroy = new Subject<void>();
  users: UserModel[] = [];
  userProfileData: UserProfileDataModel;
  fileTypes: FileTypeModel[] = [];
  todayByMinutes;
  pValue;
  buttonStatus = false;
  docsFolder = null;
  documents: FileModel[] = [];

  constructor(
    private kmsService: KmsService,
    private router: Router,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog, private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.kmsService.getTodayDateFromContextInfo().subscribe(
      (today) => {
        this.todayByMinutes = this.kmsService.convertDateToMinutes(today);
      }
    );
    // this.bankMultiCtrl.setValue([this.banks[10], this.banks[11], this.banks[12]]);
    // listen for search field value changes
    this.bankMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanksMulti();
      });

    const url = this.router.url.split('?');
    let postID = null;
    if (url[1]) {
      postID = +url[1].replace(/[^0-9]/g, '');
    }
    this.kmsService.getAllOperationKinds().subscribe(
      (data: OperationKindModel[]) => {
        this.operationKinds = data;
      }
    );
    this.kmsService.getAllLessonLearnedTopics().subscribe(
      (data: LessonLearnedTopicModel[]) => {
        this.lessonLearnedTopics = data;
      }
    );
    this.kmsService.getAllLessonLearnedSteps().subscribe(
      (data: LessonLearnedStepModel[]) => {
        this.lessonLearnedSteps = data;
      }
    );
    this.kmsService.getAllUsers().subscribe(
      (data: UserModel[]) => {
        this.users = data;
        this.filteredBanksMulti.next(this.users.slice());
      }
    );
    this.kmsService.getAllFileTypes().subscribe(
      (data: FileTypeModel[]) => {
        this.fileTypes = data;
      }
    );

    this.kmsService.getAllContracts().subscribe(
      (datae: ContractModel[]) => {
        this.defaultContracts = datae;
        // set initial selection
        this.contractMultiCtrl.setValue(this.defaultContracts[10]);

        // load the initial bank list
        this.filteredContract.next(this.defaultContracts.slice());

        // listen for search field value changes
        this.contractMultiFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterBanks();
          });
        console.log(this.defaultContracts);
        if (url[0] === '/post/edit') {
          this.kmsService.getLessonLearned(postID).subscribe(
            (data: PostModel) => {
              this.docsFolder = data.Docs;
              this.kmsService.getAllFiles(data.Docs).subscribe(
                (dataa2: FileModel[]) => {
                  this.documents = dataa2;
                }
              );
              const dd = this.kmsService.convertDateToMinutes(data.CreatedDateByTime);
              const dd2 = (+this.todayByMinutes - +dd) / 60;
              if (+dd2 < 48) {
                this.postEdit = data;
                if (!isUndefined(this.postEdit.KMSContract.ID)) {
                  this.kmsService.getKMSContract(+this.postEdit.KMSContract.ID).subscribe(
                    (datad: ContractModel) => {
                      this.editForm(datad, postID, 1);
                    }
                  );
                } else {
                  const contract = this.defaultContracts.filter(v => v.ID === this.postEdit.Contract.ID)[0];
                  this.editForm(contract, postID, 0);
                }
              } else {
                this.router.navigate(['']);
              }
            }
          );
          this.setInitialValue();

        } else {
          this.checking = true;
          this.buildForm();
        }
      }
    );

  }

  ngAfterViewInit() {
  }


  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.filteredContract
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: ContractModel, b: ContractModel) => a && b && a.ID === b.ID;
      });
  }

  protected filterBanks() {
    if (!this.defaultContracts) {
      return;
    }
    // get the search keyword
    let search1 = this.contractMultiFilterCtrl.value;
    if (!search1) {
      this.filteredContract.next(this.defaultContracts.slice());
      return;
    } else {
      console.log(search1)
      search1 = search1.toLowerCase();
      console.log(search1)
    }
    // filter the banks
    this.filteredContract.next(
      this.defaultContracts.filter(defaultContracts => defaultContracts.Title.toLowerCase().indexOf(search1) > -1)
    );
  }

  private filterBanksMulti() {
    if (!this.users) {
      return;
    }
    // get the search keyword
    let search = this.bankMultiFilterCtrl.value;
    if (!search) {
      this.filteredBanksMulti.next(this.users.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanksMulti.next(
      this.users.filter(bank => bank.Title.replace(/ي/g, 'ی').replace(/ك/g, 'ک').toLowerCase().indexOf(search.replace(/ي/g, 'ی').replace(/ك/g, 'ک')) > -1)
    );
  }

  editForm(data, postID, contractType: number) {
    this.selectedContract = data;
    if (contractType === 1) {
      this.kmsService.getUnit(+data.Unit).subscribe(
        (dataa: { ID, Title }) => this.selectedContract.Unit = dataa.Title
      );
      this.kmsService.getSubUnit(+data.SubUnit).subscribe(
        (dataa: { ID, Title }) => this.selectedContract.SubUnit = dataa.Title
      );
      this.kmsService.getRaiPart(+data.RaiPart).subscribe(
        (dataa: { ID, Title }) => this.selectedContract.RaiPart = dataa.Title
      );
    }
    this.kmsService.getLessonLearnedDesc(postID).subscribe(
      (postDesc: LessonLearnedDescModel) => {
        this.postEditDesc = postDesc;
        this.checking = true;
        this.buildForm(1);
      }
    );
  }

  onDeleteDoc(file: FileModel) {
    Swal({
      title: 'آیا مطمئن هستید که می خواهید حذف شود؟',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'بله، حذف شود!',
      cancelButtonText: 'خیر، حذف نشود!'
    }).then((result) => {
      if (result.value) {
        this.kmsService.getDataFromContextInfoForDocs().subscribe(
          (digestValue) => {
            this.kmsService.deleteDoc(digestValue, file.ServerRelativeUrl).subscribe(
              (data) => {
                this.documents.filter((v, index) => {
                  if (v === file) {
                    Swal(
                      'فایل با موفقیت حذف گردید!',
                    );
                    this.documents.splice(index, 1);
                  }
                });
              }
            );
          }
        );
      }
    });

  }

  getFileBuffer(file, folderName) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = (e: any) => {
      console.log(e.target.result);
      console.log(reader, 1);
      console.log(reader, 2);
      this.sendFile(e.target.result, file, folderName);
    };
    reader.onerror = function (e: any) {
      console.log(e.target.error);
    };
    // return reader.readAsArrayBuffer(file);
  }

  sendFile(daa, file, folderName) {
    console.log(daa.byteLength);
    if (daa.byteLength < 10000000) {
      this.kmsService.getDataFromContextInfoForDocs().subscribe(
        (digestValue) => {
          this.kmsService.uploadFile(digestValue, daa, file.name, folderName).subscribe(
            (event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                const percentDone = Math.round(100 * event.loaded / event.total);
                this.buttonStatus = true;
                this.pValue = percentDone;
                if (this.pValue === 100) {
                  // if (this.postEdit) {
                  this.documents.push({
                    Name: file.name,
                    ServerRelativeUrl: '/docs/kms/LessonLearneds/' + folderName + '/' + file.name,
                  });
                  // }
                  Swal({
                    title: 'فایل ها با موفقیت ارسال شدند!',
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'متوجه شدم!',
                  });
                  this.buttonStatus = false;
                }
              } else if (event instanceof HttpResponse) {
              }
            });
        }
      );
    } else {
      Swal({
        title: 'محدودیت حجم فایل : 10Mb',
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'متوجه شدم!',
      });
    }
  }

  onUploadFile(eve) {
    const file = eve.srcElement.files[0];
    const splitedFileName = file.name.split('.');
    const fileType = splitedFileName[splitedFileName.length - 1].toLocaleLowerCase();
    console.log(this.fileTypes);
    const checkFileTypeIsValid = this.fileTypes.filter(v => v.Title.toLocaleLowerCase() === fileType).length;
    if (checkFileTypeIsValid === 0) {
      Swal({
        title: 'فرمت فایل قابل قبول نیست!',
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'متوجه شدم!',
      });
    } else {
      this.kmsService.getDataFromContextInfoForDocs().subscribe(
        (digestValue) => {
          console.log(digestValue);
          if (this.docsFolder) {
            this.getFileBuffer(file, this.docsFolder);
          } else {
            const folderName = Math.floor((Math.random() * 100000) + 1);
            this.docsFolder = folderName;
            this.kmsService.buildFolder(digestValue, folderName).subscribe(
              (da: any) => {
                console.log(da.d.ItemCount);
                if (da.d.ItemCount === 0) {
                  this.getFileBuffer(file, folderName);
                } else {
                  Swal({
                    title: ' Error 306: اطلاعات دارای اشکال هستند!',
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonText: 'متوجه شدم!',
                  });
                }
              }
            );
          }
        }
      );
      // this.kmsService.getDataFromContextInfo().subscribe(
      //   (digestValue) => {
      //     this.kmsService.uploadFile(digestValue, this.getFileBuffer(file), file.name).subscribe(
      //       (data) => {
      //         Swal({
      //           title: 'فایل ها با موفقیت ارسال شدند!',
      //           type: 'success',
      //           showCancelButton: false,
      //           confirmButtonText: 'متوجه شدم!',
      //         });
      //       }
      //     );
      //   }
      // );
    }
  }

  onContractSearch(e) {
    this.selectedContract = null;
    const value = e.srcElement.value.replace(/ي/g, 'ی').replace(/ك/g, 'ک');
    if (value !== '') {
      this.contracts = this.defaultContracts.filter(v => v.Title.replace(/ي/g, 'ی').replace(/ك/g, 'ک').indexOf(value) >= 0);
    } else {
      this.contracts = [];
    }
  }

  onAddAuthor() {
    const data = {id: 2};
    const dialogRef = this.dialog.open(KmsAddAuthorFormComponent, {
      width: '700px',
      height: '700px',
      data: {name: data},
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (isUndefined(result)) {
        } else {
          const contractForm = result;
          result = result.value;
          if (contractForm.valid) {
            this.users.push({
              Title: result.Name + ' ' + result.LastName,
              ID: 10000,
              IsUser: false,
            });
            this.filterBanksMulti();
            let aT = [];
            if (this.formGp.get('Author').value !== null) {
              aT = this.formGp.get('Author').value;
            }
            const authors = aT;
            authors.push(this.users[this.users.length - 1]);
            this.bankMultiCtrl.setValue(authors);
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

  onSelectionChange() {
    this.formGp.get('mainAuthor').setValue(null);
  }

  onAddContractt() {
    const data = {id: 2};
    const dialogRef = this.dialog.open(KmsAddContractFormComponent, {
      width: '700px',
      height: '700px',
      data: {name: data},
    });
    dialogRef.afterClosed().subscribe(
      (result: any) => {
        if (isUndefined(result) || result === '') {
        } else {
          const contractForm = result;
          result = result.value;
          console.log(contractForm);
          if (contractForm.valid) {
            this.selectedContract = {
              ID: 0,
              Title: result.Title,
              Unit: result.Units.filter(v => +v.ID === +result.Unit)[0].Title,
              SubUnit: result.SubUnits.filter(v => +v.ID === +result.SubUnit)[0].Title,
              PM: result.Pm,
              Contractor: result.Contractor,
              RaiPart: result.RaiParts.filter(v => +v.ID === +result.RaiPart)[0].Title,
              StartDate: result.StartDate,
              ContractType: 1,
            };
            const kmsContract = {
              ID: 0,
              Title: result.Title,
              Unit: +result.Unit,
              SubUnit: +result.SubUnit,
              PM: result.Pm,
              Contractor: result.Contractor,
              RaiPart: +result.RaiPart,
              StartDate: result.StartDate,
              ContractType: 1,
            };
            this.kmsService.getDataFromContextInfo().subscribe(
              (DigestValue) => {
                this.kmsService.sendKMSContracts(DigestValue, kmsContract).subscribe(
                  (data: any) => {
                    this.selectedContract.ID = data.d.ID;
                  }
                );
              }
            );
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
    // this.AddContractShow = true;
  }

  onContractClick(contract: ContractModel) {
    this.selectedContract = contract;
    this.formGp.get('searching').setValue(null);
    this.contracts = [];
  }

  onCloseDialog(e) {
    this.AddContractShow = false;
    if (e !== false) {
      this.selectedContract = e;
    }
  }

  onAddPost() {
    this.formGp.get('Story').setValue(this.model.editorData);
    this.formGp.get('FullDescription').setValue(this.model2.editorData);
    this.formGp.get('ProposedSolution').setValue(this.model3.editorData);
    this.formGp.get('Title').setValue(this.formGp.get('Title').value.replace(/ي/g, 'ی').replace(/ك/g, 'ک'));
    let validation = false;
    if (this.formGp.valid && (this.selectedContract !== null)) {
      if (this.selectedContract.ContractType === 0) {
        this.formGp.get('Contract').setValue(this.selectedContract.ID);
      } else {
        this.formGp.get('KMSContract').setValue(this.selectedContract.ID);
      }
      validation = true;
    }
    if (validation) {
      this.kmsService.getDataFromContextInfo().subscribe(
        (DigestValue) => {
          let counter = 0;
          let mainAuthorID;
          let AuthorsID = [];
          for (let i = 0; i < this.formGp.get('Author').value.length; i++) {
            this.kmsService.sendAuthor(DigestValue, this.formGp.get('Author').value[i]).subscribe(
              (mainAuthor: any) => {
                if (this.formGp.get('Author').value[i].Title === this.formGp.get('mainAuthor').value.Title) {
                  mainAuthorID = mainAuthor.d.ID;
                }
                AuthorsID.push(mainAuthor.d.ID);
                counter++;
                if (counter === this.formGp.get('Author').value.length) {
                  this.kmsService.sendPost(DigestValue, this.formGp.value, mainAuthorID, AuthorsID, this.docsFolder).subscribe(
                    (data: any) => {
                      this.formGp.get('Post').setValue(data.d.ID);
                      this.kmsService.sendPostDesc(DigestValue, this.formGp.value).subscribe(
                        (data2) => {
                          this.router.navigate(['post'], {queryParams: {ID: data.d.ID}, queryParamsHandling: 'merge'});
                        }
                      );
                    }
                  );
                }
              }
            );
          }
        }
      );
    } else {
      Swal({
        title: 'اطلاعات دارای اشکال هستند!',
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'متوجه شدم!',
      });
    }
  }


  onUpdatePost() {
    this.formGp.get('Story').setValue(this.model.editorData);
    this.formGp.get('FullDescription').setValue(this.model2.editorData);
    this.formGp.get('ProposedSolution').setValue(this.model3.editorData);
    this.formGp.get('Title').setValue(this.formGp.get('Title').value.replace(/ي/g, 'ی').replace(/ك/g, 'ک'));
    if (this.selectedContract.ContractType === 0) {
      this.formGp.get('Contract').setValue(this.selectedContract.ID);
    } else {
      this.formGp.get('KMSContract').setValue(this.selectedContract.ID);
    }
    this.kmsService.getDataFromContextInfo().subscribe(
      (DigestValue) => {
        let counter = 0;
        let mainAuthorID;
        let AuthorsID = [];
        for (let i = 0; i < this.formGp.get('Author').value.length; i++) {
          this.kmsService.sendAuthor(DigestValue, this.formGp.get('Author').value[i]).subscribe(
            (mainAuthor: any) => {
              if (this.formGp.get('Author').value[i].Title === this.formGp.get('mainAuthor').value.Title) {
                mainAuthorID = mainAuthor.d.ID;
              }
              AuthorsID.push(mainAuthor.d.ID);
              counter++;
              if (counter === this.formGp.get('Author').value.length) {
                this.kmsService.updatePost(DigestValue, this.formGp.value, this.postEdit.ID, mainAuthorID, AuthorsID, this.docsFolder).subscribe(
                  (data) => {
                    this.formGp.get('Post').setValue(this.postEdit.ID);
                    this.kmsService.updatePostDesc(DigestValue, this.formGp.value, this.postEditDesc.ID).subscribe(
                      (data2) => {
                        this.router.navigate(['post'], {queryParams: {ID: this.postEdit.ID}, queryParamsHandling: 'merge'});
                      }
                    );
                  }
                );
              }
            }
          );
        }
      }
    );
  }

  buildForm(type: number = 0) {
    let title = null;
    let lessonLearnedTopic = null;
    let lessonLearnedStep = null;
    let operationKind = null;
    let story = null;
    let fullDescription = null;
    let proposedSolution = null;
    if (type === 1) {
      title = this.postEdit.Title;
      lessonLearnedTopic = this.postEdit.LessonLearnedTopic.ID;
      lessonLearnedStep = this.postEditDesc.LessonLearnedStep.ID;
      operationKind = this.postEdit.OperationKind.ID;
      story = this.postEditDesc.Story;
      fullDescription = this.postEditDesc.FullDescription;
      proposedSolution = this.postEditDesc.ProposedSolution;
      // this.selectedContract = this.contracts.filter(v => +v.ID === +this.postEdit.KMSContract.ID)[0];
    }
    this.formGp = this._formBuilder.group({
      Title: new FormControl(title, [Validators.required]),
      lessonLearnedTopic: new FormControl(lessonLearnedTopic, [Validators.required]),
      lessonLearnedStep: new FormControl(lessonLearnedStep, [Validators.required]),
      OperationKind: new FormControl(operationKind, [Validators.required]),
      PMId_User: new FormControl(null),
      Story: new FormControl(null, [Validators.required, Validators.minLength(100), Validators.maxLength(3000)]),
      searching: new FormControl(null),
      FullDescription: new FormControl(null, [Validators.required, Validators.minLength(100), Validators.maxLength(3000)]),
      ProposedSolution: new FormControl(null, [Validators.required, Validators.minLength(100), Validators.maxLength(3000)]),
      StatusId: new FormControl(3, [Validators.required]),
      PostType: new FormControl(1, [Validators.required]),
      Author: this.bankMultiCtrl,
      mainAuthor: new FormControl(null, [Validators.required]),
      KMSContract: new FormControl(null),
      Contract: new FormControl(null),
      Post: new FormControl(null),
    });
    if (type === 1) {
      this.model.editorData = story;
      this.model2.editorData = fullDescription;
      this.model3.editorData = proposedSolution;
      const authors: string[] = this.postEdit.Authors;
      const selectedAuthors = [];
      for (let i = 0; i < authors.length; i++) {
        const filteredUser = this.users.filter(v => v.Title === authors[i]);
        if (filteredUser.length > 0) {
          selectedAuthors.push(filteredUser[0]);
        }
      }
      // authors.push(this.users[this.users.length - 1]);
      this.bankMultiCtrl.setValue(selectedAuthors);
      this.formGp.get('mainAuthor').setValue(selectedAuthors.filter(v => v.Title === this.postEdit.Author)[0]);
      this.setInitialValue();
    }
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
