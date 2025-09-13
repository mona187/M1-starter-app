import { Request, Response } from 'express';
import { WeatherService } from './weather.service';
import { addCityRequestSchema, updateCityRequestSchema, weatherRequestSchema } from './weather.types';
import logger from '../../shared/utils/logger.util';

export class WeatherController {
  private weatherService: WeatherService;

  constructor() {
    this.weatherService = new WeatherService();
  }

  getWeather = async (req: Request, res: Response): Promise<void> => {
    try {
      const { city, country } = (req as any).validatedQuery;
      
      const weatherData = await this.weatherService.getWeatherData(city, country);
      
      res.json({
        success: true,
        data: weatherData,
      });
    } catch (error) {
      logger.error('Error in getWeather:', error);
      
      if (error instanceof Error) {
        if (error.message === 'City not found') {
          res.status(404).json({
            success: false,
            message: 'City not found',
          });
          return;
        }
        if (error.message === 'Invalid API key') {
          res.status(500).json({
            success: false,
            message: 'Weather service configuration error',
          });
          return;
        }
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to fetch weather data',
      });
    }
  };

  addSavedCity = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as any; // Set by auth middleware
      const cityData = addCityRequestSchema.parse(req.body);
      
      const savedCity = await this.weatherService.addSavedCity(user, cityData);
      
      res.status(201).json({
        success: true,
        data: savedCity,
        message: 'City saved successfully',
      });
    } catch (error) {
      logger.error('Error in addSavedCity:', error);
      
      if (error instanceof Error) {
        if (error.message === 'City already saved') {
          res.status(409).json({
            success: false,
            message: 'City already saved',
          });
          return;
        }
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to save city',
      });
    }
  };

  getSavedCities = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as any; // Set by auth middleware
      
      const savedCities = await this.weatherService.getSavedCities(user);
      
      res.json({
        success: true,
        data: savedCities,
      });
    } catch (error) {
      logger.error('Error in getSavedCities:', error);
      
      res.status(500).json({
        success: false,
        message: 'Failed to fetch saved cities',
      });
    }
  };

  updateSavedCity = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as any; // Set by auth middleware
      const { cityId } = req.params;
      const updateData = updateCityRequestSchema.parse(req.body);
      
      const updatedCity = await this.weatherService.updateSavedCity(user, cityId, updateData);
      
      res.json({
        success: true,
        data: updatedCity,
        message: 'City updated successfully',
      });
    } catch (error) {
      logger.error('Error in updateSavedCity:', error);
      
      if (error instanceof Error) {
        if (error.message === 'City not found') {
          res.status(404).json({
            success: false,
            message: 'City not found',
          });
          return;
        }
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to update city',
      });
    }
  };

  deleteSavedCity = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as any; // Set by auth middleware
      const { cityId } = req.params;
      
      await this.weatherService.deleteSavedCity(user, cityId);
      
      res.json({
        success: true,
        message: 'City deleted successfully',
      });
    } catch (error) {
      logger.error('Error in deleteSavedCity:', error);
      
      if (error instanceof Error) {
        if (error.message === 'City not found') {
          res.status(404).json({
            success: false,
            message: 'City not found',
          });
          return;
        }
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to delete city',
      });
    }
  };

  getWeatherForSavedCities = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as any; // Set by auth middleware
      
      const citiesWithWeather = await this.weatherService.getWeatherForSavedCities(user);
      
      res.json({
        success: true,
        data: citiesWithWeather,
      });
    } catch (error) {
      logger.error('Error in getWeatherForSavedCities:', error);
      
      res.status(500).json({
        success: false,
        message: 'Failed to fetch weather for saved cities',
      });
    }
  };
}