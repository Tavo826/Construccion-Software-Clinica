import { TestBed } from '@angular/core/testing';

import { HttpRecordProviderService } from './http-record-provider.service';

describe('HttpRecordProviderService', () => {
  let service: HttpRecordProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpRecordProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
