import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/api.service';
//declare let d3: any;
//declare let d3: any;
import * as d3 from 'd3';
import {parse, stringify} from 'flatted';

@Component({
  selector: 'app-mapper',
  templateUrl: './mapper.component.html',
  styleUrls: ['./mapper.component.css']
})

export class MapperComponent implements OnInit {
  treeData: any
  //margin = { top: 20, right: 120, bottom: 20, left: 120 };
  margin = { top: 20, right: 20, bottom: 20, left: 30 };
  width = 1400 - this.margin.left - this.margin.right;
  height = 300 - this.margin.top - this.margin.bottom;
  svg: any;
  root: any;
  treemap = d3.tree().size([this.height, this.width]);
  duration = 350;
  i = 0;
  isCollapse: boolean = true;

  //treeData: any;
  nodes: any;
  links: any;
  lastNodeId = 0

  constructor(public api: ApiService) { }

  ngOnInit() {
    //this.api.getJSON().subscribe(data => {
    this.api.getJSON('car-data.json').subscribe(data => {
      this.treeData = data;

      //let treeData = self.treemap(self.root);
      //this.nodes = treeData.descendants();
      //this.links = treeData.descendants().slice(1);

      this.initTree();
    });
    
  }
  initTree() {
    d3.select("#tree").select("svg").remove();

    this.svg = d3.select("#tree").append("svg")
      .attr("width", this.width + this.margin.right + this.margin.left)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate("
        + this.margin.left + "," + this.margin.top + ")");
    
    this.root = d3.hierarchy(this.treeData, function (d) { return d.children; });
    this.root.x0 = this.height / 2; // in middle
    this.root.y0 = 0;

    if (this.isCollapse)
      this.root.children.forEach(this.collapse);
    this.update(this.root, true, true); // first time
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
  expandCollapse() {
    this.isCollapse = !this.isCollapse;
    this.initTree()
  }

  update(source: any, selected: boolean, first: boolean) {
    let self = this;

    if (first) {
      //let treeData = self.treemap(self.root);
      //let nodes = treeData.descendants();
      //let links = treeData.descendants().slice(1);
      this.treeData = self.treemap(self.root);
      this.nodes = this.treeData.descendants();
      this.links = this.treeData.descendants().slice(1);
      this.lastNodeId = this.nodes.length
    }
    //
    //let sizeBetweenNodes = 270;
    let sizeBetweenNodes = 270;

    this.nodes.forEach(function (d) { d.y = d.depth * 270 });

    let node = self.svg.selectAll('g.node')
      .data(this.nodes, function (d) { return d.id || (d.id = ++self.i); });

    let nodeEnter = node.enter().append('svg:g')
      .attr('class', 'node')
      .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", function (event, d) {
        self.isCollapse = true;
        d3.selectAll("line").remove()
	console.log("nodeEnter.append-svg:g d=",d)
        self.update(d, true, false);
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
         console.log("d=",d)
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
        return "translate(" + d.y + "," + d.x + ")";
      });

    nodeUpdate.select('circle')
      .attr("r", (d) => {
        if (selected) {
          console.log("d.data.name2=",d.data.name)
          console.log("source.data.name2=",source.data.name)
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
          console.log("d.data.name3=",d.data.name)
          console.log("source.data.name3=",source.data.name)
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
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

    nodeExit.select('circle')
      .attr('r', 1e-6);

    nodeExit.select('text')
      .style('fill-opacity', 1e-6);


    let link = self.svg.selectAll('path.link')
      .data(this.links, function (d) { return d.id; });

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

    this.nodes.forEach(function (d: any) {
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
      self.selectedNode = d
      //self.update(d, true, false);
      if (first) {
        self.update(d, true, true);
      } else {
        self.update(d, true, false)
      }
    }
  }

  public selectedNode: any;
  getBox(d: any): any {
    return document.getElementById(d)
  }

  clickedEvt(data: any) {
    console.log("Clicked Data MC: ", data);

    if (data.data.children) {
	    return
    } else {
    //var coords = d3.mouse(event.currentTarget);
    //var coords = d3.pointer(event.currentTarget);
    var coords = d3.pointer(event);
    console.log("coords = ",coords);

    var newNode = {
      //children: [],
      data: {
	name: 'new-node-'+(this.lastNodeId+1),
	flag: false,
	//children: []
	visited: false,
	size: 123
      },
      depth: data.depth + 1,
      height: 2,
      id: ++this.lastNodeId,
      //parent: {},
      parent: data, // parent will be current node
      x: coords[0],
      x0: coords[0],
      y: coords[1],
      y0: coords[1],
      _children: null
    };
    console.log("newNode = ", newNode);
    //var newLink = { source: data, target: newNode };
    var newLink = newNode
    //newNode.parent = newLink;
    console.log("newNode.parent = ", newNode.parent);
    //if (data.color == 1) newNode.color = 2;
    //else newNode.color = 1;
    if (data.children) {
       ;
    } else {
       data.children = []
    }
    data.children.push(newNode);
    if (data.data.children) {
       ;
    } else {
       data.data.children = []
    }
    data.data.children.push(newNode);
    console.log("data.children = ", data.data.children);
    this.nodes.push(newNode);
    console.log("nodes = ", this.nodes);
    this.links.push(newLink);
    console.log("links = ", this.links);
    //console.log(JSON.stringify(this.links));
    //var str = JSON.stringify(this.links);
    var str = stringify(this.links);
    console.log(str);
    //maxDepth = Math.max(maxDepth, newNode.depth);

    //this.update(data, true, false)
    this.update(data.data, true, false) // worked with name ERROR
    //this.update(data.data, false, false) // Error: <g> attribute transform: Expected number, "translate(undefined,undefi…"
    //this.update(data, true, true) // no collapse on initial empty node click
    //this.update(data.data, true) //Blows up in update?
    //this.update(data, false)
    console.log("update complete")
    }
  }
}
