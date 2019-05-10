import { Component, OnInit } from '@angular/core';
import { Helpers } from './classes/helpers';

@Component({
  selector: 'gantt-entry',
  templateUrl: './entry.component.html'
})

export class EntryComponent implements OnInit {

  ngOnInit() {
    console.log(Helpers.generateDates('2019-12-20', '2020-01-10'));
  }
}
