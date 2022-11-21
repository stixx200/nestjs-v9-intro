import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ContentTypeGuardGuard } from 'src/content-type-guard/content-type-guard.guard';
import { ContentType } from 'src/content-type-guard/content-type.decorator';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

export const catContentType = "application/vnd.cat+json";

@Controller('cats')
@UseGuards(ContentTypeGuardGuard)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @ContentType(catContentType)
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Get()
  findAll() {
    return this.catsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catsService.findOne(parseInt(id));
  }

  @Patch(':id')
  @ContentType(catContentType)
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.update(+id, updateCatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catsService.remove(+id);
  }
}
