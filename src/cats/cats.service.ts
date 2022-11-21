import { Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CatMongoose, CatDocument } from './schemas/cat.schema';

@Injectable()
export class CatsService {
  constructor(@InjectModel(CatMongoose.name) private catModel: Model<CatDocument>) {}

  async create(createCatDto: CreateCatDto) {
    const cat = new this.catModel(createCatDto);
    await cat.save();
  }

  async findAll(minAge: number) {
    const filter: any = {};
    if (!Number.isNaN(minAge)) {
      filter.age = { $gte: minAge };
    }
    return await this.catModel.find(filter);
  }

  async findOne(id: string) {
    const cat = await this.catModel.findOne({ _id: id });
    return cat;
  }

  async update(id: string, updateCatDto: UpdateCatDto) {
    const cat = await this.findOne(id);
    // cat.name = updateCatDto.name || cat.name;
    // cat.age = updateCatDto.age || cat.age;
    Object.assign(cat, updateCatDto);
    await cat.save();
  }

  async remove(id: string) {
    await this.catModel.deleteOne({ _id: id });
  }
}
