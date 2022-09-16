import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidBarChartComponent } from './covid-bar-chart.component';

describe('CovidBarChartComponent', () => {
  let component: CovidBarChartComponent;
  let fixture: ComponentFixture<CovidBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CovidBarChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
