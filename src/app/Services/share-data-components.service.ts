import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareDataComponentsService {

  selectedFields:any[] = [];
  whereList :any[]= [];
  constructor() { }

  addFields(fields:string[]) {
    this.selectedFields = [];
    fields.forEach(element => {
      this.selectedFields.push(element);
    });
    
  }

  getFields() {
      return this.selectedFields;
  }


  addWhereList(list:string[]) {
    this.whereList = [];
    list.forEach(element => {
      this.whereList.push(element);
    });
    
  }

  getWhereList() {
      return this.whereList;
  }
}
