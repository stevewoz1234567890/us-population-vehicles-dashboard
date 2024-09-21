import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Household, Population } from '../models/dataUSA.model';

@Injectable({
    providedIn: 'root'
})
export class DataUSAService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getPopulationByStates(targetStates: string[] = []): Observable<Population[]> {
        const url = new URL(`${this.baseUrl}/v1/population`);
        targetStates.forEach(state => url.searchParams.append('targetStates', state));

        return this.http.get<Population[]>(url.toString());
    }

    getHouseholdsByYears(targetYears: number[] = []): Observable<Household[]> {
        const url = new URL(`${this.baseUrl}/v1/households`);
        targetYears.forEach(year => url.searchParams.append('targetYears', year.toString()));

        return this.http.get<Household[]>(url.toString());
    }
}