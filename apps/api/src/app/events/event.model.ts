import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Invite } from "./invite.model";

@Table({ tableName: "events" })
export class Event extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare streamUrl: string;

  @Column({ type: DataType.DATE, allowNull: false })
  declare startsAt: Date;

  @HasMany(() => Invite)
  declare invites: Invite[];
}
