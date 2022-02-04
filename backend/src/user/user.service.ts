import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserRequest } from 'src/logger.middleware';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart-dto';
import { CheckOutDto } from './dto/checkout-dto';
import { FindUserDto } from './dto/find-user-dto';
import { LocationDto } from './dto/location-dto';
import { ReviewDto } from './dto/review-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddWishListDto } from './dto/wishlist-add-dto';
@Injectable()
export class UserService {
  constructor(private prisma:PrismaService){}
  async getUser(request: UserRequest){
    const data = await this.prisma.user.findFirst({where:{id:request.user.id},include:{
      location:true,
      whishlists:{select:{itemID:true}},
      cart:{select:{item:true,amount:true}},
      reviewes:{select:{itemID:true,rating:true}}
    }})
    return data
  }
  async getUserCart(request: UserRequest){
    try{
      const data = await this.prisma.cartItem.findMany(
        {where:{userID:request.user.id},select:{item:{include:{
        saleprice:true}}}})
      const date = new Date()
      return  data.map(item=>{
        if(item.item.saleprice && item.item.saleprice.expire > date){
          return{...item}
        }
        return {...item,saleprice:null}
      })
    }catch(err){
      throw new HttpException("Failed getting whishlist",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne({userId}: FindUserDto) {
    try{
      const user = await this.prisma.user.findFirst({where:{id:userId},include:{items:true}})
      if(!user){
        throw new HttpException("user does not exist",HttpStatus.BAD_REQUEST)
      }
      delete user['pwd']
      return {...user}
    }catch(err){
      if(err instanceof HttpException){
        throw err
      }
      throw new HttpException("Internal server Error",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(request: UserRequest,updateUserDto: UpdateUserDto) {
    try{
      const user = await this.prisma.user.update({where:{id:request.user.id},data:{...updateUserDto}})
      delete user['pwd']
      return {...user}
    }catch(err){
      throw new HttpException("Update error",HttpStatus.BAD_REQUEST)
    }
  }

  async getWhishList(request: UserRequest){
    try{
      const data = await this.prisma.userWhishlist.findMany({where:{userID:request.user.id},select:{item:{include:{
        saleprice:true
      }}}})
      const date = new Date()
      return  data.map(item=>{
        if(item.item.saleprice && item.item.saleprice.expire > date){
          return{...item.item}
        }
        return {...item.item,saleprice:null}
      })
    }catch(err){
      throw new HttpException("Failed getting whishlist",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async addWhishList(req : UserRequest, dto: AddWishListDto){
    try{
      await this.prisma.userWhishlist.create({data:{itemID:dto.itemId,userID:req.user.id}})
      return {isok: true}
    }catch(err){
      if(err instanceof HttpException){
        throw err
      }
      throw new HttpException("Internal server Error",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async removeWishList(req : UserRequest, dto: AddWishListDto){
    try{
      await this.prisma.userWhishlist.delete({where:{itemID_userID:{itemID:dto.itemId,userID:req.user.id} }})
      return {isok: true}
    }catch(err){
      if(err instanceof HttpException){
        throw err
      }
      throw new HttpException("Internal server Error",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async addToCart(req: UserRequest, dto: AddToCartDto){
    try{
      const item = await this.prisma.item.findFirst({where:{id:dto.itemId}})
      if(!item) throw new HttpException("No Item",HttpStatus.BAD_REQUEST)
      if(item.amount < dto.amount) throw new HttpException("Too many amount",HttpStatus.BAD_REQUEST)
      const addeditem = await this.prisma.cartItem.upsert({
        where:{itemID_userID:{itemID:dto.itemId,userID:req.user.id}},
        update:{amount:dto.amount},
        create:{
          userID:req.user.id,
          itemID:dto.itemId,
          amount:dto.amount
        },
        include:{item:true}
      })
      return {...addeditem.item}
    }catch(err){
      if(err instanceof HttpException){
        throw err
      }
      throw new HttpException("Internal server Error",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async removeFromCart(req: UserRequest,dto: AddWishListDto){
    try{
      await this.prisma.cartItem.delete({where:{itemID_userID:{itemID:dto.itemId,userID:req.user.id}}})
      return {isok: true}
    }catch(err){
      if(err instanceof HttpException){
        throw err
      }
      throw new HttpException("Internal server Error" ,HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async addLocation(req: UserRequest,dto: LocationDto){
    try{
      const location = await this.prisma.userLocation.upsert({
        where:{userID:req.user.id},
        update:{...dto},
        create:{...dto,userID:req.user.id}})
      return {...location}
    }catch(err){
      if(err instanceof HttpException){
        throw err
      }
      throw new HttpException("Internal server Error",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  async clearCart(req:UserRequest){
    try{
      await this.prisma.cartItem.deleteMany({where:{userID:req.user.id}})
      return {isok:true}
    }catch(err){
      if(err instanceof HttpException){
        throw err
      }
      throw new HttpException("Internal server Error",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getLogistic(req:UserRequest){
    try{
      const data = await this.prisma.logisticChannel.findMany()
      return [...data]
    }catch(err){
      if(err instanceof HttpException){
        throw err
      }
      throw new HttpException("Internal server Error",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async checkout(req: UserRequest,dto:CheckOutDto){
    try{
      if(dto.updateLocation){
        await this.addLocation(req,dto.location)
      }
      const items = await this.prisma.cartItem.findMany({where:{userID:req.user.id},
        select:{item: {include:{saleprice:{select:{newprice:true,expire:true}}}} ,amount:true}})
      const logistic = await this.prisma.logisticChannel.findFirst({where:{id:dto.logisticId}})
      const buylist = await Promise.all(items.map(async item=>{
        await this.prisma.item.update({where:{id:item.item.id},data:{amount:{decrement:item.amount},sold:{increment:item.amount}}})
        return {name: item.item.name,
          price:item.item.saleprice && item.item.saleprice.expire > new Date() ? item.item.saleprice.newprice : item.item.price ,
          id: item.item.id,amount:item.amount}
      }))
      let price = 0
      const jsondata = buylist.map(item=>{
        price += parseFloat(item.price+"")*item.amount
        return item
      }) as Prisma.JsonFilter
      price += parseFloat(logistic.price+"")
      const buylog = await this.prisma.checkOutLog.create({data:{
        userID:req.user.id,
        paymentChannel:dto.payment,
        data:jsondata,
        price:price
      }})
      await this.prisma.cartItem.deleteMany({where:{userID:req.user.id}})
      return buylog
    }catch(err){
      if(err instanceof HttpException){
        throw err
      }
      throw new HttpException("Internal server Error",HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }

  async getBuylog(req: UserRequest){
    try{
      const buylog = await this.prisma.checkOutLog.findMany({where:{userID:req.user.id}})
      return buylog
    }catch(err){
      if(err instanceof HttpException){
        throw err
      }
      throw new HttpException("Internal server Error",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async reviewItem(req: UserRequest,dto:ReviewDto){
    try{
      const data = await this.prisma.item.findFirst({where:{id:dto.itemId}})
      if(!data){
        throw new HttpException("No data",HttpStatus.BAD_REQUEST)
      }
      if(data.ownerID === req.user.id){
        throw new HttpException("Owner cannot review your own item",HttpStatus.BAD_REQUEST)
      }
      const isreview = await this.prisma.userOnReview.findFirst({where:{itemID:dto.itemId,userID:req.user.id}})
      if(isreview){
        await this.prisma.item.update({where:{id:dto.itemId},data:{reviewscore: {decrement: isreview.rating}}})
      }else{
        await this.prisma.item.update({where:{id:dto.itemId},data:{reviewcount:{increment:1}}})
      }
      await this.prisma.item.update({where:{id:dto.itemId},data:{reviewscore: {increment: dto.review}}})
      const review = await this.prisma.userOnReview.upsert({where:{itemID_userID:{itemID:dto.itemId,userID:req.user.id}},
      update: {rating:dto.review},
      create:{rating:dto.review,userID:req.user.id,itemID:dto.itemId},
      })
      return review
    }catch(err){
      if(err instanceof HttpException){
        throw err
      }
      throw new HttpException("Internal server Error",HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

}
