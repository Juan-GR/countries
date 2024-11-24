import { Component, Input } from '@angular/core';
import { Country } from "../../interfaces/country";

@Component({
  selector: 'country-table',
  templateUrl: './country-table.component.html',
  styles: [
    `img {
      width: 40px;
    }`
  ]
})
export class CountryTableComponent {
  @Input()
  countries: Country[] = [];
}
