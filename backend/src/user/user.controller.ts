import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRequest } from 'src/logger.middleware';
import { FindUserDto } from './dto/find-user-dto';
import { AddWishListDto } from './dto/wishlist-add-dto';
import { AddToCartDto } from './dto/add-to-cart-dto';
import { CheckOutDto } from './dto/checkout-dto';
import { ReviewDto } from './dto/review-dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('getuser')
  getUser(@Req() request: UserRequest){
    return this.userService.getUser(request)
  }

  @Post()
  findOne(@Body() dto: FindUserDto){
    return this.userService.findOne(dto)
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto, @Req() req:UserRequest) {
    return this.userService.update(req,updateUserDto);
  }

  @Get('getWhishlist')
  getWhishList(@Req() req: UserRequest){
    return this.userService.getWhishList(req)
  }

  @Post('addtoWishList')
  addWishList(@Req() req: UserRequest,  @Body() dto:AddWishListDto){
    return this.userService.addWhishList(req,dto)
  }

  @Post('removeWishList')
  removeWishList(@Req() req: UserRequest,  @Body() dto:AddWishListDto){
    return this.userService.removeWishList(req,dto)
  }

  @Post('addToCart')
  addToCart(@Req() req: UserRequest,  @Body() dto : AddToCartDto ){
    return this.userService.addToCart(req,dto)
  }

  @Post('removeFromCart')
  removeFromCart(@Req() req: UserRequest,  @Body() dto : AddWishListDto ){
    return this.userService.removeFromCart(req,dto)
  }
  @Post('clearcart')
  clearCart(@Req() req:UserRequest){
    return this.userService.clearCart(req)
  }
  @Post('checkout')
  checkout(@Req() req: UserRequest, @Body() dto:CheckOutDto){
    return this.userService.checkout(req,dto)
  }

  @Get("getlogistic")
  getLogistic(@Req() req:UserRequest){
    return this.userService.getLogistic(req)
  }

  @Get('cart')
  getUserCart(@Req() req: UserRequest){
    return this.userService.getUserCart(req)
  }

  @Get('getbuylog')
  getBuylog(@Req() req:UserRequest){
    return this.userService.getBuylog(req)
  }

  @Post('review')
  review(@Req() req:UserRequest, @Body() dto: ReviewDto ){
    return this.userService.reviewItem(req,dto)
  }
}
