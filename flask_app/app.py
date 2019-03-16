from flask import Flask, jsonify
from helper import get_similar, get_sentences

app = Flask(__name__)

@app.route('/<word>')
def index(word):
	return jsonify(get_sentences(word))

if __name__ == '__main__':
	app.run(debug=True)