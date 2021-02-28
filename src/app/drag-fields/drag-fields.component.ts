import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ReportBuilderService } from '../Services/report-builder.service';
import { reportInfo } from 'src/app/interfaces/reportInfo';
import * as XLSX from 'xlsx'; 
import { ToastrService } from 'ngx-toastr';
import { asLiteral } from '@angular/compiler/src/render3/view/util';



@Component({
  selector: 'app-drag-fields',
  templateUrl: './drag-fields.component.html',
  styleUrls: ['./drag-fields.component.css']
})
export class DragFieldsComponent implements OnInit {
  employee:any = {
  text:'Employee',
  nodes: [ 'employeId', 'employeName', 'employeDescription',  'joinDate' ]
  } 

  department :any={
    text:'Department',
   nodes :['departmentId', 'departmentName' , ]}

   city :any={
    text:'City',
   nodes :[ 'cityId','cityName' , ]}

   Country :any={
    text:'Department',
   nodes :[ 'countryId','countryName' , ]}

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
  Fiedslist:any[]=[];

  constructor(private _reportBuilderService: ReportBuilderService, private toastr: ToastrService) { 

     
  }
 
  ngOnInit(): void {

    this.Fiedslist.push(this.employee);
    this.Fiedslist.push(this.department);
    this.Fiedslist.push(this.city);
    this.Fiedslist.push(this.Country);

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


    DisplayTreeView(event){

   if(event.target.classList.contains('fa-caret-down')){
    event.target.classList.add('fa-caret-right');
    event.target.classList.remove('fa-caret-down');
    event.srcElement.nextElementSibling.classList.remove('Treeactive');
   }else{

    event.target.classList.add('fa-caret-down');
    event.target.classList.remove('fa-caret-right');
    event.srcElement.nextElementSibling.classList.add('Treeactive');
   }
   

    }


    dropItem(ev) {
      this.isTableShow = false;
      ev.preventDefault();
      var data = ev.dataTransfer.getData("text");
      // ev.target.appendChild(document.getElementById(data));
      // var element =  document.getElementById("draged");
       let isVal= this.SelectedFields.find(o =>o === data);
       if(isVal === undefined)
          this.SelectedFields.push(data);
       else
         this.showInfo(isVal + ' ' +'aready exist');
      // element.appendChild(document.getElementById(data));
    }
  
    allowDrop(ev) {
      ev.preventDefault();
    }
  
    drag(ev) {
      ev.dataTransfer.setData("text", ev.target.id);
    }


    RemoveItemFromSectedList(item){
      this.isTableShow = false;
      const index = this.SelectedFields.indexOf(item);
      if (index > -1) {
        this.SelectedFields.splice(index, 1);
        this.showSuccess('Removed ' +' ' + item );
      }
      
    }
    showInfo(message) {
      this.toastr.info(message , 'Note !' );
    }

    showSuccess(message) {
      this.toastr.success(message , 'Success !' );
    }
}
