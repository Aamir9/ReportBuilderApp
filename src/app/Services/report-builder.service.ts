import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'; 
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ReportBuilderService {
  baseUrl = environment.baseUrl;
  headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Credentials', 'true');
  constructor(private http: HttpClient) { }


  GenerateFieldsReporst(body):Observable<any> {
    return this.http.post(this.baseUrl+ '/RepportBuilder/GetFieldsData',body, { headers: this.headers });
  }

  GetTablesColumnsNames():Observable<any> {
    return this.http.post(this.baseUrl+ '/RepportBuilder/GetColumnsNames', { headers: this.headers });
  }

  
}
