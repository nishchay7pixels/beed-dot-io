import { TestBed } from '@angular/core/testing';

import { RoomConnectionService } from './room-connection.service';

describe('RoomConnectionService', () => {
  let service: RoomConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
