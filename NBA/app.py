# import necessary libraries

import os
from flask.globals import session
from flask_sqlalchemy import SQLAlchemy

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

from sqlalchemy import create_engine, engine
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

# Flask Setup
#################################################
app = Flask(__name__)

# Database Setup
#################################################

# app.config['SQLALCHEMY_DATABASE_URL'] = os.environ.get('DATABASE_URL', '')

# app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:postgres@localhost:5432/nba2018db"
# db = SQLAlchemy(app)

engine = create_engine("postgresql://postgres:postgres@localhost:5432/nba2018db")
Base = automap_base()
Base.prepare(engine, reflect=True)

print(Base.classes.keys())

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")
    
combine = Base.classes.combine

# Service Routes
@app.route("/api/main")
def firstRoute():
    session  = Session(engine)
    data = session.query(combine.player_id, combine.player_name).all()
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
