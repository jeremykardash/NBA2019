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

###NPA API
from nba_api.stats.static import players
import nba_api.stats.endpoints
from nba_api.stats.static import teams
from nba_api.stats.endpoints import shotchartdetail
from nba_api.stats.endpoints import commonplayerinfo
from nba_api.stats.library.parameters import ContextMeasureSimple, LastNGames, LeagueID, Month, Period, SeasonTypeAllStar, AheadBehindNullable, ClutchTimeNullable, EndPeriodNullable, EndRangeNullable, GameSegmentNullable, LocationNullable, OutcomeNullable, PlayerPositionNullable, PointDiffNullable, PositionNullable, RangeTypeNullable, SeasonNullable, SeasonSegmentNullable, StartPeriodNullable, StartRangeNullable, ConferenceNullable, DivisionNullable

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
def main():
    session = Session(engine)
    data = session.query(combine.player_id, stats.player_name, stats.pos).filter(combine.player_id == stats.player_id).all()
    session.close()
    return jsonify(data)

@app.route("/api/teams")
def teamsroute():
    session = Session(engine)
    results = session.query(teams.team_id, teams.abbreviation, teams.nickname, teams.city).all()
    team_list = []
    for team_id, abr, nickname, city in results:
        team = {}
        team["id"] = team_id
        team["abr"] = abr
        team["nickname"] = nickname
        team["city"] = city
        team_list.append(team)
    session.close()
    return jsonify(team_list)

@app.route("/api/players")
def playersroute():
    session = Session(engine)
    results = session.query(players_team.player_id, players_team.team_id, players_team.player_name).all()
    players_team_list = []
    for player_id, team_id, name in results:
        player = {}
        player["player_id"] = player_id
        player["team_id"] = team_id
        player["player_name"] = name
        players_team_list.append(player)
    session.close()
    return jsonify(players_team_list)

@app.route("/api/playerinfo/<id>")
def playerinfo(id=None):
    
    player_info = commonplayerinfo.CommonPlayerInfo(player_id=id)
    df = player_info.get_data_frames()[0]
    player_data = []
    for index, row in df.iterrows():
        data = {}
        data["player_id"] = row["PERSON_ID"]
        data["name"] = row["DISPLAY_FIRST_LAST"]
        data["school"] = row["SCHOOL"]
        data["country"] = row["COUNTRY"]
        data["height"] = row["HEIGHT"]
        data["weight"] = row["WEIGHT"]
        data["seasons"] = row["SEASON_EXP"]
        data["name"] = row["DISPLAY_FIRST_LAST"]
        data["draft_year"] = row["DRAFT_YEAR"]
        data["draft_round"] = row["DRAFT_ROUND"]
        data["draft_number"] = row["DRAFT_NUMBER"]
        player_data.append(data)
    
    return jsonify(player_data)

@app.route("/api/playerstats/<id>")
def playerinfo(id=None):



@app.route("/api/shotchart/<player_id>")
def shotcharts(player_id=None):
    
    player_shotchart = shotchartdetail.ShotChartDetail(player_id=player_id,
                                                        team_id=0, 
                                                        season_nullable='2018-19')
    
    data = player_shotchart.get_data_frames()
    df = data[0]
    allshots = []
    for index, row in df.iterrows():
        shot = {}
        shot["index"] = index
        shot["year"] = row["GAME_DATE"][0:4]
        shot["month"] = row["GAME_DATE"][4:6]
        shot["day"] = row["GAME_DATE"][6:8]
        shot["game_id"] = row["GAME_ID"]
        shot["team"] = row["TEAM_NAME"]
        shot["name"] = row["PLAYER_NAME"]
        shot["quarter"] = row["PERIOD"]
        shot["minutes"] = row["MINUTES_REMAINING"]
        shot["seconds"] = row["SECONDS_REMAINING"]
        shot["action_type"] = row["ACTION_TYPE"]
        shot["shot_type"] = row["SHOT_TYPE"]
        shot["shot_distance"] = row["SHOT_DISTANCE"]
        shot["x"] = row["LOC_X"]
        shot["y"] = row["LOC_Y"]
        shot["home"] = row["HTM"]
        shot["away"] = row["VTM"] 
        allshots.append(shot)
    return jsonify(allshots)

@app.route("/api/stats")
def bubbleroute():
    session = Session(engine)
    sel = [stats.player_id, stats.player_name,salaries.salary, stats.pos,stats.TwoP_m, stats.ThreeP_m]
    results = session.query(*sel).filter(salaries.player_id == stats.player_id).all()
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
