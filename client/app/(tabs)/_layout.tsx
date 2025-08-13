import { bag1, bag2, cart1, cart2, chat1, chat2, home1, home2 } from '@/libs/icon'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, Text, View } from 'react-native'

interface TabBar_type{
  focused:boolean,
  title:string,
  icon1:any,
  icon2:any
}

const TabBar = ({focused,title,icon1,icon2}:TabBar_type)=>{

    return <View className='flex h-full justify-center items-center mt-5'>
         <View className='flex-1 flex-col justify-center items-center min-w-[50px]'>
            { focused ? 
            <Image 
               source={icon2} 
               tintColor={'yellow'} 
               className='size-7' 
               resizeMode='contain'
            />:
            <Image 
               source={icon1} 
               tintColor={'gray'} 
               className='size-7' 
               resizeMode='contain'
            />}
            <Text className={`${!focused?'text-gray-400':'text-yellow-500'} font-medium text-sm`} >{title}</Text>
         </View>
    </View>
}

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
         headerShown:false,
         tabBarShowLabel:false,
         tabBarStyle:{
          height:75,
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
          backgroundColor:'black',
          position:'absolute'
         }
      }}
     >
       <Tabs.Screen
         name='index'
         options={{
           title:'Home',
           tabBarIcon:({focused})=>{
             return <TabBar focused={focused} title='Home' icon1={home1} icon2={home2} />
           }
         }}
        />
       <Tabs.Screen
         name='cart'
         options={{
           title:'Cart',
           tabBarIcon:({focused})=>{
             return <TabBar focused={focused} title='Cart' icon1={cart1} icon2={cart2} />
           }
         }}
        />
       <Tabs.Screen
         name='bag'
         options={{
           title:'Bag',
           tabBarIcon:({focused})=>{
             return <TabBar focused={focused} title='Bag' icon1={bag1} icon2={bag2} />
           }
         }}
        />
       <Tabs.Screen
         name='chat'
         options={{
           title:'Chat',
           tabBarIcon:({focused})=>{
             return <TabBar focused={focused} title='Chat' icon1={chat1} icon2={chat2} />
           }
         }}
        />
    </Tabs>
  )
}

export default Layout