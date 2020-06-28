import { IAdminContext, AdminId } from '@app/auctions/domain/admin';
import { AuthorizedUser } from 'src/rest/core/auth';

export class AdminContext implements IAdminContext {
  public readonly adminId: AdminId;

  constructor(authorizedUser: AuthorizedUser) {
    this.adminId = new AdminId(authorizedUser.userId);
  }
}
