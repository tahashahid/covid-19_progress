import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreModule } from './core/core.module'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CovidMapComponent } from './components/covid-map/covid-map.component';
import { CovidBarChartComponent } from './components/covid-bar-chart/covid-bar-chart.component';
import { MonthlyHistoryComponent } from './components/monthly-history/monthly-history.component';
import { CovidPieChartComponent } from './components/covid-pie-chart/covid-pie-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    CovidMapComponent,
    CovidBarChartComponent,
    MonthlyHistoryComponent,
    CovidPieChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
