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
  SelectedFields: string[] = [];
  tableCols: string[] = [];
  isTableShow = false;
  searchText;
  obj: { [key: string]: string | number | any } = {};
  fileName = 'ExcelSheet.xlsx';
  Fiedslist: tableColsNames[] = [];
  constructor(private _reportBuilderService: ReportBuilderService, private toastr: ToastrService) {

  }

  ngOnInit(): void {
   this.GetTablesColsNames();
  }
  GenerateReport() {
    if (this.SelectedFields.length > 0) {

      this.ReportApiResponse();
      this.FilterTableColAndData();
    }

  }
  ReportApiResponse() {
    this.reportResponse = [];
    this._reportBuilderService.GenerateFieldsReporst(this.SelectedFields).subscribe((res: any) => {
      if (res.code === 1) {
        this.tableCols = this.SelectedFields;
        this.reportResponse = res.data;
      }
    }
    );
  }

  GetTablesColsNames() {
    this._reportBuilderService.GetTablesColumnsNames().subscribe((res: any) => {
      if (res.code === 1) {

        let emp = {
          text: 'Employee',
          nodes: res.employeeCols,
        }
        this.Fiedslist.push(emp);

        let dptNodes = res.departmentCols;
        const i = dptNodes.indexOf('EmployeId');
        if (i > -1) {
          dptNodes.splice(i, 1);
          let dpt = {
            text: 'Department',
            nodes: dptNodes,
          }
          this.Fiedslist.push(dpt)
        }

        let ctyNodes = res.cityCols;
        const i1 = ctyNodes.indexOf('EmployeId');
        if (i > -1) {
          ctyNodes.splice(i, 1);
          let cty = {
            text: 'City',
            nodes: ctyNodes,
          }
          this.Fiedslist.push(cty)
        }


        let cntyNodes = res.countryCols;
        const i2 = cntyNodes.indexOf('EmployeId');
        if (i2 > -1) {
          cntyNodes.splice(i, 1);
          let cntry = {
            text: 'Country',
            nodes: cntyNodes
          }
          this.Fiedslist.push(cntry)
        }


      }
    }
    );
  }
  FilterTableColAndData(): void {
    this.tableData = [];
    setTimeout(() => {
      for (let i = 0; i <= this.reportResponse.length; i++) {
        for (let j = 0; j <= this.SelectedFields.length; j++) {

          if (this.SelectedFields[j] === 'EmployeName') {
            this.obj['EmployeName'] = this.reportResponse[i].EmployeName;

          } else if (this.SelectedFields[j] === 'EmployeDescription') {
            this.obj['EmployeDescription'] = this.reportResponse[i].EmployeDescription;

          }
          else if (this.SelectedFields[j] === 'JoinDate') {
            // .toString().split('T')[0]
            this.obj['JoinDate'] = this.reportResponse[i].JoinDate;

          }

          else if (this.SelectedFields[j] === 'cityName') {
            this.obj['CityName'] = this.reportResponse[i].CityName;
          }



          else if (this.SelectedFields[j] === 'CountryName') {
            this.obj['CountryName'] = this.reportResponse[i].EmployeDescription;

          }


          else if (this.SelectedFields[j] === 'DepartmentName') {
            this.obj['DepartmentName'] = this.reportResponse[i].DepartmentName;

          }

          else if (this.SelectedFields[j] === 'EmployeId') {
            this.obj['EmployeId'] = this.reportResponse[i].EmployeId;
          }

          else if (this.SelectedFields[j] === 'DepartmentId') {
            this.obj['DepartmentId'] = this.reportResponse[i].DepartmentId;
          }

          else if (this.SelectedFields[j] === 'CityId') {
            this.obj['CityId'] = this.reportResponse[i].CityId;
          }

          else if (this.SelectedFields[j] === 'CountryId') {
            this.obj['CountryId'] = this.reportResponse[i].CountryId;
          }



        }

        this.tableData.push(this.obj);
        this.obj = [];
      }
    }, 1000);

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
    let isVal = this.SelectedFields.find(o => o === data);
    if (isVal === undefined)
      this.SelectedFields.push(data);
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
    const index = this.SelectedFields.indexOf(item);
    if (index > -1) {
      this.SelectedFields.splice(index, 1);
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
