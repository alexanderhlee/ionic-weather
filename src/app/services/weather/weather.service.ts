import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Weather } from 'src/app/models/weather';
import { map, flatMap } from 'rxjs/operators';
import { Forecast } from 'src/app/models/forecast';
import { UVIndex } from 'src/app/models/uv-index';
import { Coordinate } from 'src/app/models/coordinate';
import { LocationService } from '../location/location.service';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient, private location: LocationService) { }

  private latitude = 28.149300;
  private longitude = -82.460747;

  current(): Observable<Weather> {
    return this.getCurrentLocation().pipe(
      flatMap((coord: Coordinate) => this.getCurrentWeather(coord))
    );
  }
  private getCurrentLocation(): Observable<Coordinate> {
    return from(this.location.current());
  }

  private getCurrentWeather(coord: Coordinate): Observable<Weather> {
    return this.http
      .get(
        `${environment.baseUrl}/weather?lat=${coord.latitude}&lon=${
        coord.longitude
        }&appid=${environment.appId}`
      )
      .pipe(map(res => this.unpackWeather(res)));
  }

  private unpackWeather(res: any): Weather {
    return {
      temperature: res.main.temp,
      condition: res.weather[0].id,
      date: new Date(res.dt * 1000),
      name: res.name
    };
  }

  forecast(): Observable<Forecast> {
    return this.http.get(
      `${environment.baseUrl}/forecast?lat=${this.latitude}&lon=${
      this.longitude
      }&appid=${environment.appId}`)
      .pipe(map(res => this.unpackForecast(res)));
  }

  private unpackForecast(res: any): Forecast {
    let currentDay: Array<Weather>;
    let prevDate: number;
    const forecast: Forecast = [];

    res.list.forEach(item => {
      const w = this.unpackWeather(item);
      if (w.date.getDate() !== prevDate) {
        prevDate = w.date.getDate();
        currentDay = [];
        forecast.push(currentDay);
      }
      currentDay.push(w);
    });

    return forecast;
  }

  uvIndex(): Observable<UVIndex> {
    return this.http.get(
      `${environment.baseUrl}/uvi?lat=${this.latitude}&lon=${
      this.longitude
      }&appid=${environment.appId}`)
      .pipe(map(res => this.unpackUvIndex(res)));
  }

  private unpackUvIndex(res: any): UVIndex {
    return {
      value: res.value,
      riskLevel: this.riskLevel(res.value)
    };
  }

  private riskLevel(value: number): number {
    if (value < 3) {
      return 0;
    }
    if (value >= 3 && value < 6) {
      return 1;
    }
    if (value >= 6 && value < 8) {
      return 2;
    }
    if (value >= 8 && value < 11) {
      return 3;
    }
    if (value >= 11) {
      return 4;
    }
  }
}
