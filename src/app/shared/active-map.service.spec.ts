import { TestBed } from '@angular/core/testing'

import { ActiveMapService } from './active-map.service'

/* globals describe, beforeEach, it, expect */

describe('ActiveMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: ActiveMapService = TestBed.inject(ActiveMapService)
    expect(service).toBeTruthy()
  })
})
