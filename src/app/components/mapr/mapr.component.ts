// tree-d3-demo
import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import { ActiveMapService } from '../../shared/active-map.service';
//import { Subscription } from 'rxjs/Subscription' // eslint-disable-line no-unused-vars
import { Subscription } from 'rxjs' // eslint-disable-line no-unused-vars
//declare let d3: any;
import * as d3 from 'd3';
import {parse, stringify} from 'flatted';

@Component({
  selector: 'app-mapper',
  templateUrl: './mapr.component.html',
  styleUrls: ['./mapr.component.css']
})

export class MaprComponent implements OnInit {
  //@Input() mapStatus: any
  mapStatus: any
  treeData: any
  //
  //margin = { top: 20, right: 120, bottom: 20, left: 120 };
  margin = { top: 20, right: 20, bottom: 20, left: 30 };
  width = 1400 - this.margin.left - this.margin.right;
  height = 300 - this.margin.top - this.margin.bottom;
  svg: any;
  //root: any;
  treemap = d3.tree().size([this.height, this.width]);
  duration = 350;
  i = 0;
  isCollapse: boolean = true;

  public selectedNode: any;

  //nodes: any;
  //links: any;
  lastNodeId = 30

  subscription!: Subscription

  constructor(public api: ApiService,
	      public amap: ActiveMapService) {
    // Called first time before the ngOnInit()
    // typescript
    // Important to note that @Input values are not accessible in the constructor
  }


  /**
  ngOnInit() {
    // Called after the constructor and called after the first ngOnChanges()    // angular! 

    //this.api.getJSON().subscribe(data => {
    //this.api.getJSON('car-data.json').subscribe(data => {
      //this.treeData = data;

      //let treeData = self.treemap(self.root);
      //this.nodes = treeData.descendants();
      //this.links = treeData.descendants().slice(1);

      //this.initTree();
    //});
      
      //this.mapStatus = this.amap.getMap('cars')

      this.mapStatus = this.amap.getMap() 
      console.log("mapper:mapStatus = ", this.mapStatus) 
      this.initTree(this.mapStatus);
  }
  **/

  ngOnInit () {
    // FIXME nested subscribes
    this.subscription = this.amap.mapItem$
        .subscribe(activeMap => {
          console.log('in mapper.component ngOnInit()')
          this.mapStatus = activeMap
          console.log('mapStatus: ', this.mapStatus)
          //this.mapStatus = this.amap.getMap()
        
	 /*** just for pre-load testing 
        this.api.getJSON('car-data.json').subscribe(data => {
          //this.mapData[0].treeData = data;
          this.mapStatus = { name: 'cars', treeData: data, nodes: null,
		  links: null, lastNodeId: 0 }
          //console.log('mapData[0]=', this.mapData[0])
          //this.mapSetting = this.mapData[0] // default
          //this.amap.setMap(this.mapData[0])
	
          console.log('mapStatus: ', this.mapStatus)
          //let treeData = this.treemap(this.root)
          //this.mapStatus.nodes = this.mapStatus.treeData.descendants()
          //this.mapStatus.links = this.mapStatus.treeData.descendants().slice(1)
	  //this.mapStatus.lastNodeId = this.mapStatus.nodes.length
          this.initTree(this.mapStatus)
        });
       ***/

	/***	
          console.log('mapStatus: ', this.mapStatus)
          //let treeData = this.treemap(this.root);
          this.mapStatus.nodes = this.mapStatus.treeData.descendants();
          this.mapStatus.links = this.mapStatus.treeData.descendants().slice(1);
	 ***/
	  if (this.mapStatus.name != 'empty') {
	    if (this.mapStatus.lastNodeId === 0) {
              this.initTree(this.mapStatus, true) // first time
	    } else {
              // need to remove old svg ang build new one
              //d3.select("#tree").select("svg").remove() // clean old svg
              //this.update(this.root, true, false) // first time
              //this.initTree(this.mapStatus, false) // NOT first time
              this.restoreTree(this.mapStatus, false) // NOT first time
	    }
	  }
    }) // sub

    /**
    if (this.activeQuery.id === '0') {
      // detect default selectedQuery here
      for (const q of this.queries) { // of returns objects, in returns ints
        console.log(q.name, q.status)
        if (q.status === this.tabStatus) {
          this.selectedQuery = q
          this.selectQuery(q) // force results to load on start
          console.log(q.name, this.selectedQuery.name)
          return
        }
      }
    } else {
      console.log('what to do now?')
      this.selectQuery(this.activeQuery) // force results to load on start
      console.log(this.activeQuery.name, this.selectedQuery.name)
    }
    **/
  }

