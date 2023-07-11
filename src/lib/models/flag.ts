import { Column, Model, Table, Index } from 'sequelize-typescript';
import { Field, ObjectType } from 'type-graphql';

export type FlagState = 'QUEUED' | 'SKIPPED' | 'ACCEPTED' | 'REJECTED';

@ObjectType()
@Table
export default class Flag extends Model<Flag> {
  @Field()
  @Column({ primaryKey: true, unique: true })
  flag!: string;

  @Field()
  @Column({ allowNull: false })
  service!: string;

  @Field()
  @Column({ allowNull: false })
  exploit!: string;

  @Field()
  @Column({ allowNull: false })
  team!: string;

  @Field()
  @Column({ allowNull: false })
  timestamp!: Date;

  @Field()
  @Column({ allowNull: false })
  tick!: string;

  @Field({ nullable: true })
  @Column({ allowNull: true, defaultValue: 'QUEUED' })
  @Index({
    where: { status: 'QUEUED' }
  })
  status!: FlagState;

  @Field({ nullable: true })
  @Column({ allowNull: true })
  checksystem_response!: string;
}
