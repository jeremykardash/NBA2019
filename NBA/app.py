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

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:postgres@localhost:5432/nba2018db"
db = SQLAlchemy(app)

engine = create_engine("postgresql://postgres:postgres@localhost:5432/nba2018db")
Base = automap_base()
Base.prepare(engine, reflect=True)

print(Base.classes.keys())

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")
    
combine = Base.classes.combine

stats = Base.classes.stats

Salary = Base.classes.salary


# Service Routes
@app.route("/api/main")
def firstRoute():
    data = db.session.query(combine.player_id, stats.player_name, stats.pos).filter(combine.player_id == stats.player_id).all()
    return jsonify(data)


@app.route("/api/stats")
def bubbleroute():
    session = Session(engine)
    results = session.query(stats.player_id, stats.player_name,Salary.salary, stats.pos,stats.TwoP_m, stats.ThreeP_m).filter(Salary.player_id == stats.player_id).all()
    session.close()
    all_stats = []
    for player_id, player_name, salary, pos, TwoP_m, ThreeP_m in results:
        stats_dict ={}
        stats_dict["Player_id"] = player_id
        stats_dict["Player_name"] = player_name
        stats_dict["Salary"] = salary
        stats_dict["Position"] = pos
        stats_dict["2pm"] = TwoP_m
        stats_dict["3pm"] = ThreeP_m
        all_stats.append(stats_dict)
    return jsonify(all_stats)

if __name__ == "__main__":
    app.run(debug=True)
