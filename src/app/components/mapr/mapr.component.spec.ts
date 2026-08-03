import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import * as d3 from 'd3' // eslint-disable-line no-unused-vars

import { MaprComponent } from './mapr.component'
import { ApiService } from '../../shared/api.service'
import { ActiveMapService } from '../../shared/active-map.service'

/* globals describe, beforeEach, it, expect, spyOn */

const mockCarsTreeData = {
  name: 'A1-Cars', flag: false,
  children: [
    { name: 'B1-Auto trade', flag: true, visited: true,
      children: [
        { name: 'C1', visited: true, size: 3534, flag: false },
        { name: 'C2', visited: true, size: 3534 },
        { name: 'C3-SUVs', flag: false,
          children: [
            { name: 'D1-Ford', size: 3534, flag: true, visited: true },
            { name: 'D2', visited: true, size: 3534 },
            { name: 'D4-Honda', children: [{ name: 'E1-CRV', size: 3534, flag: true, visited: true }] }
          ]
        }
      ]
    },
    { name: 'B2-Old trucks',
      children: [
        { name: 'C4', visited: true, size: 3534 },
        { name: 'C5-Pickup trucks',
          children: [
            { name: 'D5-Ford Ranger', size: 3534 },
            { name: 'D8-Toyota', children: [{ name: 'E2-Tundra', size: 3534 }] }
          ]
        }
      ]
    },
    { name: 'B3-Old cars',
      children: [
        { name: 'C6-old cars for sale', visited: true, size: 3534 },
        { name: 'C7-vintage cars',
          children: [
            { name: 'D9-Vintage cars for sale', size: 3534 },
            { name: 'D11-Vintage cars for rent', children: [{ name: 'E3-Buick Roadmaster 1957', size: 3534 }] }
          ]
        }
      ]
    }
  ]
}

const mockCatsTreeData = {
  name: 'A1-Cats', flag: false,
  children: [
    { name: 'B1-Adoption', flag: true, visited: true,
      children: [
        { name: 'C1', visited: true, size: 3534, flag: false },
        { name: 'C3-Black Cats', flag: false,
          children: [
            { name: 'D1-Maine Coon', size: 3534, flag: true, visited: true },
            { name: 'D2-Siamese', visited: true, size: 3534 }
          ]
        }
      ]
    },
    { name: 'B2-Breeders',
      children: [
        { name: 'C4', visited: true, size: 3534 },
        { name: 'C5-Tabby cats',
          children: [
            { name: 'D5-Orange Tabby', size: 3534 },
            { name: 'D6-Grey Tabby', visited: true, size: 3534 }
          ]
        }
      ]
    }
  ]
}

const mockBatsTreeData = {
  name: 'A1-Bats', flag: false,
  children: [
    { name: 'B1-Black Bats', flag: true, visited: true,
      children: [
        { name: 'C1', visited: true, size: 3534, flag: false },
        { name: 'C3-Brown Bats', flag: false,
          children: [
            { name: 'D1-Little Brown Bat', size: 3534, flag: true, visited: true },
            { name: 'D2-Big Brown Bat', visited: true, size: 3534 }
          ]
        }
      ]
    },
    { name: 'B2-Fruit Bats',
      children: [
        { name: 'C4', visited: true, size: 3534 },
        { name: 'C5-Flying Fox',
          children: [
            { name: 'D5-Large Flying Fox', size: 3534 },
            { name: 'D6-Indian Flying Fox', visited: true, size: 3534 }
          ]
        }
      ]
    }
  ]
}

function makeMapData(name: string, treeData: any) {
  return { name, jsonTreeData: treeData, nodes: [], links: [], lastNodeId: 0, root: null, selectedNode: null }
}

