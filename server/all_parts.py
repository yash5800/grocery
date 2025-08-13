from langchain.agents import AgentType,initialize_agent,AgentExecutor
from langchain.tools import Tool
from langchain.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.memory import ConversationBufferMemory
from dotenv import load_dotenv
from langchain.embeddings import HuggingFaceEmbeddings
import wikipedia
import json
import re

load_dotenv()

class Tools_Part():
  
  def __init__(self):
    self.llm = ChatGoogleGenerativeAI(model='gemini-2.0-flash',temperature=0)
    self.search_tool = Tool(
        name='SearchProducts',
        func=self.sim_wrapper,
         description=(
             "Use this tool to search for products. It takes two arguments: "
             "1) product name (string), and "
             "2) k (number of results to return). "
             "If user asks for product details or examples (like 'what Pappu items do you have?'), set k value based on preference. "
             "If user asks to add products to cart, return JSON response of those products. "
             "Default k is 1."
             "If query what to see image include url in responce example: url:'dummy.jpg'"
         )
        )
    
    self.wiki_tool = Tool(
           name='WikiSummary',
           func=self.wiki_summary,
           description="Use this to get short summary on any product from wikipedia. Input should be the item name."
         )
    
    self.chat_tool = Tool(
        name="GeminiChat",
        func=self.chat_bot,
        description="Use this tool for general coversation ,answering question,checking products types like oil, liquid,solid or not ,etc.."
      )
    
    self.weight_convert = Tool(
        name="WeightCovert",
        func=self.parse_weight,
        description="Use this tool for to get Weights in grams from liter to grams, kg to grams, eg: input must be like : 1kg or (value)liter or (value)g"
      )
    
    self.hf_embedding = HuggingFaceEmbeddings(model_name='all-MiniLM-L6-v2')
    
    self.product_vector = FAISS.load_local(
    folder_path="Product_Vector",
    embeddings=self.hf_embedding,
    allow_dangerous_deserialization=True
)
    
  
  def json_converter(self,ls):
    
    temp = []
    
    for line in ls:
        item = {}
        for parts in line.lower().split("  "):
            key,val = parts.split(":")
            item[key.strip()] = val.strip()
        temp.append(item)
        for i in temp:
          i['quantity']=1
          i['weight'] = 100
    return temp


  def sim_wrapper(self,input_str):
      print(input_str) 
      try:
          if 'k=' in input_str:
              res1,res2 = input_str.split(',')
              return self.sim(res1.strip(),(int(res2.strip().replace('k=',''))))
          elif not ',' in input_str :
            return self.sim(input_str)
          else:
            raise ZeroDivisionError
      except:
          return 'input must be like `itemname,k=3` .'
      
  
  def sim(self,product,k=1):
      print(product,k)
      docs2 = self.product_vector.similarity_search(product, k=k)
      combined_context = "\n".join([d.page_content for d in docs2])
      
      return self.json_converter(combined_context.split('\n'))
    
  def wiki_summary(self,topic:str) -> str:
     try:
       return wikipedia.summary(topic,sentences=2)
     except Exception as e:
       return e
  
  def chat_bot(self,query):
     response = self.llm.invoke(query)
     return str(response)
   
  def pure(self,res):
    pattern = r'```json\s*(.*?)\s*```'
    match = re.search(pattern, res, re.DOTALL)
    
    if match:
        json_text = match.group(1).strip()
        parsed_json = json.loads(json_text)
        return parsed_json
    elif "[{'id':" in res:
        return json.loads(res.replace('\'',"\""))
    else:
      return "No Object Found"
    
  def parse_weight(self,weight_text):
    """
    Parse weight text like '1kg' or '1liter' and return numeric weight:
    - 1kg ➜ 1000
    - 1liter ➜ 910
    - 500g ➜ 500
    - Plain numbers remain as is.
    """
    weight_text = weight_text.lower().strip()
    if weight_text.endswith('kg'):
        num = float(weight_text.replace('kg', '').strip())
        return int(num * 1000)  # 1kg=1000g
    elif weight_text.endswith('g'):
        num = float(weight_text.replace('g', '').strip())
        return int(num)
    elif weight_text.endswith('liter'):
        num = float(weight_text.replace('liter', '').strip())
        return int(num * 910)  # 1 liter = 910g (as per your case)
    else:
        try:
            return int(weight_text)
        except:
            return 100  # fallback
          
      
class Agent_Part(Tools_Part):
  
  def __init__(self):
   super().__init__()
    
   self.memory = ConversationBufferMemory(memory_key='chat_history',return_messages=True)
   
   self.agent = initialize_agent(
    tools=[self.search_tool, self.wiki_tool,self.chat_tool,self.weight_convert],
    llm=self.llm,
    memory=self.memory,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    system_message=(
        "Rules You Must Follow for each Item this must only contain : id is item id ,name is item name,url is image url,itemform type of item form,quantity is number of items packs where 1 pack is equal to it's weight,weight is weight of the item example ```json {'id': 'itemid', 'name': 'itemname', 'url': 'url', 'itemform': 'raw', 'quantity': 1, 'weight': 100} ```"
        "Item weight must be only in grams"
        "You must always use the SearchProducts tool with input example: `pappu,k=2`."
        "Do not use Python dictionaries or any other format. Only JSON strings."
        "You must always use the SearchProducts tool when the user asks about product availability or product details."
        "If the user asks to add products to the cart, return the output in JSON format. example ```json {'id': 'itemid', 'name': 'itemname', 'url': 'url', 'itemform': 'raw', 'quantity': 1, 'weight': 100} ```"
        "If the user only asks for information, give a text response summarizing the search results."
        "You must only follow items in this formate example ```json {'id': 'itemid', 'name': 'itemname', 'url': 'url', 'itemform': 'raw', 'quantity': 1, 'weight': 100} ```"
        "weight must be in grams only"
    )
)


   self.agent_executer = AgentExecutor.from_agent_and_tools(
     memory=self.memory,
     agent=self.agent.agent,
     tools=[self.search_tool,self.wiki_tool,self.chat_tool,self.weight_convert],
     verbose=True 
   )
