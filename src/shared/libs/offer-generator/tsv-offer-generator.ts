import dayjs from 'dayjs';

import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData, CityType, UserType, GoodsType, OfferType } from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';

const MIN_PRICE = 100;
const MAX_PRICE = 100000;

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_COMMENT_COUNT = 1;
const MAX_COMMENT_COUNT = 5;

const MIN_BEDROOMS = 1;
const MAX_BEDROOMS = 8;

const MIN_ADULTS = 1;
const MAX_ADULTS = 10;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const createdDate = dayjs().
      subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').
      toISOString();
    const city = getRandomItem([CityType.Paris, CityType.Cologne, CityType.Brussels, CityType.Amsterdam, CityType.Hamburg, CityType.Dusseldorf]);
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const images = getRandomItems<string>(this.mockData.images).join(';');
    const isPremium = Boolean(generateRandomValue(0, 1)).toString();
    const isFavorite = Boolean(generateRandomValue(0, 1)).toString();
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1).toString();
    const type = getRandomItem([OfferType.Apartment, OfferType.Hotel, OfferType.House, OfferType.Room]);
    const bedrooms = generateRandomValue(MIN_BEDROOMS, MAX_BEDROOMS).toString();
    const maxAdults = generateRandomValue(MIN_ADULTS, MAX_ADULTS).toString();
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const goods = getRandomItems([GoodsType.AirConditioning, GoodsType.BabySeat, GoodsType.Breakfast, GoodsType.Fridge, GoodsType.LaptopFriendlyWorkspace, GoodsType.Towels, GoodsType.Washer]
    ).join(';');
    const name = getRandomItem<string>(this.mockData.names);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatarPath = getRandomItem<string>(this.mockData.avatarPaths);
    const password = getRandomItem<string>(this.mockData.passwords);
    const userType = getRandomItem([UserType.User, UserType.Pro]);
    const commentCount = generateRandomValue(MIN_COMMENT_COUNT, MAX_COMMENT_COUNT).toString();
    const location = getRandomItem<string>(this.mockData.locations);


    return [
      title, description, createdDate,city, previewImage,
      images, isPremium, isFavorite, rating, price, type, bedrooms, maxAdults, price, goods, name, email, avatarPath, password, userType, commentCount, location
    ].join('\t');
  }
}
