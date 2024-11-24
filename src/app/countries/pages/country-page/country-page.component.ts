import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import { CountriesService } from "../../services/countries.service";
import {switchMap} from "rxjs";
import { Country } from "../../interfaces/country";

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  styles: ``
})
export class CountryPageComponent implements OnInit {
  public country?: Country;
  constructor (
    private activatedroute: ActivatedRoute,
    private countriesService: CountriesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedroute.params
      .pipe(
        switchMap(({ id }) => this.countriesService.searchCountryByAlpha(id))
      )
      .subscribe((response) => {
        if (!response) {
          return this.router.navigateByUrl('');
        }
        this.country = response;
        return;
      })
  }
}
