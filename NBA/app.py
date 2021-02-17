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
from nbapy import game, shot_chart, player

from nba_api.stats.static import players
import nba_api.stats.endpoints
from nba_api.stats.static import teams
from nba_api.stats.endpoints import commonplayerinfo
import pandas as pd
from nba_api.stats.endpoints import shotchartdetail
from nba_api.stats.library.parameters import ContextMeasureSimple, LastNGames, LeagueID, Month, Period, SeasonTypeAllStar, AheadBehindNullable, ClutchTimeNullable, EndPeriodNullable, EndRangeNullable, GameSegmentNullable, LocationNullable, OutcomeNullable, PlayerPositionNullable, PointDiffNullable, PositionNullable, RangeTypeNullable, SeasonNullable, SeasonSegmentNullable, StartPeriodNullable, StartRangeNullable, ConferenceNullable, DivisionNullable


#pylint: disable=unused-variable

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

@app.route("/player")
def playerpage():
    return render_template("player.html")

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
    session.close()
    team_list = []
    for team_id, abr, nickname, city in results:
        team = {}
        team["id"] = team_id
        team["abr"] = abr
        team["nickname"] = nickname
        team["city"] = city
        team_list.append(team)
    return jsonify(team_list)

@app.route("/api/players")
def playersroute():
    session = Session(engine)
    results = session.query(players_team.player_id, players_team.team_id, players_team.player_name).all()
    session.close()
    players_team_list = []
    for player_id, team_id, name in results:
        player = {}
        player["player_id"] = player_id
        player["team_id"] = team_id
        player["player_name"] = name
        players_team_list.append(player)
    return jsonify(players_team_list)

@app.route("/api/playerinfo/<id>")
def playerinfo(id=None):
    
    player_info = commonplayerinfo.CommonPlayerInfo(player_id=id)
    df = player_info.get_data_frames()[0]
    player_data = []
    for index, row in df.iterrows():
        data = {}
        data["a_Name"] = row["DISPLAY_FIRST_LAST"]
        data["e_School"] = row["SCHOOL"]
        data["f_Country"] = row["COUNTRY"]
        data["b_Height"] = row["HEIGHT"]
        data["c_Weight"] = row["WEIGHT"]
        data["d_Seasons"] = row["SEASON_EXP"]
        data["g_Draft_year"] = row["DRAFT_YEAR"]
        data["h_Draft_round"] = row["DRAFT_ROUND"]
        data["i_draft_number"] = row["DRAFT_NUMBER"]
        player_data.append(data)
    
    return jsonify(player_data)

@app.route("/api/seasonstats/<id>")
def seasonstats(id=None):
    splits = player.Splits(player_id=id, season="2018-19").overall()
    splits = splits[['W', 'L','MIN', 'FGM',
       'FGA', 'FG_PCT', 'FG3M', 'FG3A', 'FG3_PCT', 'FTM', 'FTA', 'FT_PCT',
       'OREB', 'DREB', 'REB', 'AST',  'STL', 'BLK','TOV', 'PF',
       'PTS', 'PLUS_MINUS']]
    stats = []
    for index, row in splits.iterrows():
        game = {}
        game["aW"] = row["W"]
        game["bL"] = row["L"]
        game["dMIN"] = row["MIN"]
        game["eFGM"] = row["FGM"]
        game["fFGA"] = row["FGA"]
        game["gFG_PCT"] = row["FG_PCT"]
        game["hFG3M"] = row["FG3M"]
        game["iFG3A"] = row["FG3A"]
        game["jFTM"] = row["FTM"]
        game["kFTA"] = row["FTA"]
        game["lFT_PCT"] = row["FT_PCT"]
        game["mOREB"] = row["OREB"]
        game["nDREB"] = row["DREB"]
        game["oDREB"] = row["REB"]
        game["pAST"] = row["AST"]
        game["qSTL"] = row["STL"]
        game["rBLK"] = row["BLK"]
        game["sTOV"] = row["TOV"]
        game["tPF"] = row["PF"]
        game["uPTS"] = row["PTS"]
        game["vPLUS/MINUS"] = row["PLUS_MINUS"]
        stats.append(game)
    
    return jsonify(stats)
