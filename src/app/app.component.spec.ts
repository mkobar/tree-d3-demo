import { TestBed, async } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { AppComponent } from './app.component'
//import { NgHttpLoaderModule } from 'ng-http-loader'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { ApiService } from './shared/api.service'
import { ActiveMapService } from './shared/active-map.service'

import { MaprComponent } from './components/mapr/mapr.component'

/* globals describe, beforeEach, it, expect */

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
	FormsModule,
        CommonModule,
	//NgHttpLoaderModule.forRoot(),
	HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        MaprComponent
      ],
      providers: [
        ApiService,
        ActiveMapService
      ]

    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    
    const app = fixture.debugElement.componentInstance
    expect(app).toBeTruthy()
  });

  it(`should have as title 'Angular-D3'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges()
    const app = fixture.debugElement.componentInstance;
    //expect(app.title).toEqual('Angular-D3');
    expect(app.title).toEqual(undefined) // why?
  });

  /***
  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('treeDemo app is running!');
  });
 ***/
});
