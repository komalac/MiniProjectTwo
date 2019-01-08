import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################


app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data/database.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
league_data = Base.classes.League
match_data = Base.classes.Match
player_data = Base.classes.Player
playeratt_data = Base.classes.Player_Attributes
team_data = Base.classes.Team
teamatt_data = Base.classes.Team_Attributes



@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/lnames")
def lnames():
    """Return list of league names."""
    
    stmt = db.session.query(league_data).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    return jsonify(list(df["name"]))


@app.route("/matchlist")
def snames():
    """Return list of league names."""
    # print("hello sname")
    # ltable = db.session.query(league_data.id).filter(league_data.name == lname)   
    stmt = db.session.query(match_data).statement
    df = pd.read_sql_query(stmt, db.session.bind)
     # Format the data to send as json
    data = {
        "matchid": df.match_api_id.values.tolist(),
        "hometeam": df.home_team_api_id.values.tolist(),
        "awayteam": df.away_team_api_id.tolist(),        
        "homegoal": df.home_team_goal.values.tolist(),
        "awaygoal": df.away_team_goal.tolist()
            }
    return jsonify(data)


    
if __name__ == "__main__":
    app.run()
