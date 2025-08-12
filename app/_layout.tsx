import { _retriveCart, _retriveHistory } from "@/libs/store";
import { Stack } from "expo-router";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import '../globals.css';

interface itemTypes{
    id: string;
    name: string;
    url: string;
    itemform: string;
    quantity: number;
    weight: number;
}

interface cartItemTypes {
  id: string;
  name: string;
  url: string;
  itemform: string;
  quantity: number;
  weight: number;
  isCheck:boolean
}

interface historyItems{
  transactionTime:Date,
  data:cartItemTypes[]
}

export const context =createContext<{
  main_items:itemTypes[],
  setMain:Dispatch<SetStateAction<itemTypes[]>>,
  setCart:Dispatch<SetStateAction<cartItemTypes[]>>,
  cart_items:cartItemTypes[],
  setSearch:Dispatch<SetStateAction<itemTypes[]>>,
  search_items:itemTypes[],
  setHistory:Dispatch<SetStateAction<historyItems[]>>,
  history_items:historyItems[],
  setActive:Dispatch<SetStateAction<cartItemTypes | itemTypes | null>>,
  active_item:itemTypes | null,
  address:string
}>({
  main_items:[],
  setMain:()=>{},
  cart_items:[],
  setCart:()=>{},
  search_items:[],
  setSearch:()=>{},
  setHistory:()=>{},
  history_items:[],
  active_item:null,
  setActive:()=>{},
  address:''
})

const address = 'http://192.168.1.12:5000'

export default function RootLayout() {
  const [main_items,setMain] = useState<itemTypes[]>([]);
  const [cart_items,setCart] = useState<cartItemTypes[]>([]);
  const [search_items,setSearch] = useState<itemTypes[]>([]);
  const [history_items,setHistory] = useState<historyItems[]>([]);
  const [active_item,setActive] = useState<itemTypes| cartItemTypes | null>(null);


  useEffect(()=>{
    const get = async()=>{
       const cart_data = await _retriveCart();
       setCart(await cart_data);
       const history_data = await _retriveHistory();
       setHistory(await history_data);

    }

    get()
  },[])
  
  return <context.Provider value={{main_items,setMain,search_items,setSearch,cart_items,setCart,history_items,setHistory,setActive,active_item,address}}> 
    <Stack>
      <Stack.Screen name="(tabs)" options={{headerShown:false}} />
      <Stack.Screen name="components/detail" options={{headerShown:false}} />
      <Stack.Screen name="components/cartDetails" options={{headerShown:false}} />
    </Stack>
  </context.Provider>
}
