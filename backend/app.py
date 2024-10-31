from flask import Flask
from routes import markov

app = Flask(__name__)
app.register_blueprint(markov.bp)

if __name__ == '__main__':
    app.run(debug=True)
