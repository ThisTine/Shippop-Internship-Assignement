export type Item = {
    id: string
    name: string
    publisher: string | null
    description: string
    price: Prisma.Decimal
    ownerID: string
    createDate: Date
    ishide: boolean
    amount: number
    categoryId: string
    sold: number
    reviewcount: number
    reviewscore: number
    saleprice?: ItemOnSale
    owner:User,
    itemCategory?:category
  }
export type category = {
  id?:string,
  name:string
}
export type ItemOnSale = {
    itemID: string
    newprice: Prisma.Decimal
    expire: Date
  }

export type User = {
    id: string
    firstname: string
    lastname: string
    email: string
  }

export type UserLocation = {
    id: string
    userID: string
    firstname: string
    lastname: string
    country: string
    location: string
    district: string
    city: string
    province: string
    zipcode: string
    phonenumber: string
  }

export type Cart = {
  item:Item,
  amount:number
}

export type UserWishList = {
  itemID:string,
}

export type UserReviews = {
  itemID:string,
  rating:number
}

export type Logistic = {
  id:string
  price:string
  name:string
}

export type Itemlog = {
  id:string,
  name:string,
  price:string,
  amount?:number
}

export type Buylog = {
  createdDate: string,
  data: itemlog[],
  paymentChannel:string,
  price:string,
  userID:string
}