from flask import Flask
from flask_cors import CORS
from routes import markov
import os

app = Flask(__name__)
CORS(app)  # Enable CORS
app.register_blueprint(markov.bp)

if __name__ == '__main__':
    # Use the port assigned by Heroku, or default to 5000 for local testing
    port = int(os.environ.get('PORT', 5000))
    # Run with the correct host and port for production
    app.run(host='0.0.0.0', port=port)