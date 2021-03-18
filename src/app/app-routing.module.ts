import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DragFieldsComponent } from './drag-fields/drag-fields.component';
import { ReportComponent } from './report/report.component';


const routes: Routes = [
  { path: 'report', component: ReportComponent },
  { path: '', component: DragFieldsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }