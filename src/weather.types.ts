import { z } from 'zod';

// Weather API Response Types
export interface WeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  name: string;
  cod: number;
}

// Saved City Types
export interface SavedCity {
  id: string;
  name: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  personName?: string; // Friend/family member name
  relationship?: string; // "Family", "Friend", "Colleague", etc.
  isFavorite: boolean;
  addedDate: Date;
}

// API Request/Response Types
export const addCityRequestSchema = z.object({
  name: z.string().min(1, 'City name is required'),
  country: z.string().min(1, 'Country is required'),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  personName: z.string().optional(),
  relationship: z.string().optional(),
  isFavorite: z.boolean().default(false),
});

export const updateCityRequestSchema = z.object({
  personName: z.string().optional(),
  relationship: z.string().optional(),
  isFavorite: z.boolean().optional(),
});

export const weatherRequestSchema = z.object({
  city: z.string().min(1, 'City name is required'),
  country: z.string().optional(),
});

export type AddCityRequest = z.infer<typeof addCityRequestSchema>;
export type UpdateCityRequest = z.infer<typeof updateCityRequestSchema>;
export type WeatherRequest = z.infer<typeof weatherRequestSchema>;