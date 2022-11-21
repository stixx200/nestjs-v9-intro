import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { ContentTypeGuardGuard } from 'src/content-type-guard/content-type-guard.guard';
import { MongooseModule } from "@nestjs/mongoose";
import { CatMongoose, CatSchema } from './schemas/cat.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: CatMongoose.name, schema: CatSchema },
  ])],
  controllers: [CatsController],
  providers: [CatsService, ContentTypeGuardGuard]
})
export class CatsModule {}
