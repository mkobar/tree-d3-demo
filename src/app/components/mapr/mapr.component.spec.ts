import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import * as d3 from 'd3' // eslint-disable-line no-unused-vars

import { MaprComponent } from './mapr.component'
import { ApiService } from '../../shared/api.service'
import { ActiveMapService } from '../../shared/active-map.service'

describe('MaprComponent', () => {
  let component: MaprComponent;
  let fixture: ComponentFixture<MaprComponent>;

  beforeEach(async(() => {
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
})
