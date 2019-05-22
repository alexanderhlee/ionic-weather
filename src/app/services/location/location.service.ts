import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Coordinate } from '../../models/coordinate';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private platform: Platform, private geolocation: Geolocation) {}

  private latitude = 28.149300;
  private longitude = -82.460747;

  async current(): Promise<Coordinate> {
    const { coords } = this.platform.is('cordova')
    ? await this.geolocation.getCurrentPosition()
      : {
        coords: {
          latitude: this.latitude,
          longitude: this.longitude
          }
        };
    return { latitude: coords.latitude, longitude: coords.longitude };
  }
}
