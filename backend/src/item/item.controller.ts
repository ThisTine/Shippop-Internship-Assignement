import { Body, Controller, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { ItemService } from './item.service';
import {LimitItemDto} from './dto/limit-item-dto'

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}
  @Get("findOne/:id")
  findOne(@Param('id') id : string,@Req() req : Request){
    return this.itemService.findOne(req,id)
  }

  @Get("search/:name")
  searchData(@Param('name') name : string){
    return this.itemService.searchData(name)
  }

  @Get("getall/:limit")
  getAllItem(@Param('limit') limit:string){
    return this.itemService.getAllItem({islimit: limit === "true"})
  }

  @Get("getbestseller/:limit")
  getbestsellter(@Param('limit') limit:string){
    return this.itemService.getbestsellter({islimit: limit === "true"})
  }

  @Get("onsale")
  getOnSale(){
    return this.itemService.getOnSale()
  }

  @Get("findbycategory/:id")
  getFromCategory(@Param('id') id :string){
    return this.itemService.getFromCategory(id)
  }

  @Get("allcategory")
  getAllCategory(){
    return this.itemService.getAllCategory()
  }
}
