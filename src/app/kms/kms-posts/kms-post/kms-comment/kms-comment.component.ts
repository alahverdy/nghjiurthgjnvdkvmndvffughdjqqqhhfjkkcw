import { Component, Input, OnInit } from '@angular/core';
import { KmsService } from '../../../../shared/services/kms.service';
import { CommentModel } from '../../../../shared/models/kms/Comment.model';

@Component({
  selector: 'app-kms-comment',
  templateUrl: './kms-comment.component.html',
  styleUrls: ['./kms-comment.component.scss']
})
export class KmsCommentComponent implements OnInit  {
  @Input() postID;
  @Input() comment: CommentModel;

  constructor(private kmsService: KmsService) {}

  ngOnInit() {
    this.kmsService.getUserTitle(this.comment.User.ID).subscribe(
      (data) => {
        this.comment.User.Title = data.Title;
      }
    );
  }
}
