import { _storeCart } from '@/libs/store';
import { BlurView } from 'expo-blur';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { context } from '../_layout';
import { cartItemTypes } from './cart';

interface chatQuery{
  payload:string,
  state:string,
  type:string,
  images?:string[]
}
const Chat = () => {
  const {address,cart_items,setCart} = useContext(context);
  const [query,setQuery] = useState('');
  const [chat,setChat] = useState<chatQuery[]>([])
  const [load,setload] = useState(false)

  const scrollViewRef = useRef<ScrollView>(null);

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

// {"payload": "Hi there! How can I help you today?", "state": "success", "type": "chat"}
useEffect(() => {
  scrollViewRef.current?.scrollToEnd({ animated: true });
    if (load) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      opacity.setValue(0);
      scale.setValue(0.8);
    }
  }, [load,opacity,scale]);



  const onSubmit = async ()=>{
      setload(true)

      setChat((pre)=>[...pre,{
        payload:query,
        state:'success',
        type:'user'
      }]);

      setQuery('');

      const res = await fetch(`${address}/chat`,{
        method:'POST',
        headers: {
              'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              query:query
        })
      });
      if (!res.ok) {
            throw new Error('Network response was not ok');
      }
      const data = await res.json();
          console.log('Success:', data.message);
          console.log(data.message.type === "add")
      if( data.message.type === "chat" && (data.message.payload).match(/url:\s*/g)){
           const regex = /url:\s*['"]?([^'")]+)['"]?/g;
           let match;
           const urls:string[] = [];
           const msg = data.message.payload

           
           // Clean up any leftover parentheses or spaces (optional)
           const cleanedRes = msg.replace(/\(url:\s*[^)]+\)/g, '').replace(/\s{2,}/g, ' ');

           while ((match = regex.exec(msg)) !== null) {
             urls.push(match[1]);
           }

           const updatedData = {
            ...data.message.payload,
            payload:cleanedRes,
            images:urls
           }

           setChat((pre)=>[...pre,updatedData])

           setload(false)
           return 
      }
      else if(data.message.type === "add"){
        console.log('entered add')
          const items:cartItemTypes[] = data.message.payload;
          const updatedItems:cartItemTypes[] = [...cart_items];
          console.log(items)

          items.forEach((item)=>{
              let count = 0
              for(let i =0;i< cart_items.length -1 ;i++){
                if(cart_items[i].id === item.id){
                  count++
                }
              }
              console.log(count)
              if(count === 0){
                updatedItems.push({
                  ...item,
                  isCheck:false
                })
              }
              
          })

          console.log(updatedItems)

          setCart([...updatedItems])
          _storeCart(updatedItems)

          const ai = {
            ...data.message,
            payload:"added items"
          }

          setChat((pre)=>[...pre,ai])
          setload(false)
          return 

      }

      setChat((pre)=>[...pre,data.message])
      setload(false)
  }

  return (
    <SafeAreaView className='flex-1 bg-black pt-[0px] pl-4 pr-4 gap-5'>

<BlurView intensity={98} tint="dark" style={{ position: 'absolute', height: 130, width: '100%', zIndex: 10,marginLeft:14 }}>
  <View className='absolute w-full bottom-0 '>
    <TextInput
      value={query}
      onChangeText={(text) => setQuery(text)}
      placeholder='Ask!'
      className='px-14 py-5 border-gray-300 rounded-md bg-white'
    />
    <TouchableOpacity
      className='absolute right-0.5 top-2'
      onPress={() => onSubmit()}
    >
      <Text className='bg-gray-700 text-white rounded-lg p-3 font-semibold'>
        send
      </Text>
    </TouchableOpacity>
  </View>
</BlurView>

       <ScrollView
         ref={scrollViewRef}
        contentContainerStyle={{
          paddingTop:145,
          paddingBottom:165,
          display:'flex',
          flexDirection:'column',
          justifyContent:'center',
          gap:10,
          zIndex:-1
        }}
        showsVerticalScrollIndicator={false}
       >
        {
          chat.map((it,index)=>(
           it.type === "user" ? 
               <View key={index} className='self-end max-w-[250px] bg-yellow-300 rounded-tl-lg rounded-bl-2xl rounded-tr-2xl p-4'>
                 <Text className='text-base font-medium'>{it.payload}</Text>
               </View>
            :
             it.images && it.images.length > 0 ?
                <View  key={index}  className='flex w-full'>
                  <View className='self-start max-w-[250px] bg-yellow-300 rounded-tl-2xl rounded-br-2xl rounded-tr-lg p-4'>
                   <Text className='text-base font-medium'>{it.payload}</Text>
                  </View>
                  <ScrollView
                  horizontal={true}
                   contentContainerStyle={{
                     padding:2,
                     gap:2,
                     display:'flex',
                     flexDirection:'row',
                     justifyContent:'flex-start'
                   }}
                   scrollToOverflowEnabled={true}
                  >
                      {it.images.map((im:string,index)=>(
                        <Image key={`S-${index}`} source={{uri:`${address}/items_images/${im}`}} className='w-[130px] h-[130px] rounded-xl'  />
                      ))}
                  </ScrollView>
                </View>
            :
            <View key={index} className='self-start max-w-[250px] bg-yellow-300 rounded-tl-2xl rounded-br-2xl rounded-tr-lg p-4'>
             <Text className='text-base font-medium'>{it.payload}</Text>
            </View>
          
          ))
        }
       {     load && (
      <Animated.View
        style={{
          opacity,
          transform: [{ scale }],
        }}
        className='self-start max-w-[250px] bg-yellow-300 rounded-tl-2xl rounded-br-2xl rounded-tr-lg p-4'
      >
        <Text className='text-base font-medium'>{"Thinking..."}</Text>
      </Animated.View>
    )}
       </ScrollView>
    </SafeAreaView>
  )
}

export default Chat