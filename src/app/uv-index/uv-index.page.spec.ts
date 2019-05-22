import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UvIndexPage } from './uv-index.page';

import { WeatherService } from '../services/weather/weather.service';
import { createWeatherServiceMock } from '../services/weather/weather.service.mock';
import { of } from 'rxjs/internal/observable/of';

describe('UvIndexPage', () => {
  let component: UvIndexPage;
  let fixture: ComponentFixture<UvIndexPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UvIndexPage],
      providers: [
        {provide: WeatherService, useFactory: createWeatherServiceMock}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UvIndexPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('entering the page', () => {
    it('gets the uv index', () => {
      const weather =  TestBed.get(WeatherService);
      component.ionViewDidEnter();
      expect(weather.uvIndex).toHaveBeenCalledTimes(1);
    });

    it('assigns the uv index', () => {
      const weather =  TestBed.get(WeatherService);
      weather.uvIndex.and.returnValue(of( {
        value: 4,
        riskLevel: 3
      }));
      component.ionViewDidEnter();
      expect(component.uvIndex).toEqual({
        value: 4,
        riskLevel: 3
      });
    });
  });
});
