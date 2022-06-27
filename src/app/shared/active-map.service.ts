import { Injectable } from '@angular/core';
//import { environment } from '../../environments/environment';
//import { Observable } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs' // eslint-disable-line no-unused-vars

@Injectable({
  providedIn: 'root'
})
export class ActiveMapService {

    private activeMap: any

    private mapChange = new BehaviorSubject<any>(
      { name: 'empty', treeData: 'data', nodes: 'nodes', links: 'links',
          lastNodeId: 0, root: null, selectedNode: null })


    private emptyMap: any = 
      { name: 'empty', treeData: 'data', nodes: 'nodes', links: 'links',
          lastNodeId: 0, root: null, selectedNode: null }

    //constructor() { }

    // Observable mapItem stream
    mapItem$ = this.mapChange.asObservable()

    // service command
    changeActiveMap (any) {
      this.mapChange.next(any)
    }

    //private _jsonURL = 'assets/car-data.json';
    public getMap(): Observable<any> {
        //this.activeMap = map
        //this.activeMap = this.emptyMap
        return this.activeMap;
    }

    /**
    public getActiveMap(name: String): Observable<any> {
        //this.activeMap = map
        //return this.activeMap;
    console.log('getMap')
    console.log('getMap:name=', name)
    // detect default selectedQuery here
    for (const m of queries?) { // of returns objects, in returns ints
      console.log(m.name, name)
      if (m.status === name) {
        this.mapChange.next(m) // force new activeMap?
        return
      }
    }
    // return empty here if no match?
    this.queryChange.next(this.emptyQuery) // force empty activeQuery
    }
    **/

   /***
    public setMap(map: any): Observable<any> {
        this.activeMap = map
	this.mapChange.next(map) // force new activeMap?

        return this.activeMap;
    }
   ***/

    public setMap(map: any) {
        this.activeMap = map
	this.mapChange.next(map) // force new activeMap?

        return;
    }
}
