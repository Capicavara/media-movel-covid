import { TestBed } from '@angular/core/testing';

import { CovidProviderService } from './covid-provider.service';

describe('CovidProviderService', () => {
  let service: CovidProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CovidProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
