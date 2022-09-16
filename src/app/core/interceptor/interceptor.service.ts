import { Injectable } from '@angular/core';

import { environment } from './../../../environments/environment';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(httpReq: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const headers = new HttpHeaders({
      'X-RapidAPI-Key': environment.RapidAPI_Key,
      'X-RapidAPI-Host': environment.RapidAPI_Host,
    });

    const url = `${environment.RapidAPI_BaseUrl}/${httpReq.url}`;

    const tokenizedReq = httpReq.clone({
      headers,
      url,
    });

    return next.handle(tokenizedReq);
  }
}