@app.route("/api/gamelog/<id>")
def gamelogs(id=None):
    game_log = player.GameLogs(player_id=id, season="2018-19").logs()
    game_log = game_log[['GAME_DATE', 'MATCHUP', 'WL',
       'MIN', 'FGM', 'FGA', 'FG_PCT', 'FG3M', 'FG3A', 'FG3_PCT', 'FTM', 'FTA',
       'FT_PCT', 'OREB', 'DREB', 'REB', 'AST', 'STL', 'BLK', 'TOV', 'PF',
       'PTS', 'PLUS_MINUS']]
    gamelog = []
    for index, row in game_log.iterrows():
        game = {}
        game["aDate"] = row["GAME_DATE"]
        game["bMatchup"] = row["MATCHUP"]
        game["cWL"] = row["WL"]
        game["dMIN"] = row["MIN"]
        game["eFGM"] = row["FGM"]
        game["fFGA"] = row["FGA"]
        game["gFG_PCT"] = row["FG_PCT"]
        game["hFG3M"] = row["FG3M"]
        game["iFG3A"] = row["FG3A"]
        game["jFTM"] = row["FTM"]
        game["kFTA"] = row["FTA"]
        game["lFT_PCT"] = row["FT_PCT"]
        game["mOREB"] = row["OREB"]
        game["nDREB"] = row["DREB"]
        game["oDREB"] = row["REB"]
        game["pAST"] = row["AST"]
        game["qSTL"] = row["STL"]
        game["rBLK"] = row["BLK"]
        game["sTOV"] = row["TOV"]
        game["tPF"] = row["PF"]
        game["uPTS"] = row["PTS"]
        game["vPLUS/MINUS"] = row["PLUS_MINUS"]
        gamelog.append(game)

    
    return jsonify(gamelog)

@app.route("/api/volume/<player_id>")
def volume(player_id=None):
    shot_charts = shot_chart.ShotChart(player_id=player_id, season="2018-19").shot_chart()

    df = pd.DataFrame(shot_charts["SHOT_TYPE"].value_counts())
    df['Volume'] = (df["SHOT_TYPE"]/df["SHOT_TYPE"].sum()).astype(float).map('{:,.2%}'.format)
    shot_type_pct = df[["Volume"]]
    df_2 = shot_charts[['SHOT_TYPE', "SHOT_MADE_FLAG"]]
    df_2 = df_2.rename(columns={"SHOT_TYPE": "Shot Type","SHOT_MADE_FLAG": "FG%"})
    fg_type = df_2.groupby(["Shot Type"]).mean()
    fg_type["FG%"] = fg_type["FG%"].map('{:,.2%}'.format)
    merged_type = pd.merge(shot_type_pct, fg_type, left_index=True, right_index=True)

    df = pd.DataFrame(shot_charts["SHOT_ZONE_BASIC"].value_counts())
    df['Volume'] = (df["SHOT_ZONE_BASIC"]/df["SHOT_ZONE_BASIC"].sum()).astype(float).map('{:,.2%}'.format)
    zone_pct = df[["Volume"]]
    df_2 = shot_charts[['SHOT_ZONE_BASIC', "SHOT_MADE_FLAG"]]
    df_2 = df_2.rename(columns={"SHOT_ZONE_BASIC": "Shot Type","SHOT_MADE_FLAG": "FG%"})
    fg_zone = df_2.groupby(["Shot Type"]).mean()
    fg_zone["FG%"] = fg_zone["FG%"].map('{:,.2%}'.format)
    merged_zone = pd.merge(zone_pct, fg_zone, left_index=True, right_index=True)

    df = pd.DataFrame(shot_charts["SHOT_ZONE_RANGE"].value_counts())
    df['Volume'] = (df["SHOT_ZONE_RANGE"]/df["SHOT_ZONE_RANGE"].sum()).astype(float).map('{:,.2%}'.format)
    distance_pct = df[["Volume"]]
    df_2 = shot_charts[['SHOT_ZONE_RANGE', "SHOT_MADE_FLAG"]]
    df_2 = df_2.rename(columns={"SHOT_ZONE_RANGE": "Shot Distance","SHOT_MADE_FLAG": "FG%"})
    fg_distance = df_2.groupby(["Shot Distance"]).mean()
    fg_distance["FG%"] = fg_distance["FG%"].map('{:,.2%}'.format)
    merged_distance = pd.merge(distance_pct, fg_distance, left_index=True, right_index=True)

    concat = pd.concat([merged_type, merged_zone])
    final = pd.concat([concat, merged_distance])

    volume = []
    for index, row in final.iterrows():
        data = {}
        data["Location"] = index
        data["Volume"] = row["Volume"]
        data["Percent"] = row["FG%"]
        volume.append(data)

    return jsonify(volume)

