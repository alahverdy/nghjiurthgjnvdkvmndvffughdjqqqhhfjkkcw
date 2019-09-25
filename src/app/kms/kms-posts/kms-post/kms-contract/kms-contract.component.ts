import {Component, Inject, OnInit, Optional} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {KmsService} from '../../../../shared/services/kms.service';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {PostModel} from '../../../../shared/models/kms/Post.model';
import {ContractModel} from '../../../../shared/models/kms/Contract.model';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-kms-contract',
  templateUrl: './kms-contract.component.html',
  styleUrls: ['./kms-contract.component.scss']
})
export class KmsContractComponent implements OnInit {
  post: PostModel;
  contract: ContractModel;

  constructor(private route: ActivatedRoute, private dialog: MatDialog,
              private kmsService: KmsService,
              private router: Router, private spinner: NgxSpinnerService,
              @Optional() @Inject(MAT_DIALOG_DATA) public passedData: any) {
  }

  ngOnInit() {
    this.spinner.show();
    this.kmsService.getKMSContract(+this.passedData).subscribe(
      (datad: ContractModel) => {
        this.contract = datad;
        this.kmsService.getUnit(+this.contract.Unit).subscribe(
          (dataa: { ID, Title }) => this.contract.Unit = dataa.Title
        );
        this.kmsService.getSubUnit(+this.contract.SubUnit).subscribe(
          (dataa: { ID, Title }) => this.contract.SubUnit = dataa.Title
        );
        this.kmsService.getRaiPart(+this.contract.RaiPart).subscribe(
          (dataa: { ID, Title }) => {
            this.contract.RaiPart = dataa.Title;
            this.spinner.hide();
          }
        );
      }, error1 => {
      });
    // this.route.queryParams.subscribe(
    //   (params: Params) => {
    //     if (params.ID) {
    // this.kmsService.getLessonLearned(params.ID).subscribe(
    //   (data: PostModel) => {
    //     this.post = data;
    //     // this.kmsService.getLessonLearnedDesc(params.ID).subscribe(
    //     //   (data: LessonLearnedDescModel) => {
    //     //     this.postDesc = data;
    //     //   }
    //     // );
    //   }
    // );
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  //     console.log(this.passedData);
  //   }
  // );
  // this.kmsService.getAllLessonLearned().subscribe(
  //   (data: PostModel[]) => {
  //     this.posts = data;
  //   }
  // );
  // }
}
