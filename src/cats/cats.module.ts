import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { ContentTypeGuardGuard } from 'src/content-type-guard/content-type-guard.guard';

@Module({
  controllers: [CatsController],
  providers: [CatsService, ContentTypeGuardGuard]
})
export class CatsModule {}
