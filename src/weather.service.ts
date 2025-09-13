import axios from 'axios';
import { IUser } from './user.types';
import { WeatherResponse, SavedCity, AddCityRequest, UpdateCityRequest } from './weather.types';
import logger from './logger.util';

export class WeatherService {
  private readonly OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
  private readonly OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    if (!this.OPENWEATHER_API_KEY) {
      logger.warn('OPENWEATHER_API_KEY not found in environment variables');
    }
  }

  async getWeatherData(city: string, country?: string): Promise<WeatherResponse> {
    try {
      if (!this.OPENWEATHER_API_KEY) {
        throw new Error('OpenWeatherMap API key not configured');
      }

      const query = country ? `${city},${country}` : city;
      const url = `${this.OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(query)}&appid=${this.OPENWEATHER_API_KEY}&units=metric`;

      logger.info(`Fetching weather data for: ${query}`);
      
      const response = await axios.get<WeatherResponse>(url);
      
      if (response.data.cod !== 200) {
        throw new Error(`Weather API error: ${response.data.cod}`);
      }

      return response.data;
    } catch (error) {
      logger.error('Error fetching weather data:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('City not found');
        } else if (error.response?.status === 401) {
          throw new Error('Invalid API key');
        }
      }
      throw new Error('Failed to fetch weather data');
    }
  }

  async addSavedCity(user: IUser, cityData: AddCityRequest): Promise<SavedCity> {
    try {
      const savedCity: SavedCity = {
        id: this.generateCityId(),
        name: cityData.name,
        country: cityData.country,
        coordinates: cityData.coordinates,
        personName: cityData.personName,
        relationship: cityData.relationship,
        isFavorite: cityData.isFavorite,
        addedDate: new Date(),
      };

      // Add to user's saved cities
      if (!user.savedCities) {
        user.savedCities = [];
      }

      // Check if city already exists
      const existingCity = user.savedCities.find(
        city => city.name === savedCity.name && city.country === savedCity.country
      );

      if (existingCity) {
        throw new Error('City already saved');
      }

      user.savedCities.push(savedCity);
      await user.save();

      logger.info(`Added saved city for user ${user.email}: ${savedCity.name}, ${savedCity.country}`);
      return savedCity;
    } catch (error) {
      logger.error('Error adding saved city:', error);
      throw error;
    }
  }

  async updateSavedCity(user: IUser, cityId: string, updateData: UpdateCityRequest): Promise<SavedCity> {
    try {
      if (!user.savedCities) {
        throw new Error('No saved cities found');
      }

      const cityIndex = user.savedCities.findIndex(city => city.id === cityId);
      if (cityIndex === -1) {
        throw new Error('City not found');
      }

      const city = user.savedCities[cityIndex];
      
      // Update fields if provided
      if (updateData.personName !== undefined) {
        city.personName = updateData.personName;
      }
      if (updateData.relationship !== undefined) {
        city.relationship = updateData.relationship;
      }
      if (updateData.isFavorite !== undefined) {
        city.isFavorite = updateData.isFavorite;
      }

      user.savedCities[cityIndex] = city;
      await user.save();

      logger.info(`Updated saved city for user ${user.email}: ${city.name}`);
      return city;
    } catch (error) {
      logger.error('Error updating saved city:', error);
      throw error;
    }
  }

  async deleteSavedCity(user: IUser, cityId: string): Promise<void> {
    try {
      if (!user.savedCities) {
        throw new Error('No saved cities found');
      }

      const cityIndex = user.savedCities.findIndex(city => city.id === cityId);
      if (cityIndex === -1) {
        throw new Error('City not found');
      }

      const city = user.savedCities[cityIndex];
      user.savedCities.splice(cityIndex, 1);
      await user.save();

      logger.info(`Deleted saved city for user ${user.email}: ${city.name}`);
    } catch (error) {
      logger.error('Error deleting saved city:', error);
      throw error;
    }
  }

  async getSavedCities(user: IUser): Promise<SavedCity[]> {
    try {
      return user.savedCities || [];
    } catch (error) {
      logger.error('Error getting saved cities:', error);
      throw error;
    }
  }

  async getWeatherForSavedCities(user: IUser): Promise<Array<SavedCity & { weather?: WeatherResponse }>> {
    try {
      const savedCities = user.savedCities || [];
      const citiesWithWeather = [];

      for (const city of savedCities) {
        try {
          const weather = await this.getWeatherData(city.name, city.country);
          citiesWithWeather.push({ ...city, weather });
        } catch (error) {
          logger.warn(`Failed to get weather for ${city.name}:`, error);
          citiesWithWeather.push({ ...city });
        }
      }

      return citiesWithWeather;
    } catch (error) {
      logger.error('Error getting weather for saved cities:', error);
      throw error;
    }
  }

  private generateCityId(): string {
    return `city_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}