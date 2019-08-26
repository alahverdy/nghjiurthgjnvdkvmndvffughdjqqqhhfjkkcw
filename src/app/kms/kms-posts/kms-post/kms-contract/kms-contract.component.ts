import { Component, Inject, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { KmsService } from '../../../../shared/services/kms.service';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-kms-contract',
  templateUrl: './kms-contract.component.html',
  styleUrls: ['./kms-contract.component.scss']
})
export class KmsContractComponent implements OnInit  {


  constructor(private route: ActivatedRoute,
                      private kmsService: KmsService,
                      private router: Router,
              @Optional() @Inject(MAT_DIALOG_DATA) public passedData: any) {
  }

  ngOnInit() {
    // this.route.queryParams.subscribe(
    //   (params: Params) => {
    //     if (params.ID) {
    //       this.kmsService.getLessonLearned(params.ID).subscribe(
    //         (data: PostModel) => {
    //           this.post = data;
    //           this.kmsService.getLessonLearnedDesc(params.ID).subscribe(
    //             (data: LessonLearnedDescModel) => {
    //               this.postDesc = data;
    //             }
    //           );
    //         }
    //       );
    //     }
    //     console.log(params);
    //   }
    // );
    // this.kmsService.getAllLessonLearned().subscribe(
    //   (data: PostModel[]) => {
    //     this.posts = data;
    //   }
    // );
  }
}
