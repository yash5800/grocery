import { historyItems } from '@/app/(tabs)/bag';
import { Storage } from 'expo-storage';

interface cartItemTypes {
  id: string;
  name: string;
  url: string;
  itemform: string;
  quantity: number;
  weight: number;
  isCheck:boolean
}

export const _storeCart = async(cart:cartItemTypes[])=>{
   try{
    await Storage.setItem({
      key:'cart',
      value:cart
    })
   }
   catch(error){
    console.log(error)
   }
}

export const _retriveCart = async()=>{
  try{
    const cartItems = await Storage.getItem({key:"cart"}) 

    if(cartItems !== null){
       return JSON.parse(cartItems)
    }
    return []
  }
  catch(error){
    console.log(error)
    return []
   }
}
export const _storeHistory = async(cart:historyItems[])=>{
   try{
    await Storage.setItem({
      key:'history',
      value:cart
    })
   }
   catch(error){
    console.log(error)
   }
}

export const _retriveHistory = async()=>{
  try{
    const cartItems = await Storage.getItem({key:"history"}) 

    if(cartItems !== null){
       return JSON.parse(cartItems)
    }
    return []
  }
  catch(error){
    console.log(error)
    return []
   }
}