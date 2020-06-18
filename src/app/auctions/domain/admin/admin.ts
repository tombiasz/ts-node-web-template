import { Entity } from '@app/core';
import { AdminId } from './adminId';

interface AdminProps {
  id: AdminId;
}

export class Admin extends Entity<AdminProps> {
  get id() {
    return this.props.id;
  }
}
