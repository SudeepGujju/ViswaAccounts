import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from 'app/modules/alert';
import { GlService } from '../gl.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { animate, query, style, transition, trigger, group } from '@angular/animations';
// import { trigger, state, transition, animate, animateChild, query, style, keyframes } from '@angular/animations';

// const left = [
//   query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
//   group([
//     query(':enter', [style({ transform: 'translateX(-100%)' }), animate('.3s ease-out', style({ transform: 'translateX(0%)' }))], {
//       optional: true,
//     }),
//     query(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(100%)' }))], {
//       optional: true,
//     }),
//   ]),
// ];

// const right = [
//   query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
//   group([
//     query(':enter', [style({ transform: 'translateX(100%)' }), animate('.3s ease-out', style({ transform: 'translateX(0%)' }))], {
//       optional: true,
//     }),
//     query(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(-100%)' }))], {
//       optional: true,
//     }),
//   ]),
// ];

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss'],
  // animations:[
  //   // trigger('runChildAnims', [
  //   //     transition('* <=> void', [
  //   //         query("@*", [animateChild()])
  //   //     ]),
  //   // ]),
  //   trigger('slideInRight', [
  //     transition(":enter",[
  //       animate("1s", keyframes(
  //         [
  //           style({transform: 'translateX(100%)', 'visibility': 'visible' , offset: 0}),
  //           style({transform: 'translateX(0)', offset: 1}),
  //         ])
  //       )
  //     ]),
  //     transition(":leave",[
  //       animate("1s", keyframes(
  //         [
  //           style({transform: 'translateX(0)', offset: 0}),
  //           style({visibility: 'hidden', : 'translateX(-100%)', offset: 1}),
  //         ])
  //       )
  //     ])
  //   ])
  // ]
  // animations: [
  //   trigger('slideInOut',[
  //     transition(':enter', [
  //       style({ transform: 'translateX(+200%)' }),
  //       animate('0.5s ease-out', style({ transform: 'translateX(0)' }))
  //     ]),
  //     transition(':leave', [
  //         animate('0.5s ease-out', style({ transform: 'translateX(-200%)' }))
  //     ])
  //   ])
  // ]
  // animations: [
  //   trigger('animSlider', [
  //     transition(':increment', right),
  //     transition(':decrement', left),
  //   ]),
  // ],
})
export class FinancialComponent implements OnInit {

  @ViewChild(MatPaginator) set matPaginator(paginator) {
    if (paginator) {
      this.financialListDS.paginator = paginator;
    }
  }

  @ViewChild(MatSort) set matSort(sort) {
    if (sort) {
      this.financialListDS.sort = sort;
    }
  }

  public columnsToDisplay: string[] = [
    'DbCode',
    'DbAccName',
    'DbAmount',
    'CrCode',
    'CrAccName',
    'CrAmount',
  ];

  public footerColumnsToDisplay: string[] = [
    'Profit',
    'ProfitAmount',
    'Loss',
    'LossAmount'
  ];

  public currentReport = 0; // 0- ,1- ,2- ,3- ,4-
  public currentReportName = '';
  public nextStageName = '';
  public previousStageName = '';

  public profitLabel = '';
  public profitAmount = '';
  public lossLabel = '';
  public lossAmount = '';

  public closingStock = '0.00';
  public financialListDS: MatTableDataSource<any>;

  public totalCredit = '';
  public totalDebit = '';
  public grossLoss = '';
  public grossProfit = '';
  public netLoss = '';
  public netProfit = '';

  constructor(private glSrvc: GlService, private alrtSrvc: AlertService) { }

  ngOnInit() {
    this.financialListDS = new MatTableDataSource<any>();

    this.gotoReport();
  }

  getTradingList() {
    this.glSrvc.getTradingList(this.closingStock).subscribe(
      (resp: any) => {
        this.financialListDS.data = this.formatData(resp.tradingList);
        this.totalDebit = resp.totalDebit;
        this.totalCredit = resp.totalCredit;
        this.grossProfit = resp.grossProfit;
        this.grossLoss = resp.grossLoss;

        this.profitLabel = 'Gross Profit';
        this.profitAmount = '' + this.grossProfit;
        this.lossLabel = 'Gross Loss';
        this.lossAmount = '' + this.grossLoss;

        this.footerColumnsToDisplay = [
          'Profit',
          'ProfitAmount',
          'Loss',
          'LossAmount'
        ];

      },
      (error) => {
        this.alrtSrvc.showErrorAlert(error);
      }
    );
  }

  getProfitNLossList() {

    this.glSrvc.getProfitNLossList(this.grossLoss, this.grossProfit).subscribe(
      (resp: any) => {
        this.financialListDS.data = this.formatData(resp.profitNLossList);
        this.totalDebit = resp.totalDebit;
        this.totalCredit = resp.totalCredit;
        this.netProfit = resp.netProfit;
        this.netLoss = resp.netLoss;

        this.profitLabel = 'Net Profit';
        this.profitAmount = '' + this.netProfit;
        this.lossLabel = 'Net Loss';
        this.lossAmount = '' + this.netLoss;

        this.footerColumnsToDisplay = [
          'Profit',
          'ProfitAmount',
          'Loss',
          'LossAmount'
        ];

      },
      (error) => {
        this.alrtSrvc.showErrorAlert(error);
      }
    );
  }

  getBalanceSheetList() {

    this.glSrvc.getBalanceSheetList(this.closingStock).subscribe(
      (resp: any) => {
        this.financialListDS.data = this.formatData(resp.balanceSheetList);

        this.totalDebit = resp.totalDebit;
        this.totalCredit = resp.totalCredit;

        this.profitLabel = this.profitAmount = this.lossLabel = this.lossAmount = '';

        this.footerColumnsToDisplay = [];
      },
      (error) => {
        this.alrtSrvc.showErrorAlert(error);
      }
    );
  }

  formatData(records: any[]) {
    return records;
  }

  gotoReport() {

    switch (this.currentReport) {
      case 0: {

        this.currentReportName = '';
        this.previousStageName = '';

        this.nextStageName = 'Trading';

        break;
      }
      case 1: {
        this.currentReportName = 'Trading';

        this.previousStageName = 'Change Closing Stock';
        this.nextStageName = 'Profit And Loss';

        this.getTradingList();

        break;
      }
      case 2: {
        this.currentReportName = 'Profit And Loss';

        this.nextStageName = 'Balance Sheet';
        this.previousStageName = 'Trading';

        this.getProfitNLossList();

        break;
      }
      case 3: {
        this.currentReportName = 'Balance Sheet';

        this.nextStageName = '';
        this.previousStageName = 'Profit And Loss';

        this.getBalanceSheetList();

        break;
      }
    }

  }

  goToNextStage(){

    this.currentReport = this.currentReport + 1;
    this.gotoReport();

  }

  goToPreviousStage(){

    this.currentReport = this.currentReport - 1;
    this.gotoReport();

  }

}
