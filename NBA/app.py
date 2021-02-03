# import necessary libraries

import os
from flask_sqlalchemy import SQLAlchemy

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

from sqlalchemy import create_engine

# Flask Setup
#################################################
app = Flask(__name__)

# Database Setup
#################################################

# app.config['SQLALCHEMY_DATABASE_URL'] = os.environ.get('DATABASE_URL', '')

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:postgres@localhost:5432/nba2018db"
db = SQLAlchemy(app)

# automap base

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

# Service Routes
@app.route("/api/main")
def firstRoute(): 
    data = db.session.query(combine.player_id, combine.player_name).limit(10).all()
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
