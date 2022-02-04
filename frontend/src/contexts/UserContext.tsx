import { useToast } from "@chakra-ui/react";
import {
  createContext,
  Dispatch,
  FC,
  Reducer,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  Cart,
  Item,
  User,
  UserLocation,
  UserReviews,
  UserWishList,
} from "../dt/Item";
import { useAxios } from "../functions/axios/useAxios";

type dispatchDefault = {
  user: User;
  isloading: boolean;
  cart: Cart[];
  wishList: UserWishList[];
  review: UserReviews[];
  location?: UserLocation;
};

interface userContext extends dispatchDefault {
  userdispatch: Dispatch<dispatchUser>;
  addtocart: (item: Cart) => void;
  addtowishlist: (item: UserWishList) => void;
  removefromcart: (item:Item) => void
  isloadingproduct: boolean
}

export const UserContext = createContext<userContext>({
  user: null,
  isloading: true,
  userdispatch: null,
  cart: [],
  wishList: [],
  review: [],
  addtocart: (item: Cart) => {},
  addtowishlist: (item: UserWishList) => {},
  removefromcart: (item:Item) =>{},
  isloadingproduct: false
});

type dispatchUserType =
  | "setuser"
  | "logout"
  | "loading"
  | "lodded"
  | "addtocart"
  | "addtowishlist"
  | "setlocation"
  | "setcart"
  | "setwishlist"
  | "setReview";

type dispatchUser = {
  type: dispatchUserType;
  item?: Item;
  user?: User;
  location?: UserLocation;
  cart?: Cart[];
  wishlist?: UserWishList[];
  review?: UserReviews[];
};

const dispatch: Reducer<dispatchDefault, dispatchUser> = (state, action) => {
  if (action.type === "setuser") {
    return { ...state, user: action.user };
  }
  if (action.type === "lodded") {
    return { ...state, isloading: false };
  }
  if (action.type === "loading") {
    return { ...state, isloading: true };
  }
  if (action.type === "setlocation")
    return { ...state, location: action.location };
  if (action.type === "logout") {
    return { ...dispatchdefaultvalue };
  }
  if (action.type === "setcart") {
    return { ...state, cart: action.cart || [] };
  }
  if (action.type === "setReview") {
    return { ...state, review: action.review || [] };
  }
  if (action.type === "setwishlist") {
    return { ...state, wishList: Array(action?.wishlist) ? [...action?.wishlist] : [] };
  }
  if (action.type === "addtocart") {
    return {
      ...state,
      cart: [
        ...state.cart.filter((item) => item.item.id !== action.cart[0].item.id),
        ...action.cart,
      ],
    };
  }
  if (action.type === "addtowishlist") {
    return { ...state, wishList: [...state.wishList, ...action.wishlist] };
  }
};

const dispatchdefaultvalue: dispatchDefault = {
  user: null,
  isloading: true,
  cart: [],
  wishList: [],
  review: [],
  
};

const UserContextProvider: FC = ({ children }) => {
  const [value, reducer] = useReducer(dispatch, dispatchdefaultvalue);
  const [isloadingproduct,setisloadingproduct] = useState(false)
  const axios = useAxios();
  const toast = useToast();
  const getuser = useCallback(async () => {
    try {
      const data = await axios.get("user/getuser");
      reducer({
        type: "setuser",
        user: {
          email: data.data.email,
          firstname: data.data.firstname,
          lastname: data.data.lastname,
          id: data.data.id,
        },
      });
      reducer({ type: "setcart", cart: data.data.cart });
      reducer({ type: "setwishlist", wishlist: data.data.whishlists });
      reducer({ type: "setReview", review: data.data.reviewes });
      reducer({ type: "setlocation", location: data.data.location })
      reducer({ type: "lodded" });
    } catch (err) {
      console.log(err);
      reducer({ type: "lodded" });
    }
  }, []);
  useEffect(() => {
    getuser();
  }, []);
  const addtocart = async (item: Cart) => {
      
    try {
        setisloadingproduct(true)
      await axios.post("/user/addToCart", {
        itemId: item.item.id,
        amount: item.amount,
      });
      reducer({ type: "addtocart", cart: [item] });
      toast({ status: "success", title: `Added ${item.item.name} to cart` });
      setisloadingproduct(false)
    } catch (err) {
      toast({ status: "error", title: "Added to cart failed" });
      setisloadingproduct(false)
    }
  };
  const addtowishlist = async (item: UserWishList) => {
    try {
      setisloadingproduct(true)
      if (value.wishList.map((item) => item.itemID).includes(item.itemID)) {
        await axios.post("/user/removeWishList", { itemId: item.itemID });
        reducer({
          type: "setwishlist",
          wishlist: [...value.wishList.filter(
            (ite) => ite.itemID !== item.itemID
          )],
        });
        toast({ status: "success", title: `Removed from wishlist` });

      } else {
        await axios.post("/user/addtoWishList", { itemId: item.itemID });
        reducer({ type: "addtowishlist", wishlist: [item] });
        toast({ status: "success", title: `Added to wishlist` });
      }
      setisloadingproduct(false)
    } catch (err) {
      toast({ status: "error", title: "Added to wishlist failed" });
      setisloadingproduct(false)
    }
  };
  const removefromcart = async (item: Item)=>{
      try{
      setisloadingproduct(true)
      await axios.post("/user/removeFromCart",{itemId:item.id})
      reducer({type:"setcart",cart:value.cart.filter(ite=>ite.item.id !== item.id)})
      setisloadingproduct(false)
      }catch(err){
      setisloadingproduct(false)
        toast({ status: "error", title: "Error while remove item from cart" });
      }
  }

  return (
    <UserContext.Provider
      value={{
        ...value,
        userdispatch: reducer,
        addtocart: addtocart,
        addtowishlist: addtowishlist,
        removefromcart:removefromcart,
        isloadingproduct: isloadingproduct
      }}
      children={children}
    />
  );
};

export default UserContextProvider;
