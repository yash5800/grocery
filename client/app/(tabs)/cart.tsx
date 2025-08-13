import { _storeCart, _storeHistory } from '@/libs/store';
import React, { useContext } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { context } from '../_layout';
import CartItems from '../components/cartItem';

export interface cartItemTypes {
  id: string;
  name: string;
  url: string;
  itemform: string;
  quantity: number;
  weight: number;
  isCheck:boolean
}

const Cart = () => {
  const {cart_items,setCart,history_items,setHistory} = useContext(context);

  function handleComplete(){
      const checkedItems:cartItemTypes[] = []
      const uncheckedItems:cartItemTypes[]=[]
      cart_items.forEach((Item)=>{
           if(Item.isCheck) checkedItems.push(Item)
           else  uncheckedItems.push(Item)
      })
      
      setCart([...uncheckedItems])
      setHistory([
      ...history_items,
      {
        transactionTime: new Date(),
        data:[...checkedItems]
      }])

      _storeCart(cart_items)
      _storeHistory(history_items)
  }

  function handleRemove(item:cartItemTypes){
      const remove = (arr:cartItemTypes[],item:cartItemTypes)=>{
      const index = arr.indexOf(item);
      for(let i = 0; i<arr.length-1 ;i++){
          if(index <= i ){
             arr[i] = arr[i+1]
          }
        }  
      arr.pop()

     setCart([...arr])
     _storeCart(arr)
   }
   remove(cart_items,item)
  }

  const SelectAll = ()=>{

    const sample = [...cart_items];

    sample.forEach((item,index)=>{
      sample[index] = {
        ...item,
        isCheck:true
      }
    })
      
    setCart(sample);
     
  }
  
const itemToggle = (item: cartItemTypes) => {
  // Find the index of the item to update
  const index = cart_items.findIndex(cartItem => cartItem.id === item.id);

  // If the item exists, update it
  if (index !== -1) {
    const updatedCartItems = [...cart_items]; // Create a shallow copy
    updatedCartItems[index] = {
      ...updatedCartItems[index],
      isCheck: !updatedCartItems[index].isCheck // toggle
    };

    setCart(updatedCartItems);
  }
};


  return (
    <SafeAreaView className='flex-1 bg-black pt-10'>
      { cart_items && cart_items.length > 0 ?
        <ScrollView 
          contentContainerStyle={{
            padding:5,
            gap:7,
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            paddingBottom:85
          }}
        >
            <View className='w-full h-[100px] flex flex-row justify-between items-center p-5'>
                <TouchableOpacity className='p-3 bg-green-400 rounded-lg'
                 onPress={()=>handleComplete()}
                >
                    <Text className='text-white font-semibold text-xl'>Complete</Text>
                </TouchableOpacity>
                <TouchableOpacity className='p-3 bg-green-400 rounded-lg'
                  onPress={()=>SelectAll()}
                >
                    <Text className='text-white font-semibold text-xl'>Select All</Text>
                </TouchableOpacity>
            </View>
         {cart_items.map((item:cartItemTypes,index:number)=>(
            <CartItems key={item.id} item={item} itemToggle={itemToggle} handleRemove={handleRemove}/>
         ))} 
        </ScrollView>
    :
    <Text className="text-center font-bold text-yellow-300 mt-10">Looks Like No items...</Text>  
    }
    </SafeAreaView>
  )
}

export default Cart