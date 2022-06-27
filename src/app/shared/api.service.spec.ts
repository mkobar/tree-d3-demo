// see https://stackoverflow.com/questions/48572621/angular-5-service-failing-to-pass-unit-tests-with-nullinjectorerror-no-provide

import { TestBed, async, inject } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

import { ApiService } from './api.service'

/* globals describe, beforeEach, it, expect */

describe('ApiService', () => {
  let service: ApiService
  
  beforeEach(() => {
    //TestBed.configureTestingModule({})

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        ApiService,
      ],
    });
    service = TestBed.inject(ApiService)
  })

  /***
  it('should be created', () => {
    expect(service).toBeTruthy()
  })
  ***/

 it(`should create`, async(inject([HttpTestingController, ApiService],
    (httpClient: HttpTestingController, apiService: ApiService) => {
      expect(apiService).toBeTruthy();
  })));
})
