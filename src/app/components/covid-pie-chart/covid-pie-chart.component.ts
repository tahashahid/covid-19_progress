import { Component, AfterViewInit, Inject, NgZone, PLATFORM_ID, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


import * as am5 from '@amcharts/amcharts5';
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
  selector: 'app-covid-pie-chart',
  templateUrl: './covid-pie-chart.component.html',
  styleUrls: ['./covid-pie-chart.component.scss']
})
export class CovidPieChartComponent implements AfterViewInit {

  private root!: am5.Root;

  private series: any;

  private _data = [];
  @Input() set data(statisticsData: any){
    this._data = statisticsData;
    if(this.series){
      this.series.data.setAll(this._data.filter(
        (item:any) => item.key !== 'Total Cases'
      ));
    }
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone
    ) { }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly(() => {
      let root = am5.Root.new("covidPieChart");

      
      // Set themes
      // https://www.amcharts.com/docs/v5/concepts/themes/
      root.setThemes([
        am5themes_Animated.new(root)
      ]);


      // Create chart
      // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
      let chart = root.container.children.push(am5percent.PieChart.new(root, {
        layout: root.verticalLayout
      }));


      // Create series
      // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
      let series = chart.series.push(am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "key"
      }));


      // Set data
      // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
      // series.data.setAll([
      //   { value: 10, category: "One" },
      //   { value: 9, category: "Two" },
      //   { value: 6, category: "Three" },
      //   { value: 5, category: "Four" },
      //   { value: 4, category: "Five" },
      //   { value: 3, category: "Six" },
      //   { value: 1, category: "Seven" },
      // ]);
      this.series = series;


      // Create legend
      // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
      let legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15
      }));

      legend.data.setAll(series.dataItems);


      // Play initial series animation
      // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
      series.appear(1000, 100);


      this.root = root;
    });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }
}
