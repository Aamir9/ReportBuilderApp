import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ReportBuilderService } from '../Services/report-builder.service';
import { reportInfo } from 'src/app/interfaces/reportInfo';
import * as XLSX from 'xlsx'; 
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

@Component({
  selector: 'app-drag-fields',
  templateUrl: './drag-fields.component.html',
  styleUrls: ['./drag-fields.component.css']
})
export class DragFieldsComponent implements OnInit {
  Employee:  [
    {name: 'Employe Name'},
    {name: 'employe Description'},
    {name: 'join Date'},
  ]

  Department :[
    {name: 'Department Name'},
  ]

  City :[
    {name: 'City Name'},
  ]

  Country :[
    {name: 'Country Name'},
  ]

  Fields: string[] = [
    'employeName',
    'employeDescription',
    'joinDate',
    'departmentName',
    'cityName',
    'countryName',
    'departmentId',
    'employeId',
    'countryId',
    'cityId',
    
  ];

  tableData: any[] = [];
  reportResponse: reportInfo[] = [];
  SelectedFields: string[] = [];
  tableCols: string[] = [];
  isTableShow = false;
  searchText;
  obj: { [key: string]: string | number | any } = {};
  fileName= 'ExcelSheet.xlsx';
  constructor(private _reportBuilderService: ReportBuilderService) { }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>) {
    this.isTableShow = false;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  GenerateReport() {
    if (this.SelectedFields.length > 0) {

      this.ReportApiResponse();
      this.FilterTableColAndData();
    }

  }


  ReportApiResponse() {
    this.reportResponse = [];
    this._reportBuilderService.GenerateFieldsReporst().subscribe((res: any) => {
      if (res.code === 1) {
        this.tableCols = this.SelectedFields;
        this.reportResponse = res.data;
      }
    }
    );
  }

  FilterTableColAndData(): void {
    this.tableData = [];
    setTimeout(() => {
      for (let i = 0; i <= this.reportResponse.length; i++) {
        for (let j = 0; j <= this.SelectedFields.length; j++) {

          if (this.SelectedFields[j] === 'employeName') {
            this.obj['employeName'] = this.reportResponse[i].employeName;

          }  else if (this.SelectedFields[j] === 'employeDescription') {
            this.obj['employeDescription'] = this.reportResponse[i].employeDescription;

          }
          else if (this.SelectedFields[j] === 'joinDate') {
            // .toString().split('T')[0]
            this.obj['joinDate'] = this.reportResponse[i].joinDate;

          }

          else if (this.SelectedFields[j] === 'cityName') {
            this.obj['cityName'] = this.reportResponse[i].cityName;
          }

         

          else if (this.SelectedFields[j] === 'countryName') {
            this.obj['countryName'] = this.reportResponse[i].employeDescription;
            
          }


          else if (this.SelectedFields[j] === 'departmentName') {
            this.obj['departmentName'] = this.reportResponse[i].departmentName;
            
          }

          else if (this.SelectedFields[j] === 'employeId') {
            this.obj['employeId'] = this.reportResponse[i].employeId;
          }

          else if (this.SelectedFields[j] === 'departmentId') {
            this.obj['departmentId'] = this.reportResponse[i].departmentId;
          }

          else if (this.SelectedFields[j] === 'cityId') {
            this.obj['cityId'] = this.reportResponse[i].cityId;
          }

          else if (this.SelectedFields[j] === 'countryId') {
            this.obj['countryId'] = this.reportResponse[i].countryId;
          }

         

        }

        this.tableData.push(this.obj);
        this.obj= [];
      }
    }, 1000);

    this.isTableShow = true;
  }


  exportexcel(): void 
    {
       /* table id is passed over here */   
       let element = document.getElementById('reportTable'); 
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, this.fileName);
			
    }


}