describe('MaprComponent', () => {
  let component: MaprComponent;
  let fixture: ComponentFixture<MaprComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        MaprComponent
      ],
      providers: [
        ApiService,
        ActiveMapService
      ]
    })
    .compileComponents();
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MaprComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize cars tree when cars map is activated', () => {
    spyOn(component, 'initTree')
    const amapService = TestBed.inject(ActiveMapService)
    amapService.setMap(makeMapData('cars', mockCarsTreeData))
    expect(component.initTree).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'cars' }), true)
  })

  it('should initialize cats tree when cats map is activated', () => {
    spyOn(component, 'initTree')
    const amapService = TestBed.inject(ActiveMapService)
    amapService.setMap(makeMapData('cats', mockCatsTreeData))
    expect(component.initTree).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'cats' }), true)
  })

  it('should initialize bats tree when bats map is activated', () => {
    spyOn(component, 'initTree')
    const amapService = TestBed.inject(ActiveMapService)
    amapService.setMap(makeMapData('bats', mockBatsTreeData))
    expect(component.initTree).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'bats' }), true)
  })

  it('should collapse a branch node and move its children to _children', () => {
    const node: any = {
      children: [{ name: 'child1' }, { name: 'child2' }],
      _children: null
    }
    component.collapse(node)
    expect(node.children).toBeNull()
    expect(node._children).toBeTruthy()
    expect(node._children.length).toBe(2)
  })

  it('should not modify a leaf node that has no children', () => {
    const leaf: any = { name: 'leaf', children: null, _children: null }
    component.collapse(leaf)
    expect(leaf.children).toBeNull()
    expect(leaf._children).toBeNull()
  })

  it('should recursively collapse all nested branches', () => {
    const grandchild: any = { name: 'gc', children: [{ name: 'ggc' }], _children: null }
    const child: any = { name: 'child', children: [grandchild], _children: null }
    const root: any = { name: 'root', children: [child], _children: null }
    component.collapse(root)
    expect(root.children).toBeNull()
    expect(root._children[0]._children[0]._children).toBeTruthy()
    expect(root._children[0]._children[0].children).toBeNull()
  })

  it('should traverse all branches of the cars tree', () => {
    const collectBranches = (node: any, branches: string[]) => {
      branches.push(node.name)
      if (node.children) {
        node.children.forEach((c: any) => collectBranches(c, branches))
      }
    }
    const branches: string[] = []
    collectBranches(mockCarsTreeData, branches)
    expect(branches).toContain('A1-Cars')
    expect(branches).toContain('B1-Auto trade')
    expect(branches).toContain('B2-Old trucks')
    expect(branches).toContain('B3-Old cars')
    expect(branches).toContain('C3-SUVs')
    expect(branches).toContain('D1-Ford')
    expect(branches).toContain('E1-CRV')
  })

  it('should traverse all branches of the cats tree', () => {
    const collectBranches = (node: any, branches: string[]) => {
      branches.push(node.name)
      if (node.children) {
        node.children.forEach((c: any) => collectBranches(c, branches))
      }
    }
    const branches: string[] = []
    collectBranches(mockCatsTreeData, branches)
    expect(branches).toContain('A1-Cats')
    expect(branches).toContain('B1-Adoption')
    expect(branches).toContain('B2-Breeders')
    expect(branches).toContain('C3-Black Cats')
    expect(branches).toContain('D1-Maine Coon')
    expect(branches).toContain('C5-Tabby cats')
  })

  it('should traverse all branches of the bats tree', () => {
    const collectBranches = (node: any, branches: string[]) => {
      branches.push(node.name)
      if (node.children) {
        node.children.forEach((c: any) => collectBranches(c, branches))
      }
    }
    const branches: string[] = []
    collectBranches(mockBatsTreeData, branches)
    expect(branches).toContain('A1-Bats')
    expect(branches).toContain('B1-Black Bats')
    expect(branches).toContain('B2-Fruit Bats')
    expect(branches).toContain('C3-Brown Bats')
    expect(branches).toContain('D1-Little Brown Bat')
    expect(branches).toContain('C5-Flying Fox')
  })

  it('should navigate through all three trees in sequence', () => {
    spyOn(component, 'initTree')
    const amapService = TestBed.inject(ActiveMapService)

    amapService.setMap(makeMapData('cars', mockCarsTreeData))
    amapService.setMap(makeMapData('cats', mockCatsTreeData))
    amapService.setMap(makeMapData('bats', mockBatsTreeData))

    expect(component.initTree).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'cars' }), true)
    expect(component.initTree).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'cats' }), true)
    expect(component.initTree).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'bats' }), true)
  })

  it('should call restoreTree when switching to an already initialized tree', () => {
    spyOn(component, 'restoreTree')
    const amapService = TestBed.inject(ActiveMapService)
    const carsMap = makeMapData('cars', mockCarsTreeData)
    carsMap.lastNodeId = 5 // simulate already initialized
    amapService.setMap(carsMap)
    expect(component.restoreTree).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'cars' }), false)
  })
})
