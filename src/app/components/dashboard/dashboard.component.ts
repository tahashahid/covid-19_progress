import { KeyValue } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CovidApiService } from 'src/app/core/covid-api/covid-api.service';
import { Statistics } from 'src/app/types/typings';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public countryName = 'Global';
  public monthlyStatistics: any = [];
  public data: KeyValue<string, number>[] = [];
  public selectedCountryStatistics?: Statistics;

  constructor(
    private covidApi: CovidApiService,
    private changeDetectorRef: ChangeDetectorRef
    ) { }

  ngOnInit(): void {
    this.setCountry();
  }
  
  setCountry(targetData = {dataContext: {name: 'All'}}){
    let dataContext;
    dataContext = targetData.dataContext;
    this.countryName = dataContext.name;
    if(this.countryName == 'All'){
      this.countryName = 'Global';
    }
    
    this.covidApi.getStatisticsByCountry(dataContext.name)
    .subscribe(data => {
      this.setCountryStatistics(data);
      this.changeDetectorRef.detectChanges();
    })
    this.setHistoryYear(2022);
  }

  setHistoryYear(year: number){
    let contextName = this.countryName;
    if(this.countryName == 'Global'){
      contextName = 'All';
    }
    this.covidApi.getMonthlyHistory(year, contextName)
    .subscribe((data) => {
      this.monthlyStatistics = data;
      this.changeDetectorRef.detectChanges();
    })
  }

  setCountryStatistics(data: Statistics[]){
    this.selectedCountryStatistics = data[0]
    if(!this.selectedCountryStatistics) {
      this.data = [];
      return;
    }
    this.data = [{
      key: "Total Cases",
      value: this.selectedCountryStatistics.cases.total
    }, 
    {
      key: "Recovered",
      value: this.selectedCountryStatistics.cases.recovered
    },
    {
      key: "Active Cases",
      value: this.selectedCountryStatistics.cases.active
    }, 
    {
      key: 'Critical',
      value: this.selectedCountryStatistics.cases.critical
    },
    {
      key: "Deaths",
      value: this.selectedCountryStatistics.deaths.total
    }];
  }
  
}
