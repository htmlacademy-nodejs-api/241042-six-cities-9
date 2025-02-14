import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { User, Offer, OfferType, City, Goods, UserType, Location } from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  private validateRawData(): void {
    if (! this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      createdDate,
      city,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      type,
      bedrooms,
      maxAdults,
      price,
      goods,
      name,
      email,
      password,
      avatarPath,
      userType,
      commentCount,
      location,
    ] = line.split('\t');

    return {
      title: title || '',
      description: description || '',
      createdDate: new Date(createdDate) || new Date(),
      city: city as City,
      previewImage: previewImage || '',
      images: this.parseStringToArray<string[]>(images),
      isPremium: isPremium === 'true',
      isFavorite: isFavorite === 'true',
      rating: this.parseStringToNumber(rating),
      type: type as OfferType,
      bedrooms: this.parseStringToNumber(bedrooms),
      maxAdults: this.parseStringToNumber(maxAdults),
      price: this.parseStringToNumber(price),
      goods: this.parseStringToArray<Goods[]>(goods),
      author: this.parseAuthor(name, email, password, avatarPath, userType),
      commentCount: this.parseStringToNumber(commentCount),
      location: this.parseLocation(location),
    };
  }

  private parseStringToArray<T>(value: string): T {
    return value.split(';') as T || [] as T;
  }

  private parseStringToNumber(value: string): number {
    return Number.parseInt(value, 10) || 0;
  }

  private parseLocation(location: string): Location {
    const [latitude, longitude] = location.split(';');
    return {
      latitude: parseFloat(latitude) || 0,
      longitude: parseFloat(longitude) || 0,
    };
  }

  private parseAuthor(
    name: string,
    email: string,
    password: string,
    avatarPath: string,
    userType: string): User {
    return {
      name: name || '',
      email: email || '',
      avatarPath: avatarPath || '',
      password: password || '',
      type: userType as UserType || '',
    };
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, {encoding: 'utf-8'});
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
