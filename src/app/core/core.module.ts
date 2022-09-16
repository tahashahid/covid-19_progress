import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { InterceptorService } from './interceptor/interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CovidApiService } from './covid-api/covid-api.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    CovidApiService,
    {
     provide: HTTP_INTERCEPTORS,
     useClass: InterceptorService,
     multi: true
    }
   ]   
})
export class CoreModule { }
