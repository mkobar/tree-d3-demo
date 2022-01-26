import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
@Injectable()
export class ApiService {

    constructor(private http: HttpClient) { }
    //private _jsonURL = 'assets/car-data.json';
    public getJSON(filename: String): Observable<any> {
        //return this.http.get(this._jsonURL);
        return this.http.get('assets/' + filename);
      }
}
