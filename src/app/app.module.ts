import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ReportBuilderService} from 'src/app/Services/report-builder.service';
import {ShareDataComponentsService} from 'src/app/Services/share-data-components.service';



// angular matrial
import {DragDropModule} from '@angular/cdk/drag-drop';
import { DragFieldsComponent } from './drag-fields/drag-fields.component';
import {A11yModule} from '@angular/cdk/a11y';
import {CdkTableModule} from '@angular/cdk/table';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTreeModule} from '@angular/material/tree';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';

// ng2 module 
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { ToastrModule } from 'ngx-toastr';
import { RemovePrefiexTextPipe } from './pipes/remove-prefiex-text.pipe';
import { ReportComponent } from './report/report.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    DragFieldsComponent,
    RemovePrefiexTextPipe,
    ReportComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatTableModule,
    CdkTableModule,
    HttpClientModule,
    A11yModule,
    Ng2SearchPipeModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTreeModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    MatSelectModule,
    MatMenuModule
  ],
  providers: [
    ReportBuilderService ,
    ShareDataComponentsService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
