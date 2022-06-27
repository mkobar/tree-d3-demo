import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaprComponent } from './mapr.component';

describe('MaprComponent', () => {
  let component: MaprComponent;
  let fixture: ComponentFixture<MaprComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaprComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
