import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { Statistics } from 'src/app/types/typings';

interface ApiResponse<T> {
  response: T
}

@Injectable()
export class CovidApiService {

  private months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(private http: HttpClient) { }

  getCountries(): Observable<any>{
    return this.http.get<ApiResponse<string[]>>('countries').pipe(
      map(({response}) => {
        return response;
      })
    );
  }

  searchCountries(search: string = ''): Observable<any>{
    return this.http.get('countries', {
      params: {
        search
      }
    });
  }

  getStatistics(): Observable<any>{
    return this.http.get<ApiResponse<Statistics[]>>('statistics').pipe(
      map(({response}) => {
        return response;
      })
    );
  }

  getAllStatistics(): Observable<any>{
    return this.getStatisticsByCountry('All');
  }

  getStatisticsByCountry(country: string): Observable<any>{
    return this.http.get<ApiResponse<Statistics[]>>('statistics', {
      params: {
        country
      }
    }).pipe(
      map(({response}) => {
        return response;
      })
    );
  }

  // 2022-06-03T19:30:02+00:00
  getAllHistory(day: string): Observable<any>{
    const country = 'All'
    return this.http.get('history', {
      params: {
        country,
        day
      }
    });
  }

  getHistoryByCountry(country: string, day: string): Observable<any>{
    return this.http.get<ApiResponse<Statistics[]>>('history', {
      params: {
        country,
        day
      }
    }).pipe(
      map(({response}) => {
        return response;
      })
    );
  }

  getMonthlyHistory(year: number, country: string): Observable<any>{
    const tasks$ = [];
    const selectedDate = new Date(year, 1, 1);
    for(let i = 0; i < 12; i++){
      const lastDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth()+i, 0);
      

      if(lastDayOfMonth.getTime() > Date.now()) {
        const date = this.getFormatedDate(new Date());
        tasks$.push(
          this.getHistoryByCountry(country, date)
        );
        break;
      };
      const date = this.getFormatedDate(lastDayOfMonth);
      tasks$.push(
        this.getHistoryByCountry(country, date)
      );
    }
    return forkJoin(tasks$).pipe(
      map(response => 
        response.map(item => {
          if(!item[0]){
            return {};
          }
          return {
            day: item[0].day,
            month: this.months[new Date(item[0].day).getMonth()],
            population: item[0].population,
            cases: item[0].cases.total,
            recovered: item[0].cases.recovered,
            deaths: item[0].deaths.total,
            tests: item[0].tests.total
        }
      })
      )
    );
  }

  private getFormatedDate(date: Date){
    const format = [{year: 'numeric'}, {month: '2-digit'}, {day: '2-digit'}]
    return format.map((m) => {
      let f = new Intl.DateTimeFormat('en', m as any);
      return f.format(date);
    }).join('-');
  }


}
