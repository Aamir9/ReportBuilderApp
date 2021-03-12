import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removePrefiexText'
})
export class RemovePrefiexTextPipe implements PipeTransform {
  removeString = "";
  index =0;
  transform(value: string): string {
  
    this.index = value.indexOf('.');
    this.removeString = value.substring(0,this.index+1);
    
     return value.replace(this.removeString,'');
   
  }

}
