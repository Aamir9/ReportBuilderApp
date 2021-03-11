import { Component, OnInit } from '@angular/core';
import { ReportBuilderService } from '../Services/report-builder.service';
import { reportInfo } from 'src/app/interfaces/reportInfo';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';


interface tableColsNames {
  text?: string,
  nodes?: Array<string>
}


@Component({
  selector: 'app-drag-fields',
  templateUrl: './drag-fields.component.html',
  styleUrls: ['./drag-fields.component.css']
})
export class DragFieldsComponent implements OnInit {

  tableData: any[] = [];
  reportResponse: reportInfo[] = [];
  selectedFields: string[] = [];
  
  tableCols: string[] = [];
  isTableShow = false;
  searchText;
  obj: { [key: string]: string | number | any } = {};
  fileName = 'ExcelSheet.xlsx';
  fiedslist: tableColsNames[] = [];
  constructor(private _reportBuilderService: ReportBuilderService, private toastr: ToastrService) {

  }

  ngOnInit(): void {
   this.GetTablesColsNames();
  }
  GenerateReport() {
    if (this.selectedFields.length > 0) {
        this.ReportApiResponse();
        this.FilterTableColAndData();
    }

  }
  ReportApiResponse() {
    this.reportResponse = [];
    this.tableCols = [];
    this._reportBuilderService.GenerateFieldsReporst(this.selectedFields).subscribe((res: any) => {
      if (res.code === 1) {
        this.tableCols = this.selectedFields;
        this.reportResponse = res.data;
      }
    }
    );
  }

  GetTablesColsNames() {
    this._reportBuilderService.GetTablesColumnsNames().subscribe((res: any) => {
      if (res.code === 1) {

        let emp = {
          text: res.employee[1],
          nodes: res.employee[0],
        }
        this.fiedslist.push(emp);

        
         let dpt = {
            text: res.department[1],
            nodes: res.department[0],
          }
          this.fiedslist.push(dpt)
        

          let cty = { 
            text: res.city[1],
            nodes:  res.city[0],
          }
          this.fiedslist.push(cty)
        
          let cntry = {
            text: res.countryCols[0],
            nodes: res.countryCols[1],
          }
          this.fiedslist.push(cntry)
       
      }
    }
    );
  }
  FilterTableColAndData(): void {
    this.tableData = [];
    setTimeout(() => {
      for (let i = 0; i <= this.reportResponse.length; i++) {
        for (let j = 0; j <= this.selectedFields.length; j++) {

          if (this.selectedFields[j] === 'EmployeName') {
            this.obj['EmployeName'] = this.reportResponse[i].EmployeName;

          } else if (this.selectedFields[j] === 'EmployeDescription') {
            this.obj['EmployeDescription'] = this.reportResponse[i].EmployeDescription;

          }
          else if (this.selectedFields[j] === 'JoinDate') {
            this.obj['JoinDate'] = this.reportResponse[i].JoinDate;

          }

          else if (this.selectedFields[j] === 'CityName') {
            this.obj['CityName'] = this.reportResponse[i].CityName;
          }
         else if (this.selectedFields[j] === 'CountryName') {
            this.obj['CountryName'] = this.reportResponse[i].CountryName;

          }
         else if (this.selectedFields[j] === 'DepartmentName') {
            this.obj['DepartmentName'] = this.reportResponse[i].DepartmentName;

          }

          else if (this.selectedFields[j] === 'EmployeId') {
            this.obj['EmployeId'] = this.reportResponse[i].EmployeId;
          }

          else if (this.selectedFields[j] === 'DepartmentId') {
            this.obj['DepartmentId'] = this.reportResponse[i].DepartmentId;
          }

          else if (this.selectedFields[j] === 'CityId') {
            this.obj['CityId'] = this.reportResponse[i].CityId;
          }

          else if (this.selectedFields[j] === 'CountryId') {
            this.obj['CountryId'] = this.reportResponse[i].CountryId;
          }



        }

        this.tableData.push(this.obj);
        this.obj = [];
      }
    }, 200);

    this.isTableShow = true;
  }


  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('reportTable');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }

  DisplayTreeView(event) {

    if (event.target.classList.contains('fa-caret-down')) {
      event.target.classList.add('fa-caret-right');
      event.target.classList.remove('fa-caret-down');
      event.srcElement.nextElementSibling.classList.remove('Treeactive');
    } else {

      event.target.classList.add('fa-caret-down');
      event.target.classList.remove('fa-caret-right');
      event.srcElement.nextElementSibling.classList.add('Treeactive');
    }


  }

  dropItem(ev) {
    this.isTableShow = false;
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    let isVal = this.selectedFields.find(o => o === data);
    if (isVal === undefined)
      this.selectedFields.push(data);
    else
      this.showInfo(isVal + ' ' + 'aready exist');
  }

  allowDrop(ev) {
    ev.preventDefault();
  }
  drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }


  RemoveItemFromSectedList(item) {
    this.isTableShow = false;
    const index = this.selectedFields.indexOf(item);
    if (index > -1) {
      this.selectedFields.splice(index, 1);
      this.showSuccess('Removed ' + ' ' + item);
    }

  }
  showInfo(message) {
    this.toastr.info(message, 'Note !');
  }

  showSuccess(message: string) {

    this.toastr.success(message, 'Success !');
  }


}
