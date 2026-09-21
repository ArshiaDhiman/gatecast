import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Event } from "./event.model";

@Table({ tableName: "invites" })
export class Invite extends Model {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare token: string;

  @ForeignKey(() => Event)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare eventId: number;

  @BelongsTo(() => Event)
  declare event: Event;
}
