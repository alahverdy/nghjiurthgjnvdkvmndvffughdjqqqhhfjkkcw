import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kms-footer',
  templateUrl: './kms-footer.component.html',
  styleUrls: ['./kms-footer.component.scss']
})
export class KmsFooterComponent implements OnInit  {

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  onClickNormalPage(page) {
    this.router.navigate([page]);
  }

  onClickItem(page) {
    this.router.navigate(['page'], {queryParams: {ID: page}});
  }
}
