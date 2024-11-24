import { Component, OnInit } from '@angular/core';
import { CountriesService } from "../../services/countries.service";
import { Country } from "../../interfaces/country";

@Component({
  selector: 'app-by-country-page',
  templateUrl: './by-country-page.component.html',
  styles: ``
})
export class ByCountryPageComponent implements OnInit{
  public countries: Country[] = [];
  public isLoading: boolean = false;
  public initialTerm: string = '';

  constructor(private countryService: CountriesService) {
    this.countries = this.countryService.cacheStore.byCountry.countries;
    this.initialTerm = this.countryService.cacheStore.byCountry.term;
  }

  ngOnInit(): void {
  }

  searchByCountry (term: string): void {
    this.isLoading = true;
    this.countryService.searchCountry(term)
      .subscribe(countries => {
        this.countries = countries;
        this.isLoading = false;
      });
  }
}
