# import necessary libraries

import os
from flask.globals import session
from flask_sqlalchemy import SQLAlchemy

#from models import create_classes

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

###NPA API
# from nba_api.stats.static import players
# import nba_api.stats.endpoints
# from nba_api.stats.static import teams
# from nba_api.stats.endpoints import shotchartdetail
# from nba_api.stats.library.parameters import ContextMeasureSimple, LastNGames, LeagueID, Month, Period, SeasonTypeAllStar, AheadBehindNullable, ClutchTimeNullable, EndPeriodNullable, EndRangeNullable, GameSegmentNullable, LocationNullable, OutcomeNullable, PlayerPositionNullable, PointDiffNullable, PositionNullable, RangeTypeNullable, SeasonNullable, SeasonSegmentNullable, StartPeriodNullable, StartRangeNullable, ConferenceNullable, DivisionNullable

# Flask Setup
#################################################
app = Flask(__name__)

# Database Setup
#################################################

# app.config['SQLALCHEMY_DATABASE_URL'] = os.environ.get('DATABASE_URL', '')

#app.config['SQLALCHEMY_DATABASE_URL'] = "postgres://gvuvmkxy:Z62u_yZyL3sTjlr-XDy0eUcBrAy9ucOU@ziggy.db.elephantsql.com:5432/gvuvmkxy"
#db = SQLAlchemy(app)

engine = create_engine("postgres://gvuvmkxy:Z62u_yZyL3sTjlr-XDy0eUcBrAy9ucOU@ziggy.db.elephantsql.com:5432/gvuvmkxy")

Base = automap_base()
Base.prepare(engine, reflect=True)

#Tables for queries
combine = Base.classes.combine
players = Base.classes.players
stats = Base.classes.stats
teams = Base.classes.teams
salaries = Base.classes.salaries
players_team = Base.classes.players_teams


# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")


# Service Routes
@app.route("/api/main")
def firstRoute():
    session = Session(engine)
    data = session.query(combine.player_id, stats.player_name, stats.pos).filter(combine.player_id == stats.player_id).all()
    return jsonify(data)

@app.route("/api/shotchart/<player_id>")
#@app.route("/api/shotchart/")
def shotcharts(player_id=None):
    
    player_shotchart = shotchartdetail.ShotChartDetail(player_id=player_id,  #201142
                                                        team_id=0, 
                                                        season_nullable='2018-19')
    
    data = player_shotchart.get_data_frames()
    df = data[0]
    shotchart_data = df.to_dict()
    return jsonify(shotchart_data)

@app.route("/api/stats")
def bubbleroute():
    session = Session(engine)
    sel = [stats.player_id, stats.player_name, salaries.salary, stats.pos,
    stats.TwoP_m, stats.ThreeP_m, stats.mp, stats.fg, stats.fga, stats.fg_percent,	
    stats.ThreeP_a,	stats.ThreeP_percent, stats.TwoP_a,	stats.TwoP_percent,	stats.efg_percent,	
    stats.ft, stats.fta, stats.ft_percent, stats.pts, stats.orb, stats.drb, stats.trb, stats.ast,
     stats.stl, stats.blk, stats.tov]

    results = session.query(*sel).filter(salaries.player_id == stats.player_id).all()
    session.close()
    all_stats = []
    for result in results:
        stats_dict ={}
        stats_dict["Player_id"] = result[0]
        stats_dict["Player_name"] = result[1]
        stats_dict["Salary"] = result[2]
        stats_dict["Position"] = result[3]
        stats_dict["TwoP_m"] = result[4]
        stats_dict["ThreeP_m"] = result[5]
        stats_dict["Minutes_played"] = result[6]
        stats_dict["Fgm"] = result[7]
        stats_dict["Fga"] = result[8]
        stats_dict["Fg_percent"] = result[9]
        stats_dict["ThreeP_a"] = result[10]
        stats_dict["ThreeP_percent"] = result[11]
        stats_dict["TwoP_a"] = result[12]
        stats_dict["TwoP_percent"] = result[13]
        stats_dict["Efg_percent"] = result[14]
        stats_dict["Ftm"] = result[15]
        stats_dict["Fta"] = result[16]
        stats_dict["Ft_percent"] = result[17]
        stats_dict["Points"] = result[18]
        stats_dict["Orb"] = result[19]
        stats_dict["Drb"] = result[20]
        stats_dict["Trb"] = result[21]
        stats_dict["Assits"] = result[22]
        stats_dict["Steals"] = result[23]
        stats_dict["Blocks"] = result[24]
        stats_dict["Tov"] = result[25]
        all_stats.append(stats_dict)
    
    return jsonify(all_stats)

if __name__ == "__main__":
    app.run(debug=True)
