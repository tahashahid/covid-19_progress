import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Statistics } from 'src/app/types/typings';

@Component({
  selector: 'app-monthly-history',
  templateUrl: './monthly-history.component.html',
  styleUrls: ['./monthly-history.component.scss']
})
export class MonthlyHistoryComponent implements OnInit {

  private _country: string = 'Global';
  public selectedYear = new FormControl(2022, [Validators.required]);

  @Output() yearChange = new EventEmitter();

  @Input() monthlyData: any = [];
  @Input() set country(val: string){
    this._country = val;
    this.selectedYear.patchValue(2022);
  }

  get country (){
    return this._country;
  }

  constructor() { }

  ngOnInit(): void {
    this.selectedYear.valueChanges
    .subscribe(value => {
      this.yearChange.emit(value);
    })
  }

}
