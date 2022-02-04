import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRequest } from 'src/logger.middleware';
import { PrismaService } from 'src/prisma/prisma.service';
import { LimitItemDto } from './dto/limit-item-dto';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}
  async findOne(request: UserRequest, id: string) {
    try {
      const data = await this.prisma.item.findFirst({
        where: { id },
        include: { saleprice: true, owner: { select: { firstname: true } },itemCategory:{select:{name:true}} },
      });
      if (!data || (data.ishide && data.ownerID !== request.user?.id)) {
        throw new HttpException('No data', HttpStatus.BAD_REQUEST);
      }
      if (data.saleprice?.expire > new Date()) {
        return data;
      }
      return { ...data, saleprice: null };
    } catch (err) {
        console.log(err)
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        'Internal server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getbestsellter(dto: LimitItemDto) {
    try {
      const data = await this.prisma.item.findMany({
        where: { ishide: false },
        orderBy: { sold: 'desc' },
        take: dto.islimit ? 10 : 100,
        include: { saleprice: true, itemCategory: { select: { name: true } } },
      });
      const date = new Date();
      return data.map((item) => {
        if (item.saleprice && item.saleprice.expire > date) {
          return { ...item };
        }
        return { ...item, saleprice: null };
      });
    } catch (err) {
      console.log(err);
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        'Internal server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async searchData(search: string) {
    try {
      const data = await this.prisma.item.findMany({
        where: { ishide: false, amount: { gt: 0 }, name: { contains: search,mode:"insensitive" } },
        include: { saleprice: true },
      });
      const date = new Date();
      return data.map((item) => {
        if (item.saleprice && item.saleprice.expire > date) {
          return { ...item };
        }
        return { ...item, saleprice: null };
      });
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        'Internal server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getAllItem(dto: LimitItemDto) {
    try {
      const data = await this.prisma.item.findMany({
        where: { ishide: false },
        take: dto.islimit ? 10 : 100,
        orderBy:{createDate:"desc"},
        include: { saleprice: true, itemCategory: { select: { name: true } } },
      });
      const date = new Date();
      return data.map((item) => {
        if (item.saleprice && item.saleprice.expire > date) {
          return { ...item };
        }
        return { ...item, saleprice: null };
      });
    } catch (err) {
      console.log(err);
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        err,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async getOnSale() {
    try {
      const data = await this.prisma.item.findMany({
        where: { saleprice: { expire: { gte: new Date() } } },
        include: { saleprice: true },
      });
      return data;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        'Internal server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getFromCategory(id: string) {
    try {
      const data = await this.prisma.item.findMany({
        where: { categoryId: id, amount: { gt: 0 } },
        include: { saleprice: true },
      });
      const date = new Date();
      return data.map((item) => {
        if (item.saleprice && item.saleprice.expire > date) {
          return { ...item };
        }
        return { ...item, saleprice: null };
      });
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        'Internal server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getAllCategory() {
    try {
      const data = await this.prisma.itemCategory.findMany();
      return data;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        'Internal server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
