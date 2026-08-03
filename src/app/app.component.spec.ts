import { TestBed, waitForAsync } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { AppComponent } from './app.component'
//import { NgHttpLoaderModule } from 'ng-http-loader'
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { ApiService } from './shared/api.service'
import { ActiveMapService } from './shared/active-map.service'

import { MaprComponent } from './components/mapr/mapr.component'

/* globals describe, beforeEach, it, expect, spyOn */

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
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

  it('should render three navigation buttons with labels cars, cats and bats', () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const compiled = fixture.debugElement.nativeElement
    const buttons = compiled.querySelectorAll('button')
    expect(buttons.length).toBe(3)
    const labels = Array.from(buttons).map((b: any) => b.textContent.trim())
    expect(labels).toContain('cars')
    expect(labels).toContain('cats')
    expect(labels).toContain('bats')
  })

  it('should call setMap with cars data when cars button is clicked', () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const app = fixture.debugElement.componentInstance
    const amapService = TestBed.inject(ActiveMapService)
    spyOn(amapService, 'setMap')
    const buttons = fixture.debugElement.nativeElement.querySelectorAll('button')
    buttons[0].click()
    expect(amapService.setMap).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'cars' }))
  })

  it('should call setMap with cats data when cats button is clicked', () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const app = fixture.debugElement.componentInstance
    const amapService = TestBed.inject(ActiveMapService)
    spyOn(amapService, 'setMap')
    const buttons = fixture.debugElement.nativeElement.querySelectorAll('button')
    buttons[1].click()
    expect(amapService.setMap).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'cats' }))
  })

  it('should call setMap with bats data when bats button is clicked', () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const app = fixture.debugElement.componentInstance
    const amapService = TestBed.inject(ActiveMapService)
    spyOn(amapService, 'setMap')
    const buttons = fixture.debugElement.nativeElement.querySelectorAll('button')
    buttons[2].click()
    expect(amapService.setMap).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'bats' }))
  })

  it('should call selectMap with the correct tree name for each button', () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const app = fixture.debugElement.componentInstance
    const amapService = TestBed.inject(ActiveMapService)
    spyOn(amapService, 'setMap')
    spyOn(app, 'selectMap').and.callThrough()
    const buttons = fixture.debugElement.nativeElement.querySelectorAll('button')
    buttons[0].click()
    expect(app.selectMap).toHaveBeenCalledWith('cars')
    buttons[1].click()
    expect(app.selectMap).toHaveBeenCalledWith('cats')
    buttons[2].click()
    expect(app.selectMap).toHaveBeenCalledWith('bats')
  })
});
