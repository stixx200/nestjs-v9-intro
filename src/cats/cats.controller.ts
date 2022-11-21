import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
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
  @ContentType(catContentType, "application/json")
  create(@Body() createCatDto: CreateCatDto) {
    console.log(createCatDto);
    return this.catsService.create(createCatDto);
  }

  @Get()
  findAll(@Query("minAge") minAge: string) {
    return this.catsService.findAll(parseInt(minAge));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catsService.findOne(id);
  }

  @Patch(':id')
  @ContentType(catContentType, "application/json")
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.update(id, updateCatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catsService.remove(id);
  }
}
