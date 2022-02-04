import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Input } from "@chakra-ui/react";
import { createContext, Dispatch, FC, Reducer, ReducerAction, ReducerWithoutAction, useReducer } from "react";
import AddCouponModal from "../components/Modal/AddCouponModal";
import BuyLogModal from "../components/Modal/BuyLogModal";
import CreateItemModal from "../components/Modal/CreateItemModal";
import EditItemModal from "../components/Modal/EditItemModal";
import EditProfileModal from "../components/Modal/EditProfileModal";
import LoginModal from "../components/Modal/LoginModal";
import RegisterModal from "../components/Modal/RegisterModal";
import { Item } from "../dt/Item";

export const ModalContext = createContext<{dispatch:Dispatch<reduceractiontype>}>({
    dispatch: null
})

type itemdatatype = {
    name:string,
    description:string,
    price:number
}
type reduceractiontypetype = "login" | "register" | "editusername" | "editproduct" | "close" | "isloading" | "loaded" | "addcoupon" | "createItem" | "buylog"
type reduceractiontype = {type:reduceractiontypetype,itemdata?:Item}

type reducertype = {
    name: reduceractiontypetype,
    itemdata : Item,
    isloading: boolean
}

export type modalcontroltype = {
    onClose : ()=>void,
    state : reducertype,
    dispatch: Dispatch<reduceractiontype>
}

const reducervalue:reducertype = {
    name: null,
    itemdata: null,
    isloading:false
}



const reducer:Reducer<reducertype,reduceractiontype> = (state,action)=>{
    if(action.type === "isloading"){
        return {...state,isloading:true}
    }
    if(action.type === "loaded"){
        return {...state,isloading:false}
    }
    if(action.type === "close"){
        return {name:null,itemdata:null,isloading:false}
    }
    return {name:action.type,itemdata:action.itemdata || null,isloading:false}
}

const ModalContextProvider:FC = ({children})=>{
    const [state,dispatch] = useReducer(reducer,reducervalue)
    const onClose = ()=>{
        dispatch({type:"close"})
    }

    return(
    <ModalContext.Provider value={{dispatch}} >
    <LoginModal onClose={onClose} state={state} dispatch={dispatch} />
    <RegisterModal  onClose={onClose} state={state} dispatch={dispatch}  />
    <EditProfileModal onClose={onClose} state={state} dispatch={dispatch} />
    <EditItemModal onClose={onClose} state={state} dispatch={dispatch}  />
    <AddCouponModal onClose={onClose} state={state} dispatch={dispatch} />
    <CreateItemModal onClose={onClose} state={state} dispatch={dispatch} />
    <BuyLogModal onClose={onClose} state={state} dispatch={dispatch} />
    {children}
    </ModalContext.Provider> )
}

export default ModalContextProvider