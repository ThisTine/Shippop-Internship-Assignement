import { Body, Controller, Delete, Get, Patch, Post, Req } from '@nestjs/common';
import { UserRequest } from 'src/logger.middleware';
import { AddDiscountDto } from './dto/add-discount.dto';
import { CreateCategoryDto } from './dto/create-category-dto';
import { CreateItemDto } from './dto/create-item-dto';
import { DeleteDiscountDto } from './dto/delete-discount-dto';
import { RemoveItemDto } from './dto/remove-item-dto';
import { SetHideItemDto } from './dto/set-hide-item-dto';
import { UpdateItemDto } from './dto/update-item-dto';
import { ManageService } from './manage.service';

@Controller('manage')
export class ManageController {
  constructor(private readonly manageService: ManageService) {}
  @Get('getitems')
  getOwnItems(@Req() req:UserRequest){
    return this.manageService.getOwnItems(req)
  }
  @Patch("updateitem")
  updateItems(@Req() req:UserRequest, @Body() dto:UpdateItemDto){
    return this.manageService.updateItem(req,dto)
  }
  @Post("adddiscount")
  addDiscount(@Req() req:UserRequest, @Body() dto:AddDiscountDto){
    return this.manageService.addDiscount(req,dto)
  }
  @Post('addcategory')
  createCategory(@Body() dto:CreateCategoryDto){
    return this.manageService.createCategory(dto)
  }
  @Post('createItem')
  createItem(@Req() req:UserRequest,@Body() dto:CreateItemDto){
    return this.manageService.createItem(req,dto)
  }
  @Delete('removediscount')
  removeDiscount(@Req() req:UserRequest, @Body() dto:DeleteDiscountDto){
    return this.manageService.removeDiscount(req,dto)
  }
  @Delete('removeitem')
  removeItem(@Req() req:UserRequest,@Body() dto:RemoveItemDto){
    return this.manageService.removeItem(req,dto)
  }
  @Post('sethideitem')
  sethideitem(@Req() req:UserRequest, @Body() dto:SetHideItemDto){
    return this.manageService.sethideItem(req,dto)
  }
}