  ngOnDestroy () {
    // prevent memory leak when component is destroyed
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }



  initTree(map: any, firstTime: boolean) {
    d3.select("#tree").select("svg").remove();

    this.svg = d3.select("#tree").append("svg")
      .attr("width", this.width + this.margin.right + this.margin.left)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate("
        + this.margin.left + "," + this.margin.top + ")");
    
    //this.root = d3.hierarchy(this.treeData, function (d) { return d.children; });
    map.root = d3.hierarchy(map.jsonTreeData, function (d) { return d.children; });
    //this.root.x0 = this.height / 2; // in middle
    //this.root.y0 = 0;
    map.root.x0 = this.height / 2; // in middle
    map.root.y0 = 0;
    map.selectedNode = map.root // MUST assign selected node

    if (this.isCollapse)
      map.root.children.forEach(this.collapse);
    //this.update(this.root, true, true); // first time
    this.update(map.root, true, firstTime); // first time
  }

  restoreTree(map: any, firstTime: boolean) {
    d3.select("#tree").select("svg").remove();

    this.svg = d3.select("#tree").append("svg")
      .attr("width", this.width + this.margin.right + this.margin.left)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate("
        + this.margin.left + "," + this.margin.top + ")");
    
    //this.root = d3.hierarchy(this.treeData, function (d) { return d.children; });
    //this.root = d3.hierarchy(map.treeData, function (d) { return d.children; });
    //this.root.x0 = this.height / 2; // in middle
    //this.root.y0 = 0;

    if (this.isCollapse)
      //this.root.children.forEach(this.collapse);
      //map.root.children.forEach(this.collapse);
      map.selectedNode.children.forEach(this.collapse);
    //this.update(this.root, true, true); // first time
    //this.update(map.root, true, firstTime); // first time
    this.update(map.selectedNode, true, firstTime); // first time
  }


  collapse(d) {
    function collapse(d) {
      if (d.children) {
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
      }
    }
    collapse(d)
  }

  /** not used? 
  expandCollapse() {
    this.isCollapse = !this.isCollapse;
    this.initTree()
  }
  **/

