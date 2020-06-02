import { AuctionItemImage } from './auctionItemImage';
import {
  InvalidAuctionItemImageError,
  MaxNumberOfImagesReachedError,
} from './errors';

const MAX_IMAGES = 6;

interface AuctionItemProps {
  title: string;
  description: string;
  images: AuctionItemImage[];
  featuredImage: AuctionItemImage;
}

export class AuctionItem {
  public readonly title: string;
  public readonly description: string;
  private _images: AuctionItemImage[];
  private _featuredImage?: AuctionItemImage;

  constructor(props: AuctionItemProps) {
    this.title = props.title;
    this.description = props.description;
    this._images = props.images;
    this._featuredImage = props.featuredImage;
  }

  get images(): Readonly<AuctionItemImage[]> {
    return this._images;
  }

  get featuredImage(): Readonly<AuctionItemImage> {
    return this._featuredImage!;
  }

  titleFormatted(): string {
    const title = this.title.toLocaleLowerCase();
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  hasImage(image: AuctionItemImage) {
    return !!this.images.find((img) => img.equal(image));
  }

  canAddImage(): boolean {
    return this._images.length >= MAX_IMAGES;
  }

  addImage(image: AuctionItemImage): void {
    if (!this.canAddImage()) {
      throw new MaxNumberOfImagesReachedError();
    }

    this._images.push(image);
  }

  setFeaturedImage(image: AuctionItemImage): void {
    if (!this.hasImage(image)) {
      throw new InvalidAuctionItemImageError();
    }

    this._featuredImage = image;
  }
}