@app.route("/api/shotchart/<player_id>")
def shotcharts(player_id=None):
    
    shot_charts = shot_chart.ShotChart(player_id=player_id, season="2018-19").shot_chart()
    shot_charts["MADE_MISS"] = ['green' if x == 1 else 'red' for x in shot_charts['SHOT_MADE_FLAG']]
    df = shot_charts
    
    allshots = []
    for index, row in df.iterrows():
        shot = {}
        shot["index"] = index
        shot["year"] = row["GAME_DATE"][0:4]
        shot["day"] = row["GAME_DATE"][4:6]
        shot["month"] = row["GAME_DATE"][6:8]
        shot["game_id"] = row["GAME_ID"]
        shot["team"] = row["TEAM_NAME"]
        shot["name"] = row["PLAYER_NAME"]
        shot["quarter"] = row["PERIOD"]
        shot["minutes"] = row["MINUTES_REMAINING"]
        shot["seconds"] = row["SECONDS_REMAINING"]
        shot["action_type"] = row["ACTION_TYPE"]
        shot["shot_type"] = row["SHOT_TYPE"]
        shot["shot_distance"] = row["SHOT_DISTANCE"]
        shot["shot_made"] = row["SHOT_MADE_FLAG"]
        shot["class"] = row["MADE_MISS"]            
        shot["x"] = row["LOC_X"]
        shot["y"] = row["LOC_Y"]
        shot["home"] = row["HTM"]
        shot["away"] = row["VTM"] 
        allshots.append(shot)

    return jsonify(allshots)

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
        stats_dict["2PT Made"] = result[4]
        stats_dict["3PT Made"] = result[5]
        stats_dict["Minutes Played"] = result[6]
        stats_dict["Field-Goal Made"] = result[7]
        stats_dict["Field-Goal Attempts"] = result[8]
        stats_dict["Field-Goal %"] = result[9]
        stats_dict["3PT Attempts"] = result[10]
        stats_dict["3PT %"] = result[11]
        stats_dict["2PT Attempts"] = result[12]
        stats_dict["2PT %"] = result[13]
        stats_dict["Effective Field-Goal %"] = result[14]
        stats_dict["FT Made"] = result[15]
        stats_dict["FT Attemps"] = result[16]
        stats_dict["FT %"] = result[17]
        stats_dict["Points"] = result[18]
        stats_dict["Offensive Rebounds"] = result[19]
        stats_dict["Defensive Rebounds"] = result[20]
        stats_dict["Total Rebounds"] = result[21]
        stats_dict["Assists"] = result[22]
        stats_dict["Steals"] = result[23]
        stats_dict["Blocks"] = result[24]
        stats_dict["Turnovers"] = result[25]
        all_stats.append(stats_dict)
   
    return jsonify(all_stats)

if __name__ == "__main__":
    app.run(debug=True)
