import { Component, OnInit } from '@angular/core';
import { reportInfo } from '../interfaces/reportInfo';
import { ReportBuilderService } from '../Services/report-builder.service';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import {ShareDataComponentsService} from 'src/app/Services/share-data-components.service';
import {feidsInfo} from 'src/app/interfaces/FieldsInfo';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  selectedFields: string[] = [];
  whereList: string[] = [];
  reportResponse: reportInfo[] = [];
  tableCols: string[] = [];
  tableData: any = {};
  fileName = 'ExcelSheet.xlsx'; 
  fiedsInfoModel :feidsInfo = {}; 
  constructor(private _reportBuilderService:ReportBuilderService, private toastr: ToastrService, private _shareDataComponentsService:ShareDataComponentsService) { 
    this.selectedFields =  this._shareDataComponentsService.getFields();
    this.whereList =  this._shareDataComponentsService.getWhereList();
    if (this.selectedFields.length > 0) {
        this.ReportApiResponse();
         localStorage.setItem('selectFields' ,JSON.stringify(this.selectedFields));
         localStorage.setItem('whereList' ,JSON.stringify(this.whereList));
  
     }

     else{
        this.selectedFields = JSON.parse(localStorage.getItem('selectFields'));
        this.whereList = JSON.parse(localStorage.getItem('whereList'));
        if (this.selectedFields.length > 0) {
          this.ReportApiResponse();
        }
      
     }
  }

  ngOnInit(): void {
  
 
}



ReportApiResponse() {
  this.reportResponse = [];
  this.tableCols = [];
  this.tableData = [];
  this.fiedsInfoModel.PropInfo = this.selectedFields;
  this.fiedsInfoModel.WhereList = this.whereList;
  this._reportBuilderService.GenerateFieldsReporst(this.fiedsInfoModel).subscribe((res: any) => {
    if (res.code === 1) {
      this.tableCols = this.fiedsInfoModel.PropInfo;
      this.reportResponse = res.data;
     this.tableData= res.data;
     
    }
  }
  );
}


// table data show in excel form 
exportexcel(): void {
   
  let element = document.getElementById('reportTable');
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, this.fileName);

}

}
