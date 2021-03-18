import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { environment } from '../../environments/environment'; 
import { Observable } from 'rxjs';
import { feidsInfo } from '../interfaces/FieldsInfo';



@Injectable({
  providedIn: 'root'
})
export class ReportBuilderService {
  baseUrl = environment.baseUrl;
  headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Credentials', 'true');
  constructor(private http: HttpClient) { 
   
  }


  GenerateFieldsReporst(data:feidsInfo):Observable<any> {

  //  let data:any[] = [];
  //  let WhereList ={whereLst:whereLst};
  //  let PropInfo ={propsData:prop}
  //   data.push(PropInfo);
  //   data.push(WhereList);
    return this.http.post(this.baseUrl+ '/RepportBuilder/GetFieldsData', data, { headers: this.headers });
  }

  GetTablesColumnsNames():Observable<any> {
    return this.http.post(this.baseUrl+ '/RepportBuilder/GetColumnsNames', { headers: this.headers });
  }

  GetOperators(body):Observable<any> {
 
    return this.http.post( ` ${this.baseUrl+ '/RepportBuilder/GetOperators'}/${body}`, { headers: this.headers });
  }

  
}
