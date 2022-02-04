import { Cart } from "../../dt/Item";

const total = (item:Cart[])=>item.map(
    (item) =>
      item.amount *
      (item.item.saleprice
        ? item.item.saleprice.newprice
        : item.item.price)
  )
  .reduce((a, b) => a + b, 0)

export default total