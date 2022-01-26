import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";

import { ApiService } from "./shared/api.service";
import { MapperComponent } from './components/mapper/mapper.component';
//import { TreeReportComponent } from './components/tree-report/tree-report.component';
@NgModule({
  declarations: [
    AppComponent,
//    TreeReportComponent,
    MapperComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
