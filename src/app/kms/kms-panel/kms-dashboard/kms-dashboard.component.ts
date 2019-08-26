import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KmsService } from '../../../shared/services/kms.service';
import * as Highcharts from 'highcharts';
import { PostModel } from '../../../shared/models/kms/Post.model';
import { RaiPartsModel } from '../../../shared/models/kms/RaiParts.model';
import { CurrentUserModel } from '../../../shared/models/kms/CurrentUser.model';
import { UserProfileDataModel } from '../../../shared/models/kms/UserProfileData.model';

@Component({
  selector: 'app-kms-dashboard',
  templateUrl: './kms-dashboard.component.html',
  styleUrls: ['./kms-dashboard.component.scss']
})
export class KmsDashboardComponent implements OnInit  {
  Highcharts = Highcharts;
  Highcharts2 = Highcharts;
  chartOptions = {};
  chartOptions2 = {};
  posts: PostModel[] = [];
  raiParts: RaiPartsModel[] = [];
  usersRaiPart: {ID, RaiPart} [] = [];
  showChart = false;
  showChart2 = false;
  userCounts: number;
  questionCounts: number;
  judgedCounts: number;
  lessonLearnedCounts: number;
  topLessonLearneds: {ID, Title, Created}[] = [];
  topQuestions: {ID, Title, Created}[] = [];
  topJudgedLessonLearneds: {ID, Title, Created}[] = [];
  currentUser: CurrentUserModel;
  userRole: { ID, Role: number[] } = null;

  constructor(private kmsService: KmsService,
                      private router: Router,) {
  }

  ngOnInit() {
    this.kmsService.getAllLessonLearned().subscribe(
      (posts: PostModel[]) => {
        this.posts = posts;
        this.setPostRaiPart();
      }
    );
    this.kmsService.getTopLessonLearneds().subscribe(
      (data: {ID, Title, Created}[]) => {
        this.topLessonLearneds = data;
      }
    );
    this.kmsService.getTopJudgedLessonLearneds().subscribe(
      (data: {ID, Title, Created}[]) => {
        this.topJudgedLessonLearneds = data;
      }
    );
    this.kmsService.getTopQuestions().subscribe(
      (data: {ID, Title, Created}[]) => {
        this.topQuestions = data;
      }
    );
    this.kmsService.getAllRaiParts().subscribe(
      (raiParts: RaiPartsModel[]) => {
        this.raiParts = raiParts;
        this.setPostRaiPart();
      }
    );
    this.kmsService.getAllUsersRaiPart().subscribe(
      (usersRaiPart) => {
        this.usersRaiPart = usersRaiPart;
        this.setPostRaiPart();
      }
    );
    this.kmsService.getCurrentUser().subscribe(
      (currentUser: CurrentUserModel) => {
        this.currentUser = currentUser;
        this.kmsService.getUserProfileDataWithIsComplete(this.currentUser.Id).subscribe(
          (data: UserProfileDataModel) => {
            this.currentUser = currentUser;
            this.kmsService.getKMSUserRole(this.kmsService.userProfileData.ID).subscribe(
              (data2: { ID, Role: number[] }) => {
                if (!data2) {
                  this.router.navigate(['']);
                } else {
                  this.userRole = data2;
                  if (this.userRole.Role[0] !== 2) {
                    this.kmsService.getAllUserCounts().subscribe(
                      (data) => {
                        this.userCounts = data;
                      }
                    );
                    this.kmsService.getAllLessonLearnedCounts().subscribe(
                      (data) => {
                        this.lessonLearnedCounts = data;
                      }
                    );
                    this.kmsService.getAllJudgedCounts().subscribe(
                      (data) => {
                        this.judgedCounts = data;
                      }
                    );
                    this.kmsService.getAllQuestionCounts().subscribe(
                      (data) => {
                        this.questionCounts = data;
                      }
                    );
                  } else {
                    this.router.navigate(['']);
                  }
                }
              }
            );
          }
        );
      }
    );
  }

  setPostRaiPart() {
    if (this.posts.length !== 0 && this.usersRaiPart.length !== 0 && this.raiParts.length !== 0) {
      this.posts.filter(v => {
        const userRai = this.usersRaiPart.filter(v2 => v2.ID === v.Creator)[0].RaiPart;
        if (userRai) {
          v.RaiPart = userRai;
        }
      });
      const data = [[]];
      const scores = [[]];
      const raiP = [];
      for (let i = 0; i < this.raiParts.length; i++) {
        data[i] = [];
        data[i].push(this.raiParts[i].Title, this.posts.filter(v => v.RaiPart === this.raiParts[i].ID).length);
        scores[i] = [];
        let sum = 0;
        let counter = 0;
        this.posts.filter(v => {
          if (v.RaiPart === this.raiParts[i].ID) {
            if (v.MainScore) {
              counter++;
              sum = (sum + v.MainScore) / counter;
            }
          }
        });
        scores[i].push(this.raiParts[i].Title, sum);
      }
      this.buildChart(data);
      this.buildChartScores(scores);
    }
  }

  buildChartScores(data) {
    this.chartOptions2 = {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        pointFormat: 'Count:  <b>{point.y}</b>'
      },
      series: [{
        name: 'Population',
        data: data,
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: '#FFFFFF',
          align: 'right',
          format: '{point.y:.1f}', // one decimal
          y: 10, // 10 pixels down from the top
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      }]
    };
    this.showChart2 = true;
  }

  buildChart(data) {
    this.chartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        pointFormat: 'Count:  <b>{point.y}</b>'
      },
      series: [{
        name: 'Population',
        data: data,
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: '#FFFFFF',
          align: 'right',
          format: '{point.y:.1f}', // one decimal
          y: 10, // 10 pixels down from the top
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      }]
    };
    this.showChart = true;
  }
}
