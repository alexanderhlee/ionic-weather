import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Weather } from 'src/app/models/weather';
import {map } from 'rxjs/operators';
import { Forecast } from 'src/app/models/forecast';
import { UVIndex } from 'src/app/models/uv-index';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) { }

  private latitude = 43.073051;
  private longitude = -89.401230;

  current(): Observable<Weather> {
    return this.http.get(
      `${environment.baseUrl}/weather?lat=${this.latitude}&lon=${
        this.longitude
      }&appid=${environment.appId}`)
      .pipe(map(res => this.unpackWeather(res)));
  }

  private unpackWeather(res: any): Weather {
    return {
      temperature: res.main.temp,
      condition: res.weather[0].id,
      date: new Date(res.dt * 1000)
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
    if (value < 3 ) {
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
