import { Component, OnInit } from '@angular/core';
import { ApiService } from './shared/api.service';
import { ActiveMapService } from './shared/activemap.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  mapSetting: any
  emptyData: any = { name: 'nemo' }
  mapData: any [] = [
	{ name: 'cars', jsonTreeData: 'data', nodes: [], links: [],
          lastNodeId: 0, root: null, selectedNode: null },
  	{ name: 'cats', jsonTreeData: 'data', nodes: [], links: [],
          lastNodeId: 0, root: null, selectedNode: null },
  	{ name: 'bats', jsonTreeData: 'data', nodes: [], links: [],
          lastNodeId: 0, root: null, selectedNode: null }]
  //treeData: any [] = [ this.emptyData, this.emptyData, this.emptyData ]
  buttons: string [] = ['cars', 'cats', 'bats']
 
  constructor(public api: ApiService,
	      public amap: ActiveMapService) { }

  ngOnInit() {
    this.api.getJSON('car-data.json').subscribe(data => {
      //this.treeData[0] = data;
      //this.treeData.push(data);
      this.mapData[0].jsonTreeData = data;
      console.log('mapData[0]=', this.mapData[0])
      //this.mapSetting = this.mapData[0] // default
      this.amap.setMap(this.mapData[0])
    });

    this.api.getJSON('cat-data.json').subscribe(data => {
      //this.treeData.push(data);
      //this.treeData[1] = data;
      this.mapData[1].jsonTreeData = data;
      console.log('mapData[1]=', this.mapData[1])
    });

    this.api.getJSON('bat-data.json').subscribe(data => {
      //this.treeData[2] = data;
      this.mapData[2].jsonTreeData = data;
      console.log('mapData[2]=', this.mapData[2])
    });

      //this.initTree();
  }


  selectMap (query) {
    //this.queryNotes = query.notes

    // this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-title' }).result.then((result) => {
      console.log('selectMap: query=', query)
      if (query === 'cars') {
        //this.mapSetting = this.mapData[0]
        this.amap.setMap(this.mapData[0])
      } else if (query === 'cats') {
        //this.mapSetting = this.mapData[1]
        this.amap.setMap(this.mapData[1])
      } else if (query === 'bats') {
        //this.mapSetting = this.mapData[2]
        this.amap.setMap(this.mapData[2])
      } else {
        //this.mapSetting = this.mapData[0]
        this.amap.setMap(this.mapData[0])
      }

      // this.trashQuery()
      // save notes back to query
      //query.notes = this.queryNotes
      //this.queryService.updateQuery(query)
      // this.queryService.updateQuery(this.activeQuery)

    // also select query
    //this.selectQuery(query)
  }

}
