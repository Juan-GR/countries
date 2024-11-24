import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, delay, map, Observable, of, tap } from "rxjs";
import { Country } from "../interfaces/country";
import { CacheStore } from "../interfaces/cachestore.interface";
import { Region } from "../interfaces/region.type";

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  private baseUrl: string = 'https://restcountries.com/v3.1';

  public cacheStore: CacheStore = {
    byCapital: { term: '', countries: [] },
    byCountry: { term: '', countries: [] },
    byRegion: { region: undefined, countries: [] }
  }

  constructor(private httpClient: HttpClient) {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage(): void {
    if (!localStorage.getItem('cacheStore')) return;
    this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!);
  }

  private getCountriesRequest (url: string): Observable<Country[]> {
    return this.httpClient.get<Country[]>( url )
      .pipe(
        catchError( (error) => of([]) ),
        /*delay(5000)*/
      );
  }

  searchCountryByAlpha (id: string): Observable<Country | null> {
    const url = `${this.baseUrl}/alpha/${ id }`;
    return this.httpClient.get<Country[]>( url )
      .pipe(
        map( countries => countries.length > 0 ? countries[0] : null ),
        catchError( (error) => of(null) ),
      );
  }

  searchCapital (term: string): Observable<Country[]> {
    const url = `${this.baseUrl}/capital/${ term }`;
    return this.getCountriesRequest(url)
      .pipe(
        tap((countries) => {
          this.cacheStore.byCapital = { term, countries };
        }),
        tap(() => this.saveToLocalStorage())
    );
  }

  searchCountry (term: string): Observable<Country[]> {
    const url = `${this.baseUrl}/name/${ term }`;
    return this.getCountriesRequest(url)
      .pipe(
      tap((countries) => {
        this.cacheStore.byCountry = { term, countries };
      }),
      tap(() => this.saveToLocalStorage())
    );
  }

  searchRegion (region: Region): Observable<Country[]> {
    const url = `${this.baseUrl}/region/${ region }`;
    return this.getCountriesRequest(url)
      .pipe(
      tap((countries) => {
        this.cacheStore.byRegion = { region, countries };
      }),
      tap(() => this.saveToLocalStorage())
    );
  }
}
