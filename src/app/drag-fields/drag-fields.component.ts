
import { Component, OnInit } from '@angular/core';
import { ReportBuilderService } from '../Services/report-builder.service';
import { reportInfo } from 'src/app/interfaces/reportInfo';
import { ToastrService } from 'ngx-toastr';
import { ShareDataComponentsService } from 'src/app/Services/share-data-components.service';
import { Router } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';

interface tableColsNames {
  text?: string,
  nodes?: Array<string>
}

interface ColsInfo {
  propertyName: string,
  propertyType: string
}

@Component({
  selector: 'app-drag-fields',
  templateUrl: './drag-fields.component.html',
  styleUrls: ['./drag-fields.component.css']
})
export class DragFieldsComponent implements OnInit {

  tableData: any = {};
  reportResponse: reportInfo[] = [];
  selectedFields: string[] = [];
  whereFields: string[] = [];
  tableCols: string[] = [];
  searchText;
  obj: { [key: string]: string | number | any } = {};
  fileName = 'ExcelSheet.xlsx';
  fiedslist: tableColsNames[] = [];
  btnDisable = true;
  numberOperators: string[] = [];
  stringOperators: string[] = [];
  boleanOperators: string[] = [];
  dateOperators: string[] = [];
  propName = "";
  exp = "";
  whereCondtionsList: string [] = [];
  constructor(private router: Router, private _reportBuilderService: ReportBuilderService, private toastr: ToastrService, private _shareDataComponentsService: ShareDataComponentsService) {

  }
  ngOnInit(): void {
    this.GetTablesColsNames();
  }

  CreateReport() {
    let fields:string[]= [];
    let v = "";
    this.selectedFields.forEach(element => {
       v = element.replace(/\:+[a-z A-Z]*/gi,"");
       v = v.trim();
       fields.push(v);
      
    });    
    this._shareDataComponentsService.addFields(fields);
    this._shareDataComponentsService.addWhereList(this.whereCondtionsList);
    this.router.navigateByUrl('/report');
  }

  GetTablesColsNames() {
    this._reportBuilderService.GetTablesColumnsNames().subscribe((res: any) => {
      if (res.code === 1) {

       let emp = {
          text: res.employee[0].tblName,
          nodes: this.IteratePropInfo(res.employee[0].colInfo)

        }
        this.fiedslist.push(emp);


        let dpt = {
          text: res.department[0].tblName,
          nodes: this.IteratePropInfo(res.department[0].colInfo),
        }
        this.fiedslist.push(dpt)


        let cty = {
          text: res.city[0].tblName,
          nodes: this.IteratePropInfo(res.city[0].colInfo),
        }
        this.fiedslist.push(cty)

        let cntry = {
          text: res.country[0].tblName,
          nodes: this.IteratePropInfo(res.country[0].colInfo),
        }
        this.fiedslist.push(cntry)

      }
    }
    );
  }


  IteratePropInfo(data: ColsInfo[]): string[] {

    let clInfo: string[] = [];
    for (let index = 0; index < data.length; index++) {
      clInfo.push(data[index].propertyName + ':' + data[index].propertyType);
    }

    return clInfo;
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

    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    let isVal = this.selectedFields.find(o => o === data);
    if (isVal === undefined)
      this.selectedFields.push(data);
    else
      this.showInfo(isVal + ' ' + 'aready exist');

    this.disabledBtnFunction();
  }

  dropItemWhereArea(ev) {

    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    let isVal = this.whereFields.find(o => o === data);
    if (isVal === undefined) {
         this.GetOperatorsApiCall(data);
         this.whereFields.push(data);   
    }
    else {
      this.showInfo(isVal + ' ' + 'aready exist');
    }

  }

  allowDrop(ev) {
    ev.preventDefault();
  }
  drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  RemoveItemFromSectedList(item) {
    const index = this.selectedFields.indexOf(item);
    if (index > -1) {
      this.selectedFields.splice(index, 1);
      this.showSuccess('Removed ' + ' ' + item);
    }
    this.disabledBtnFunction();

  }

  RemoveItemWhereList(item) {
    const index = this.whereFields.indexOf(item);
    if (index > -1) {
      this.whereFields.splice(index, 1);
      this.showSuccess('Removed ' + ' ' + item);
    }

  }
  showInfo(message) {
    this.toastr.info(message, 'Note !');
  }

  showSuccess(message: string) {

    this.toastr.success(message, 'Success !');
  }

  disabledBtnFunction() {
    if (this.selectedFields.length > 0) {
      this.btnDisable = false;
    }
    else {
      this.btnDisable = true;
    }
  }

  GetOperatorsApiCall(body: string) {

    this._reportBuilderService.GetOperators(body).subscribe((res: any) => {
      if (res.code === 1) {
        if (res.dataType === 'number') {
          this.numberOperators = res.data;
        }
        else if (res.dataType === 'string') {
          this.stringOperators = res.data;
        }
        else if (res.dataType === 'bool') {
          this.boleanOperators = res.data;
        }
        else if (res.dataType === 'date') {
          this.dateOperators = res.data;
        }

      }
    });
  }

  // check is number type data
  IsNumberTypeProp(item): boolean {
    return item.includes(':number');
  }

  // check is string or  char type data
  IsStringTypeProp(item): boolean {
    return item.includes(':string');
  }


  // check is bool or boolea or  char type data
  IsBoolTypeProp(item): boolean {
    return item.includes(':bool');
  }


  // check is date or time or  char type data
  IsDateTypeProp(item): boolean {
    return item.includes(':date');
  }


  selectChange(event,item){
    //  var elment:any = document.getElementById("tblEmployes.EmployeId:numberdd");
    //  let ddIndex = elment.selectedIndex;
    //   document.getElementById("tblEmployes.EmployeId:numberdd");

    console.log(event);
    let selectedIndex = event.target.selectedIndex;

    let i = item.indexOf(':');
    let prop = item.substring(0,i);
    
    this.exp = prop + " " + event.target.options[selectedIndex].value;

  }


  inputChange(event:any){

  let input=  event.target.value;

  if(input === '=='){

    input = '=' 
  }
  this.exp ='and' + ' ' + this.exp + input;
  this.whereCondtionsList.push(this.exp);

  }

}
