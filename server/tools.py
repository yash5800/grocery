import json
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings


hf_embedding = HuggingFaceEmbeddings(model_name='all-MiniLM-L6-v2')



product_vector = FAISS.load_local(
    folder_path="Product_Vector",
    embeddings=hf_embedding,
    allow_dangerous_deserialization=True
)


def json_converter(ls):
    
    temp = []
    
    for line in ls:
        item = {}
        for parts in line.split("  "):
            key,val = parts.split(":")
            item[key.strip()] = val.strip()
        temp.append(item)
    return json.dumps(temp,indent=2)


def sim_wrapper(input_str):
    print(input_str) 
    try:
        if 'k=' in input_str:
            res1,res2 = input_str.split(',')
            return sim(res1.strip(),(int(res2.strip().replace('k=',''))))
        elif not ',' in input_str :
          return sim(input_str)
        else:
          raise ZeroDivisionError
    except:
        return 'input must be like `itemname,k=3` .'
    

def sim(product,k=1):
    print(product,k)
    docs2 = product_vector.similarity_search(product, k=k)
    combined_context = "\n".join([d.page_content for d in docs2])
    
    return json_converter(combined_context.split('\n'))
  
search_tool = Tool(
   name='SearchProducts',
   func=sim_wrapper,
    description=(
        "Use this tool to search for products. It takes two arguments: "
        "1) product name (string), and "
        "2) k (number of results to return). "
        "If user asks for product details or examples (like 'what Pappu items do you have?'), set k value based on preference. "
        "If user asks to add products to cart, return JSON response of those products. "
        "Default k is 1."
    )
)
    
import wikipedia
def wiki_summary(topic:str) -> str:
  try:
    return wikipedia.summary(topic,sentences=2)
  except Exception as e:
    return e
    
wiki_tool = Tool(
  name='WikiSummary',
  func=wiki_summary,
  description="Use this to get short summary on any product from wikipedia. Input should be the item name."
)

def chat_bot(query):
  response = llm.invoke(query)
  return str(response)

chat_tool = Tool(
  name="GeminiChat",
  func=chat_bot,
  description="Use this tool for general coversation ,answering question,checking products types like oil, liquid, solid or not ,etc.."
)