import { Router } from 'express';
import { WeatherController } from './weather.controller';
import { validateBody, validateQuery } from '../../shared/middleware/validation.middleware';
import { addCityRequestSchema, updateCityRequestSchema, weatherRequestSchema } from './weather.types';
import { authenticateToken } from '../../shared/middleware/auth.middleware';

const router = Router();
const weatherController = new WeatherController();

// Public weather endpoint (no auth required)
router.get(
  '/weather',
  validateQuery(weatherRequestSchema),
  weatherController.getWeather
);

// Protected endpoints (require authentication)
router.use(authenticateToken);

// Saved cities management
router.post(
  '/saved-cities',
  validateBody(addCityRequestSchema),
  weatherController.addSavedCity
);

router.get(
  '/saved-cities',
  weatherController.getSavedCities
);

router.put(
  '/saved-cities/:cityId',
  validateBody(updateCityRequestSchema),
  weatherController.updateSavedCity
);

router.delete(
  '/saved-cities/:cityId',
  weatherController.deleteSavedCity
);

// Weather for saved cities
router.get(
  '/saved-cities/weather',
  weatherController.getWeatherForSavedCities
);

export default router;