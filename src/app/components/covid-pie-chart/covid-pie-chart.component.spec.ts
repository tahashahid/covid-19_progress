import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidPieChartComponent } from './covid-pie-chart.component';

describe('CovidPieChartComponent', () => {
  let component: CovidPieChartComponent;
  let fixture: ComponentFixture<CovidPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CovidPieChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
