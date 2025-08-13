// const res = `I have found 5 "pappu" items. I should now present these to the user.
// Final Answer: We have the following pappu items: pesara pappu | moong dal (url: pesara_pappu.jpg), senaga pappu | channa dal (url: senaga_pappu.jpg), vedaka popular toor dal | kandipappu (url: kandipappu.jpg), no preservatives whole moong | pesalu (url: pesalu.jpg), and bague premium whole methi seeds dana fenugreek seed | menthulu (url: menthulu.jpg)`

// const url = (res.split('url:')[1]).replace('"','')
// console.log(url)

// if(res.match(/url:\s*/g)) console.log(true)


// const regex = /url:\s*['"]?([^'")]+)['"]?/g;
// let match;
// const urls = [];

// while ((match = regex.exec(res)) !== null) {
//   urls.push(match[1]);
// }

// console.log(urls); 


// const res = "We have the following pappu items: pesara pappu | moong dal (url: pesara_pappu.jpg), senaga pappu | channa dal (url: senaga_pappu.jpg), vedaka popular toor dal | kandipappu (url: kandipappu.jpg), no preservatives whole moong | pesalu (url: pesalu.jpg), and bague premium whole methi seeds dana fenugreek seed | menthulu (url: menthulu.jpg).";

// // Remove entire "(url: ...)" parts
// const cleanedRes = res.replace(/\(url:\s*[^)]+\)/g, '').replace(/\s{2,}/g, ' ');

// console.log(cleanedRes.trim());


const arr = [1,2,3,3,4,5]
const index = arr.indexOf(10)

console.log(index)

// for(let i = 0; i<arr.length-1 ;i++){
//   if(index <= i ){
//      arr[i] = arr[i+1]
//   }
// }

// arr.pop()

// console.log(arr)

// const remove = (arr,index,i)=>{
//      if(arr.length - 1 === i){
//        arr.pop()
//        return arr
//      }
//      else if(index <= i){
//       console.log(arr[i])
//        arr[i] = arr[i+1]
//      }
//      return remove(arr,index,++i)
// }

// console.log(remove(arr,arr.indexOf(3),0))
