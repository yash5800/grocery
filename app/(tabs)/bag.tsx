import { shoped, tback } from '@/libs/icon'
import React, { useContext } from 'react'
import { Image, ImageBackground, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { context } from '../_layout'
import { cartItemTypes } from './cart'


export interface historyItems{
  transactionTime:Date,
  data:cartItemTypes[]
}

const Bag = () => {
  const {history_items} = useContext(context);
  return (
    <SafeAreaView className='flex-1 pr-4 pl-4 bg-black'>
       <ScrollView
          contentContainerStyle={{
            padding:5,
            gap:7,
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            paddingBottom:85,
            paddingTop:16
          }}
        scrollEnabled={true}
       >
           {
            history_items.length > 0 ?
            history_items.map((ts:historyItems,index)=>(
               <View key={`T-${index}`} className='w-full rounded-lg min-h-[50px] overflow-hidden'>
                 <ImageBackground source={tback} className='p-8' imageStyle={{ borderRadius: 8 }}>
                 <View className='flex flex-row justify-center items-center gap-10'>
                    <Image source={shoped} className='size-12'/>
                    <View className='flex justify-center items-start flex-col gap-5'>
                       <View className='flex flex-col'>
                         <Text className='text-lg text-gray-700 font-semibold'>Transaction Day</Text>
                         <Text className='text-md text-blue-500 font-semibold'>{`${new Date(ts.transactionTime).toLocaleDateString()}`}</Text>
                       </View>
                       <View className='flex flex-col '>
                        <Text className='text-2xl text-gray-700 font-semibold'>Items</Text>
                        {
                          ts.data.map((item:cartItemTypes,index)=>(
                                      <View key={item.id} className='flex-row items-start'>
                                        <Text className='text-blue-500 text-lg font-semibold'>{index + 1}.</Text>
                                        <Text className='ml-2 text-gray-800 text-lg font-semibold w-[230px]'>{item.name}</Text>
                                      </View>
                          ))
                        }
                       </View>
                      </View>
                  </View>
                </ImageBackground>
               </View>
            ))
            :
            <Text className='font-medium top-8 text-yellow-300 text-center' >No Transactions Details</Text>
           }
       </ScrollView>
    </SafeAreaView>
  )
}

export default Bag