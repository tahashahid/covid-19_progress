import { Component, AfterViewInit, Inject, NgZone, PLATFORM_ID, OnInit, Output, EventEmitter } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow"
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-covid-map',
  templateUrl: './covid-map.component.html',
  styleUrls: ['./covid-map.component.scss']
})
export class CovidMapComponent implements OnInit, AfterViewInit {

  @Output() countryChange = new EventEmitter();

  private root!: am5.Root;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
     private zone: NgZone,
     ) {}

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly(() => {
      let root = am5.Root.new("covidMap");

      
      // Set themes
      // https://www.amcharts.com/docs/v5/concepts/themes/
      root.setThemes([
        am5themes_Animated.new(root)
      ]);


      // Create the map chart
      // https://www.amcharts.com/docs/v5/charts/map-chart/
      let chart: any = root.container.children.push(am5map.MapChart.new(root, {
        panX: "translateX",
        panY: "translateY",
        projection: am5map.geoEquirectangular()
      }));


      // Create series for background fill
      // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
      var backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
      backgroundSeries.mapPolygons.template.setAll({
        fill: root.interfaceColors.get("alternativeBackground"),
        fillOpacity: 0,
        strokeOpacity: 0
      });
      // Add background polygo
      // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
      backgroundSeries.data.push({
        geometry: am5map.getGeoRectangle(90, 180, -90, -180)
      });


      // Create main polygon series for countries
      // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
      let polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"]
      }));

      polygonSeries.mapPolygons.template.setAll({
        tooltipText: "{name}",
        toggleKey: "active",
        interactive: true
      });

      polygonSeries.mapPolygons.template.states.create("hover", {
        fill: root.interfaceColors.get("primaryButtonHover")
      });

      polygonSeries.mapPolygons.template.states.create("active", {
        fill: root.interfaceColors.get("primaryButtonHover")
      });

      let previousPolygon: any;

      polygonSeries.mapPolygons.template.on("active", (_: any, target: any) => {
        if (previousPolygon && previousPolygon != target) {
          previousPolygon.set("active", false);
        }
        if (target.get("active")) {
          polygonSeries.zoomToDataItem(target.dataItem );
          this.countryChange.emit(target.dataItem);
        }
        else {
          chart.goHome();
          this.countryChange.emit();
        }
        previousPolygon = target;
      });


      // Add zoom control
      // https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Zoom_control
      chart.set("zoomControl", am5map.ZoomControl.new(root, {}));


      // Set clicking on "water" to zoom out
      chart.chartContainer.get("background").events.on("click", function () {
        chart.goHome();
      })


      // Make stuff animate on load
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
