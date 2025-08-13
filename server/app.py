from flask import Flask, request, jsonify,send_from_directory
from flask_cors import CORS
from all_parts import Agent_Part
from langchain.memory import ConversationBufferMemory



agent_obj = Agent_Part()

app = Flask(__name__)

CORS(app)

@app.route('/',methods=['GET'])
def main():
  return jsonify({'message':'recived'})

@app.route('/items_images/<path:filename>')
def serve_images(filename):
    return send_from_directory('items_images', filename)

@app.route('/default',methods=['GET'])
def default():
    try:
        res = agent_obj.sim('',10)
        return jsonify({
        'message':{
          'state':'success',
          'type':'default',
          'payload':res
        }})
    except:
      return jsonify({
      'message':{
        'state':'fail',
        'type':'default',
        'payload':'visit server to see error!'
    }}),404
      
@app.route('/search',methods=['POST'])
def search():
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'message': {
                    'state': 'fail',
                    'payload': 'Missing JSON body'
                }
            } ), 400
      
        search = data.get('search')
        print(search)
        res = agent_obj.sim(search,k=5)
        return jsonify({
        'message':{
          'state':'success',
          'type':'search',
          'payload':res
        }})
    except:
      return jsonify({
      'message':{
        'state':'fail',
        'type':'search',
        'payload':'visit server to see error!'
    }}),404
        

@app.route('/chat', methods=['POST'])
def handle_data():
  try:
    data = request.get_json()
    if not data:
        return jsonify({
            'message': {
                'state': 'fail',
                'payload': 'Missing JSON body'
            }
        }), 400
  
    query = data.get('query')
    print(query)
    res = agent_obj.agent_executer.run(query)
    
    if 'json' in res or "[{'id':" in res:
      send_res = agent_obj.pure(res)
      
      print(type(send_res))
      
      return jsonify({
      'message':{
        'state':'success',
        'type':'add',
        'payload':send_res
    }})
    return jsonify({
      'message':{
        'state':'success',
        'type':'chat',
        'payload':res
    }})
  except:
    return jsonify({
      'message':{
        'state':'fail',
        'type':'unknown',
        'payload':'visit server to see error!'
    }}),404

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000)
