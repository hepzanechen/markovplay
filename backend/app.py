from flask import Flask
from flask_cors import CORS
from routes import markov

app = Flask(__name__)
CORS(app)  # Enable CORS
app.register_blueprint(markov.bp)

if __name__ == '__main__':
    app.run(debug=True)
