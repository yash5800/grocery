import { check, edit, uncheck } from '@/libs/icon';
import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
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

interface cartItemType{
   item:cartItemTypes,
   itemToggle:(item:cartItemTypes)=>void,
   handleRemove:(item: cartItemTypes) => void
}

const CartItems = ({item,itemToggle,handleRemove}:cartItemType) => {
    const {setActive,address} = useContext(context);
    const router = useRouter();
  return (
                  <TouchableOpacity className="flex justify-center flex-row items-center w-full h-[160px] bg-white p-2 gap-2 rounded-xl" 
                  activeOpacity={0.9}
                  onPress={()=>{
                        itemToggle(item)
                  }}
                  onLongPress={()=>{
                      handleRemove(item)
                  }}
                  >
                     <Image source={{uri:`${address}/items_images/${item.url}`}} className="w-[130px] h-[130px] rounded-xl"  />
                     <View className='flex-1 justify-start items-start'>
                       <Text className="max-w-[170px] text-xl font-semibold overflow-ellipsis "  numberOfLines={1}>{item.name}</Text>
                       <Text className='text-gray-500 text-sm font-medium tracking-wider'>quantity:{item.quantity}</Text>  
                       <Text className='text-green-400 text-base font-bold tracking-wider'>
                        {item?.itemform === "oil" ? item?.weight >= 910 ? (item?.weight/910).toFixed(1) : item.weight : item.weight >= 1000 ? item.weight/1000 : item.weight}
                        {item?.itemform === "oil" ? item?.weight >= 910 ? 'l' : 'ml' : item.weight >= 1000? 'kg':'g'}
                        </Text>                    
                     </View>
                     <View>
                         {item.isCheck ? <Image source={check} className='size-12' tintColor={'green'} /> : <Image source={uncheck} className='size-12' />}
                     </View>
                     <TouchableOpacity className='absolute right-3 top-0 p-3'
                      onPress={()=>{
                         setActive(item);
                         router.push('/components/cartDetails')
                      }}
                     >
                        <Image className='size-10' source={edit} />
                     </TouchableOpacity>
                 </TouchableOpacity>
  )
}

export default CartItems