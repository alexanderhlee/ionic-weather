import { TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { createPlatformMock } from '../../../../test/mocks';

import { LocationService } from './location.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

describe('LocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {provide: Platform, useFactory: createPlatformMock},
      {
        provide: Geolocation,
        useFactory: () =>
          jasmine.createSpyObj('Geolocation', {
            getCurrentPosition: Promise.resolve({
              coords: { latitude: 42, longitude: 73 }
            })
          })
      }
    ]
  }));

  it('should be created', () => {
    const service: LocationService = TestBed.get(LocationService);
    expect(service).toBeTruthy();
  });

  describe('current', () => {
    const defaultLat = 28.149300;
    const defaultlong = -82.460747;

    it('determines if the appliction is hybrid native or not', () => {
      const platform = TestBed.get(Platform);
      const service: LocationService = TestBed.get(LocationService);
      service.current();
      expect(platform.is).toHaveBeenCalledTimes(1);
      expect(platform.is).toHaveBeenCalledWith('cordova');
    });

    describe('when hybrid mobile', () => {
      beforeEach(() => {
        const platform = TestBed.get(Platform);
        platform.is.withArgs('cordova').and.returnValue(true);
      });

      it('calls the gelocation plugin', () => {
        const geolocation = TestBed.get(Geolocation);
        const service: LocationService = TestBed.get(LocationService);
        service.current();
        expect(geolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
      });

      it('resolves the unpacked position', async () => {
        const service: LocationService = TestBed.get(LocationService);
        expect(await service.current()).toEqual({
          latitude: 42,
          longitude: 73
        });
      });
    });

    describe('when not hybrid mobile', () => {
      it('does not call the gelocation plugin', () => {
        const geolocation = TestBed.get(Geolocation);
        const service: LocationService = TestBed.get(LocationService);
        service.current();
        expect(geolocation.getCurrentPosition).not.toHaveBeenCalled();
      });

      it('resolves the default position', async () => {
        const service: LocationService = TestBed.get(LocationService);
        expect(await service.current()).toEqual({
          latitude: defaultLat,
          longitude: defaultlong
        });
      });
    });
  });
});


