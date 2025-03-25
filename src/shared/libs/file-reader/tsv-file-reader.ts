import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { User, Offer, OfferType, CityType, GoodsType, UserType, Location } from '../../types/index.js';

const RADIX = 10;
const TSV_ROW_DELIMITER = '\t';
const ARRAY_DELIMITER = ';';

export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384; // 16KB

  constructor(
    private readonly filename: string
  ) {
    super();
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
    ] = line.split(TSV_ROW_DELIMITER);

    return {
      title,
      description,
      createdDate: this.validateDate(new Date(createdDate)),
      city: city as CityType,
      previewImage,
      images: this.parseStringToArray<string[]>(images),
      isPremium: this.parseBoolean(isPremium),
      isFavorite: this.parseBoolean(isFavorite),
      rating: this.validateRating(rating),
      type: type as OfferType,
      bedrooms: this.parseStringToNumber(bedrooms),
      maxAdults: this.parseStringToNumber(maxAdults),
      price: this.parseStringToNumber(price),
      goods: this.parseStringToArray<GoodsType[]>(goods),
      author: this.parseAuthor(name, email, password, avatarPath, userType as UserType),
      commentCount: this.parseStringToNumber(commentCount),
      location: this.parseLocation(location),
    };
  }

  private parseStringToArray<T>(value: string): T {
    return value.split(ARRAY_DELIMITER) as T;
  }

  private parseStringToNumber(value: string): number {
    return Number.parseInt(value, RADIX);
  }

  private parseLocation(location: string): Location {
    const [latitude, longitude] = location.split(ARRAY_DELIMITER);
    return {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };
  }

  private parseBoolean(value: string): boolean {
    return value === 'true';
  }

  private parseAuthor(
    name: string,
    email: string,
    password: string,
    avatarPath: string,
    userType: string
  ): User {
    return {
      name,
      email,
      avatarPath,
      password,
      type: userType as UserType,
    };
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);
        this.emit('line', parsedOffer);
      }
    }

    this.emit('end', importedRowCount);
  }

  private validateDate(date: Date): Date {
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }
    return date;
  }

  private validateRating(rating: string): number {
    if (parseInt(rating, RADIX) < 0 || parseInt(rating, RADIX) > 5) {
      throw new Error('Rating must be between 0 and 5');
    }
    return parseInt(rating, RADIX);
  }
}
