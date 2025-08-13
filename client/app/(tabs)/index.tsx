import Item from "@/app/components/items";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { context } from "../_layout";

const test = [{'id': '12', 'name': 'pesara pappu | moong dal', 'url': 'pesara_pappu.jpg', 'itemform': 'raw', 'quantity': 1, 'weight': 100}, {'id': '18', 'name': 'senaga pappu | channa dal', 'url': 'senaga_pappu.jpg', 'itemform': 'raw', 'quantity': 1, 'weight': 100}, {'id': '11', 'name': 'vedaka popular toor dal | kandipappu', 'url': 'kandipappu.jpg', 'itemform': 'raw', 'quantity': 1, 'weight': 100}, {'id': '13', 'name': 'no preservatives whole moong | pesalu', 'url': 'pesalu.jpg', 'itemform': 'raw', 'quantity': 1, 'weight': 100}, {'id': '8', 'name': 'bague premium whole methi seeds dana fenugreek seed | menthulu', 'url': 'menthulu.jpg', 'itemform': 'raw', 'quantity': 1, 'weight': 100}]


// Assuming itemTypes is defined in your context and looks like this:


export default function Index() {
  const {main_items,setMain,search_items,setSearch,setCart,cart_items,address} = useContext(context);
  const [current_search,setCurrentSearch] = useState("");

  const _search = async (text:string) => {
      setCurrentSearch(text)
    try {
          const response = await fetch(`${address}/search`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              search: text
            })
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          // console.log('Success:', data);
          const payload = data.message.payload;
          setSearch(payload)
    } catch (err) {
          console.error('Fetch error:', err);
    }
  };

  useEffect(()=>{
      const fetch_val = async () => {
        try {
          const response = await fetch(`${address}/default`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          // console.log('Success:', data);
          const payload = data.message.payload;
          setMain(payload)
        } catch (err) {
          console.error('Fetch error:', err);
        }
      };
      fetch_val();
    },[setMain,address])
  return<SafeAreaView className="flex-1 bg-black pt-10 pl-4 pr-4">
    <ScrollView contentContainerStyle={{
      paddingBottom:85
    }} >
      <View className="flex justify-center items-center p-10">
        <TextInput 
          placeholder="Search"
          onChangeText={(text)=>_search(text)}
          defaultValue={current_search}
          className={`${'placeholder:text-gray-400'} h-[50px] w-[230px] rounded-md text-white border-2 active:border-orange-400 text-xl border-gray-400 font-semibold px-3`}
          maxLength={40}
        />
      </View>
      {current_search && <Text className="pb-5 text-2xl font-bold text-white">For Search : {current_search}</Text>}
      {search_items.length > 0 && current_search !==""
        ?
        <View className="flex w-full">
          <ScrollView contentContainerStyle={{
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            flexWrap:'wrap',
            flexDirection:'row',
            gap:13
          }}>
             {search_items.map((item)=>(
               <Item key={item.id} item={item}  />
             ))}
           </ScrollView>
         </View>
        :
        <View className="flex w-full">
          {main_items.length > 0 ? <ScrollView contentContainerStyle={{
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            flexWrap:'wrap',
            flexDirection:'row',
            gap:13
          }}>
             {main_items.map((item)=>(
               <Item key={item.id} item={item} />
             ))}
          </ScrollView> : <Text className="text-center font-bold text-yellow-300">Please wait...</Text>}
      </View>}
    </ScrollView>
  </SafeAreaView>
}