  update(source: any, selected: boolean, first: boolean) {
    console.log("UPDATE with first =", first)
    console.log("source.translate y0 x0 0= ", source)

    let self = this;
    let selfmap = this.mapStatus;

    if (first) {
	    console.log("update first")
      //let treeData = self.treemap(self.root);
      //let nodes = treeData.descendants();
      //let links = treeData.descendants().slice(1);
      
      //this.treeData = self.treemap(self.root);
      //this.nodes = this.treeData.descendants();
      //this.links = this.treeData.descendants().slice(1);
      //this.lastNodeId = this.nodes.length
      //self.treeData = self.treemap(self.root);
      //selfmap.treeData = self.treemap(self.root);
      self.treeData = self.treemap(selfmap.root);
      selfmap.nodes = self.treeData.descendants();
      selfmap.links = self.treeData.descendants().slice(1);
      //self.lastNodeId = self.nodes.length
      selfmap.lastNodeId = selfmap.nodes.length
    } else {
	    console.log("update NOT first")
    }
    //
    //let sizeBetweenNodes = 270;
    let sizeBetweenNodes = 270;

    selfmap.nodes.forEach(function (d) { d.y = d.depth * 270 });

    let node = self.svg.selectAll('g.node')
      .data(selfmap.nodes, function (d) { return d.id || (d.id = ++self.i); });

    let nodeEnter = node.enter().append('svg:g')
      .attr('class', 'node')
      .attr("transform", function (d) {
         console.log("source.translate y0 x0 = ", source)
	 return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on("click", function (event, d) {
        self.isCollapse = true;
        d3.selectAll("line").remove()
	console.log("nodeEnter.append-svg:g d=",d)
        self.update(d, true, false); // not first
      });

    nodeEnter.append('svg:circle')
      .attr("r", 1e-6)
      .attr("id", function (d) { return 'circle' + d.id })
      .attr("style", "stroke: #0000FF; stroke-width: 3; cursor: pointer")
      .on('click', function (event, d) {
	 console.log("nodeEnter.append-svg:circle d=",d)
         toggle(d);
      });

    nodeEnter.append("svg:image")
      .attr("xlink:href", function (d) {
         return d.data.flag ? "assets/images/flagged-24.png" : null;
      })
      .attr("x", -5)
      .attr("y", -5)
      .attr("height", 10)
      .attr("width", 10)
      .style("cursor", "pointer")
      .on('click', function (event, d) {
         toggle(d);
      });

    nodeEnter.append("svg:rect")
      .attr('style', 'fill: #c8f26d;')
      .attr('stroke', '#f49f16')
      .attr('rx', 5)
      .attr('ry', 5)
      .style("stroke-width", "2.5px");

    nodeEnter.append('svg:text')
      .attr("dy", ".35em")
      .attr("id", function (d) { return 'text' + d.id; })
      .style("text-anchor", "start")
      .style("font-size", "9px")
      .style("dominant-baseline", "alphabetic")
      .text(function (d) {
         console.log("d.id=",d.id)
         console.log("d.data.name=",d.data.name)
         return d.data.name;
      })
      .style("fill-opacity", 1e-6);

    nodeEnter.selectAll('text')
      .attr('x', function (d) {
        let circleWidth = self.getBox('circle' + d.id).getBBox().width;
	//let val = self.isCollapse ? -25 : 30;
	let val = self.isCollapse ? -25 : 30;
        return circleWidth + val;
      })
      .attr('y', function (d) {
        //let val = self.isCollapse ? -40 : 0;
        let val = self.isCollapse ? -21 : 0;
        return self.getBox('circle' + d.id).getBBox().height + val;
      });

    nodeEnter.selectAll('rect')
      .attr('width', function (d) {
        let isText = document.getElementById('text' + d.id).textContent;
        return (isText) ? self.getBox('text' + d.id).getBBox().width + 5 : 0;
      })
      .attr('height', function (d) {
         return self.getBox('text' + d.id).getBBox().height + 2;
      })
      .attr('x', function (d) {
         return (self.getBox('text' + d.id).getBBox().x) - 2;
      })
      .attr('y', function (d) {
         return (self.getBox('text' + d.id).getBBox().y);
      });

    let nodeUpdate = nodeEnter.merge(node);

    nodeUpdate.transition()
      .duration(self.duration)
      .attr("transform", function (d) {
         console.log("d.translate y x = ", d)
        return "translate(" + d.y + "," + d.x + ")";
      });

    nodeUpdate.select('circle')
      .attr("r", (d) => {
        if (selected) {
          //console.log("d.data.name2=",d.data.name)
          //console.log("source.data.name2=",source.data.name)
          if (d.data.name == source.data.name) {
            if (d.visited) {
	       return 26/4 // not selected?
            }
	    return 40/4  // selected
          }
        }
	return 26/4 // not selected
      })
      .style("fill", (d) => {
        if (selected) {
          //console.log("d.data.name3=",d.data.name)
          //console.log("source.data.name3=",source.data.name)
          if (d.data.name == source.data.name) {
            return "purple"
          }
        }
        return d._children ? "#0000FF" : "#B0C4DE";
      })

    nodeUpdate.select("text")
      .style("fill-opacity", 1);

    let nodeExit = node.exit().transition()
      .duration(self.duration)
      .attr("transform", function (d) {
        console.log("source.translate y x 2=",source)
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

    nodeExit.select('circle')
      .attr('r', 1e-6);

    nodeExit.select('text')
      .style('fill-opacity', 1e-6);


    let link = self.svg.selectAll('path.link')
      .data(selfmap.links, function (d) { return d.id; });

    link.enter().insert('line', "g")
      .attr("class", "link")
      .attr("x1", function (d) { return d.y; })
      .attr("y1", function (d) { return d.x; })
      .attr("x2", function (d) { return d.parent.y; })
      .attr("y2", function (d) { return d.parent.x; })
      .style("fill", "none")
      .style("stroke", "#80B8FF")
      .style("stroke-width", 1.5);

    link.transition()
      .duration(self.duration)
      .attr("x1", function (d) { return d.y; })
      .attr("y1", function (d) { return d.x; })
      .attr("x2", function (d) { return d.parent.y; })
      .attr("y2", function (d) { return d.parent.x; });

    link.exit().transition()
      .duration(self.duration)
      .attr("x1", function (d) { return d.y; })
      .attr("y1", function (d) { return d.x; })
      .attr("x2", function (d) { return d.parent.y; })
      .attr("y2", function (d) { return d.parent.x; })
      .remove();

    selfmap.nodes.forEach(function (d: any) {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    function toggle(d) {
      self.clickedEvt(d)

      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        if (d.parent && d.parent.children) {
          d.parent.children.forEach(self.collapse)
	}
        d.children = d._children;
        d._children = null;
        if (d.children) {
          d.children.forEach(self.collapse)
        }
      }


      //self.selectedNode = d // why?
      //this.mapStatus.selectedNode = d // why?
      selfmap.selectedNode = d // assign selected node

      //self.update(d, true, false);
      if (first) {
        self.update(d, true, true); // first again?
        //self.update(d, true, false) // NEVER expands nodes
      } else {
        //DEBUG self.update(d, true, false) // not first
        self.update(d, true, true) // not first
      }
    }
  }


  getBox(d: any): any {
    return document.getElementById(d)
  }

  clickedEvt(data: any) {
    console.log("Clicked Data MC: ", data);

    if (data.data.children) {  // do not add if child exists
	    return
    } else {
    //var coords = d3.mouse(event.currentTarget);
    //var coords = d3.pointer(event.currentTarget);
    var coords = d3.pointer(event); // grab click x,y location
    console.log("coords = ",coords);

    // WARNING: circular structure - in 3 children structs
    var newNode = {
      //children: [],  // used to display children of node
      data: {
	name: 'new-node-'+(this.lastNodeId+1),
	flag: false, // for flag icon
	//children: [] // are these children the same as outside of data?
	visited: false,
	size: 123 // not used
      },
      depth: data.depth + 1, // child will be +1 of parent/current node
      height: 2, // not used?
      id: ++this.lastNodeId,  // should be unique
      //parent: {},
      parent: data, // parent will be current node
      //x: coords[0],
      //x0: coords[0],
      x: 25,  // need to fix as they cause new child node to zoom in from the left
      x0: 25,  // need to fix as they cause new child node to zoom in from the left
      y: coords[1],
      y0: coords[1]
      //_children: null // used to store collapsed children of node
    };
    console.log("newNode = ", newNode);
    //var newLink = { source: data, target: newNode };
    var newLink = newNode
    //newNode.parent = newLink;
    console.log("newNode.parent = ", newNode.parent);
    //if (data.color == 1) newNode.color = 2;
    //else newNode.color = 1;
    if (data._children) {
       ;
    } else {
       data._children = []
    }
    data._children.push(newNode);
    if (data.data.children) {
       ;
    } else {
       data.data.children = []
    }
    data.data.children.push(newNode); // root data!
    console.log("data.children = ", data.data.children);
    /**
    this.nodes.push(newNode);
    console.log("nodes = ", this.nodes);
    this.links.push(newLink);
    console.log("links = ", this.links);
    //console.log(JSON.stringify(this.links));
    //var str = JSON.stringify(this.links);
    var str = stringify(this.links);
    **/
    this.mapStatus.nodes.push(newNode);
    console.log("nodes = ", this.mapStatus.nodes);
    this.mapStatus.links.push(newLink);
    console.log("links = ", this.mapStatus.links);
    var str = stringify(this.mapStatus.links); // circular struct!

    console.log(str);
    //maxDepth = Math.max(maxDepth, newNode.depth);

    //this.update(data, true, false)
    //this.update(data.data, true, false) // worked with name ERROR
    this.update(newNode, true, false) // not first - do NOT overwrite nodes
    //this.update(data.data.children[0], true, false) // loads without displying new node
    //this.update(data.data, false, false) // Error: <g> attribute transform: Expected number, "translate(undefined,undefi…"
    //this.update(data, true, true) // no collapse on initial empty node click
    //this.update(data.data, true) //Blows up in update?
    //this.update(data, false)
    console.log("update complete")
    }
  }
}
