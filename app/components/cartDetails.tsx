import { add, back, minus } from '@/libs/icon';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { context } from '../_layout';

interface cartItemTypes {
  id: string;
  name: string;
  url: string;
  itemform: string;
  quantity: number;
  weight: number;
  isCheck:boolean
}

const CartDetail = () => {
  const {active_item,setActive,address,cart_items,setCart} = useContext(context);
  const [isUpdate,setUpdate] = useState(false);
  const router = useRouter();


  let weight = active_item?.weight;
  let quantity = active_item?.quantity;
    
const adding = () => {
  if (active_item && weight) {
    const updatedItem = {
      ...active_item,       // copy all other properties
      weight: weight + 50   // update the weight
    };
    setActive(updatedItem);
  }
};

const subracting = () => {
  if (active_item && weight && weight > 50) {
    const updatedItem = {
      ...active_item,
      weight: weight - 50
    };
    setActive(updatedItem);
  }
};
const q_adding = () => {
  if (active_item && quantity) {
    const updatedItem = {
      ...active_item,       // copy all other properties
      quantity: quantity + 1   // update the weight
    };
    setActive(updatedItem);
  }
};

const q_subracting = () => {
  if (active_item && quantity && quantity > 1) {
    const updatedItem = {
      ...active_item,
      quantity: quantity - 1
    };
    setActive(updatedItem);
  }
};

  const updateToCart= (item: cartItemTypes)=>{
      setUpdate(true)
      const updatedItem = {
        ...item
      }
      const updateCart = cart_items.map((item)=>(
        item.id === updatedItem.id ? updatedItem : item
      ))
      setCart(updateCart);
  }

  return (
    <View className='flex-1 justify-start items-center bg-black pt-10 pl-2 pr-2'>
        <TouchableOpacity className='absolute top-14 left-3 z-10 bg-gray-700 rounded-full p-3'
         onPress={()=>router.push('/(tabs)/cart')}
        >
           <Image className='size-10' tintColor={'white'} source={back} />
        </TouchableOpacity>
        <View className='w-full flex justify-center items-center gap-2'>
           <Image className='w-full h-[300px] rounded-xl' source={{uri:`${address}/items_images/${active_item?.url}`}}  />
           <Text 
             className='text-2xl font-semibold text-gray-100 overflow-ellipsis' 
             numberOfLines={3}
           >Name : {active_item?.name}</Text>
           <View className='flex justify-center items-center w-full'>
             <View className='flex justify-center items-center flex-row gap-3 mt-5'>
                <TouchableOpacity className='bg-gray-600 w-[45px] h-[45px] flex justify-center items-center rounded-lg' 
                  onPress={()=>subracting()}
                >
                  <Image source={minus} className='size-5' tintColor={'yellow'} />
                </TouchableOpacity>
                <Text className='text-green-400 text-2xl font-bold tracking-wider'>
                  {active_item?.itemform === "oil" ? active_item?.weight >= 910 ? (active_item?.weight/910).toFixed(1) : weight : weight && weight >= 1000 ? weight/1000 : weight}
                  {active_item?.itemform === "oil" ? active_item?.weight >= 910 ? 'l' : 'ml' : weight && weight >= 1000? 'kg':'g'}
                </Text> 
                <TouchableOpacity className='bg-gray-600 w-[45px] h-[45px] flex justify-center items-center rounded-lg'
                 onPress={()=>adding()}
                >
                  <Image source={add} className='size-5' tintColor={'yellow'} />
                </TouchableOpacity>
              </View>
           </View>
              <Text className='text-white text-2xl font-bold w-full mt-2' >Weight - 
                <Text className='text-green-400 text-2xl font-bold tracking-wider'>
                  {active_item?.itemform === "oil" ? active_item?.weight >= 910 ? (active_item?.weight/910).toFixed(1) : weight : weight && weight >= 1000 ? weight/1000 : weight}
                  {active_item?.itemform === "oil" ? active_item?.weight >= 910 ? 'l' : 'ml' : weight && weight >= 1000? 'kg':'g'}</Text>
              </Text>
           <View className='flex justify-center items-center w-full'>
             <View className='flex justify-center items-center flex-row gap-3 mt-5'>
                <TouchableOpacity className='bg-gray-600 w-[45px] h-[45px] flex justify-center items-center rounded-lg' 
                  onPress={()=>q_subracting()}
                >
                  <Image source={minus} className='size-5' tintColor={'yellow'} />
                </TouchableOpacity>
                <Text className='text-green-400 text-2xl font-bold tracking-wider'>{quantity}</Text>  
                <TouchableOpacity className='bg-gray-600 w-[45px] h-[45px] flex justify-center items-center rounded-lg'
                 onPress={()=>q_adding()}
                >
                  <Image source={add} className='size-5' tintColor={'yellow'} />
                </TouchableOpacity>
              </View>
           </View>
              <Text className='text-white text-2xl font-bold w-full mt-2' >Quantity - 
                <Text className='text-green-400 text-2xl font-bold tracking-wider'>{quantity}</Text>
              </Text>
           <View className='w-[200px] justify-center items-center mt-10'>
              { !isUpdate?
                <TouchableOpacity className='w-full py-[20px] rounded-lg bg-green-500 flex justify-center items-center'
               onPress={()=>{
                 if(active_item){
                    updateToCart(active_item)
                 }
               }}
              >
                <Text className='text-white text-2xl font-bold'>Update</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity className='w-full py-[20px] rounded-lg bg-green-700 flex justify-center items-center'>
                <Text className='text-white text-2xl font-bold'>Updated</Text>
              </TouchableOpacity>
            }
           </View>
        </View>
    </View>
  )
}

export default CartDetail

