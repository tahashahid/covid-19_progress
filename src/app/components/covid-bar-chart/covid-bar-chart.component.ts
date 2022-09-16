import { Component, AfterViewInit, Inject, NgZone, PLATFORM_ID, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
  selector: 'app-covid-bar-chart',
  templateUrl: './covid-bar-chart.component.html',
  styleUrls: ['./covid-bar-chart.component.scss']
})
export class CovidBarChartComponent implements AfterViewInit {

  @Input() country: string = 'Global';

  private root!: am5.Root;

  private xAxis: any;
  private series: any;

  private _data = [];
  @Input() set data(statisticsData: any){
    this._data = statisticsData;
    if(this.xAxis){
      this.xAxis.data.setAll(this._data);
      this.series.data.setAll(this._data);
    }
  }

  @Input() txt?: string;

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
      let root = am5.Root.new("covidBarChart");

      
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);


    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart: any = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX:true
    }));

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);


    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
    xRenderer.labels.template.setAll({
      rotation: -90,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15
    });

    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0.3,
      categoryField: "key",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      renderer: am5xy.AxisRendererY.new(root, {})
    }));


    // Create series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      sequencedInterpolation: true,
      categoryXField: "key",
      tooltip: am5.Tooltip.new(root, {
        labelText:"{valueY}"
      })
    }));

    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
    series.columns.template.adapters.add("fill", function(_: any, target: any) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", function(_: any, target: any) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });


    // Set data
    // let data = [{}];

    // xAxis.data.setAll(data);
    // series.data.setAll(data);
    this.xAxis = xAxis;
    this.series = series;

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    chart.appear(1000, 100);


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
