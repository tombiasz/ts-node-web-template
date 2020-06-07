interface AuctionItemImageProps {
  path: string;
  description?: string;
}

export class AuctionItemImage {
  public readonly path: string;
  public readonly description?: string;

  constructor(props: AuctionItemImageProps) {
    this.path = props.path;
    this.description = props.description || '';
  }

  equal(other: AuctionItemImage) {
    return this.path === other.path;
  }
}
