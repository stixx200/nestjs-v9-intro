import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Cat } from '../entities/cat.entity';

export type CatDocument = HydratedDocument<CatMongoose>;

@Schema()
export class CatMongoose extends Cat {
  @Prop()
  name: string;

  @Prop()
  age: number;
}

export const CatSchema = SchemaFactory.createForClass(CatMongoose);