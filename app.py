import os

import pandas as pd
import numpy as np
import json 
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


app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data/soccer.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
soccer_data = Base.classes.soccerdata
stmt = db.session.query(soccer_data).statement
df = pd.read_sql_query(stmt, db.session.bind)


csv_path = "data/countries.csv"
countryloc_df = pd.read_csv(csv_path, encoding='cp1252')

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/lnames")
def lnames():
    """Return list of league names."""        
    data = df.league_name.unique()
    return jsonify(list(data))


@app.route("/clist")
def clist():
    """Return list of league names."""
    citydata = df["country_name"].value_counts()
    citydata = pd.DataFrame(citydata).reset_index()
    citydata.columns = ['country_name', 'count']
    # countryloc_df = countryloc_df['latitude']+ ',' + countryloc_df['longitude']
    df1 = countryloc_df['latitude'].astype(str)
    df2 = countryloc_df['longitude'].astype(str)
    countryloc_dfa = df1+ ',' + df2
    countryloc_df["location"] = countryloc_dfa    
    citylocdata = citydata[['country_name', 'count']].merge(countryloc_df[['country_name','location']], on='country_name', how='left')
    citylocdata = citylocdata[['country_name','location','count']]
    convjason = citylocdata.to_dict(orient='records')
    jlocdata = json.dumps(convjason)    
    return jlocdata
        
    
if __name__ == "__main__":
    app.run()
