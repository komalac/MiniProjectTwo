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


app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data/SoccerDatabase.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
soccer_data = Base.classes.MasterData
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
    data = df.league.unique()
    return jsonify(list(data))

@app.route("/snames/<lgname>")
def snames(lgname):
    """Return list of season names."""        
    dfa = df[df['league'].isin([lgname])]
    data = dfa.season.unique()
    return jsonify(list(data))

@app.route("/lgdetails/<lgname>")
def lgdetails(lgname):
    """Return list of season names."""        
    dfa = df[df['league'].isin([lgname])]
    data = dfa.iloc[0]
    print(data)
    return jsonify(list(data))

@app.route("/clist")
def clist():
    """Return list of countries"""
    citydata = df["country"].value_counts()
    citydata = pd.DataFrame(citydata).reset_index()
    citydata.columns = ['country', 'count']
    # countryloc_df = countryloc_df['latitude']+ ',' + countryloc_df['longitude']
    df1 = countryloc_df['latitude'].astype(str)
    df2 = countryloc_df['longitude'].astype(str)

    # print(df1, df2, citydata)
    # countryloc_dfa = [countryloc_df['latitude'], countryloc_df['longitude']]
    # countryloc_dfa = df1+ ',' + df2
    countryloc_dfa = list(zip(countryloc_df['latitude'], countryloc_df['longitude']))
    countryloc_df["location"] = countryloc_dfa    

    # print(countryloc_dfa)

    citylocdata = citydata[['country', 'count']].merge(countryloc_df[['country','location']], on='country', how='left')
    citylocdata = citylocdata[['country','location','count']]

    # print(citylocdata)

    convjason = citylocdata.to_dict(orient='records')
    jlocdata = json.dumps(convjason)     

    # print(list(citylocdata))
   
    return jlocdata
        
    
if __name__ == "__main__":
    app.run(debug=True, port=5002)
