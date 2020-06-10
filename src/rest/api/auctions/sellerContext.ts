import { ISellerContext } from '@app/auctions/domain/seller/sellerContext';
import { SellerId } from '@app/auctions/domain/seller';
import { AuthorizedUser } from 'src/rest/core/auth';

export class SellerContext implements ISellerContext {
  public readonly sellerId: SellerId;

  constructor(authorizedUser: AuthorizedUser) {
    this.sellerId = new SellerId(authorizedUser.userId);
  }
}
