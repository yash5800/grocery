import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { context } from '../_layout';

interface itemTypes {
  id: string;
  name: string;
  url: string;
  itemform: string;
  quantity: number;
  weight: number;
}

interface iteType{
  item:itemTypes
}


const Item = ({item}:iteType) => {
    const {setActive,address} = useContext(context);
    const router = useRouter();
  
  return (
                  <TouchableOpacity className="flex justify-center items-center w-[150px] h-[210px] bg-white p-3 gap-2 rounded-xl" 
                  activeOpacity={0.9}
                  onPress={()=>{
                         setActive(item);
                         router.push('/components/detail')
                  }}>
                     <Image source={{uri:`${address}/items_images/${item.url}`}} className="w-[130px] h-[130px] rounded-xl"  />
                     <View className='flex justify-start items-start'>
                       <Text className="max-w-[140px] text-xl font-semibold overflow-ellipsis "  numberOfLines={1}>{item.name}</Text>
                       <Text className='text-gray-500 text-sm font-medium tracking-wider'>quantity:{item.quantity}</Text>  
                       <Text className='text-green-400 text-base font-bold tracking-wider'>{item.weight}{item?.itemform==='oil'?'ml':'g'}</Text>                    
                     </View>
                 </TouchableOpacity>
  )
}

export default Item