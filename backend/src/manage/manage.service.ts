import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRequest } from 'src/logger.middleware';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddDiscountDto } from './dto/add-discount.dto';
import { CreateCategoryDto } from './dto/create-category-dto';
import { CreateItemDto } from './dto/create-item-dto';
import { DeleteDiscountDto } from './dto/delete-discount-dto';
import { UpdateItemDto } from './dto/update-item-dto';
import { S3 } from 'aws-sdk';
import { RemoveItemDto } from './dto/remove-item-dto';
import { SetHideItemDto } from './dto/set-hide-item-dto';
const imagemin = require('imagemin');
// const imageminMozjpeg = require('imagemin-mozjpeg');

@Injectable()
export class ManageService {
    constructor(private prisma: PrismaService){}
    async getOwnItems(req:UserRequest){
        try{
            const data = this.prisma.item.findMany({where:{ownerID:req.user.id},orderBy:{createDate:"desc"},include:{saleprice:true}})
            return data
        }catch(err){
            if(err instanceof HttpException){
                throw err
              }
              throw new HttpException("Internal server Error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    async updateItem(req:UserRequest,dto:UpdateItemDto){
        try{
            const data = await this.prisma.item.findFirst({where:{id:dto.itemID,ownerID:req.user.id},include:{saleprice:{select:{newprice:true}}}})
            console.log(data)
            if(!data){
                throw new HttpException("Item not found",HttpStatus.BAD_REQUEST)
            }
            
            if(data.saleprice?.newprice && parseFloat(data.saleprice.newprice+"") >= dto.price){
                await this.prisma.itemOnSale.delete({where:{itemID:dto.itemID}})
            }
            const update = await this.prisma.item.update({where:{id:dto.itemID},data:{name:dto.name,description:dto.description,price:dto.price}})
            return update
        }catch(err){
            console.log(err)
            if(err instanceof HttpException){
                throw err
              }
              throw new HttpException("Internal server Error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    async addDiscount(req:UserRequest,dto:AddDiscountDto){
        try{
            const data = await this.prisma.item.findFirst({where:{id:dto.itemID,ownerID:req.user.id}})
            if(!data){
                throw new HttpException("Item not found",HttpStatus.BAD_REQUEST)
            }
            if(parseFloat(data.price+"")< dto.price){
                throw new HttpException("discount should be lower than price",HttpStatus.BAD_REQUEST)
            }
            const discount = await this.prisma.itemOnSale.upsert({where:{itemID:dto.itemID},
                create:{expire:dto.expire,itemID:dto.itemID,newprice:dto.price},
                update:{expire:dto.expire,itemID:dto.itemID,newprice:dto.price}
            })
            return discount

        }catch(err){
            if(err instanceof HttpException){
                throw err
              }
              throw new HttpException("Internal server Error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async removeDiscount(req:UserRequest,dto:DeleteDiscountDto){
        try{
            const data = await this.prisma.itemOnSale.findFirst({where:{itemID:dto.itemID},include:{item:true}})
            if(!data || data.item.ownerID !== req.user.id ){
                throw new HttpException("Item not found",HttpStatus.BAD_REQUEST)
            }
            const discount = await this.prisma.itemOnSale.delete({where:{itemID:dto.itemID}})
            return discount
       }catch(err){
            if(err instanceof HttpException){
                throw err
              }
              throw new HttpException("Internal server Error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async createCategory(dto:CreateCategoryDto){
        try{
            const category = await this.prisma.itemCategory.findFirst({where:{name:dto.name}})
            if(category){
                throw new HttpException("category already exist",HttpStatus.BAD_REQUEST)
            }
            const data = await this.prisma.itemCategory.create({data:{...dto},select:{id:true,name:true}})
            return data
        }catch(err){
            if(err instanceof HttpException){
                throw err
              }
              throw new HttpException("Internal server Error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async removeItem(req:UserRequest,dto:RemoveItemDto){
        try{
            const item = await this.prisma.item.deleteMany({where:{id:dto.itemId,ownerID:req.user.id}})
            if(!item){
                throw new HttpException("Item not found",HttpStatus.BAD_REQUEST)
            }
            return item
        }catch(err){
            if(err instanceof HttpException){
                throw err
              }
              throw new HttpException("Internal server Error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    async createItem(req:UserRequest,dto:CreateItemDto){
        try{
            const s3 = new S3()
            const category = await this.prisma.itemCategory.findFirst({where:{id:dto.categoryId}})
            if(!category){
                throw new HttpException("category not found",HttpStatus.BAD_REQUEST)
            }
            const fakedto = {...dto}
            delete fakedto['image']
            const ogbuffer = Buffer.from(dto.image.replace(/^data:image\/\w+;base64,/, ""),"base64")
            const buffer = await imagemin.buffer(ogbuffer,{
                // use:[imageminMozjpeg({quality:50})]
            })
            console.log(buffer)
            const data = await this.prisma.item.create({data:{...fakedto,ownerID:req.user.id}})
            const uploadresult = await s3.upload({
                Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
                Body: buffer,
                ContentType: 'image/jpeg',
                Key: `${data.id}`
            }).promise()
            console.log(uploadresult.Location)
            return data
        }catch(err){
            if(err instanceof HttpException){
                throw err
              }
              throw new HttpException("Internal server Error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async sethideItem(req:UserRequest,dto:SetHideItemDto){
        try{
            await this.prisma.item.updateMany({where:{id:dto.itemId,ownerID:req.user.id},data:{ishide:dto.ishide}})
            return {ishide:dto.ishide}
        }catch(err){
            if(err instanceof HttpException){
                throw err
              }
              throw new HttpException("Internal server Error",HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
