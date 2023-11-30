
from . import tasks
from flask_security import Security, SQLAlchemyUserDatastore, auth_required
from flask_jwt_extended import (JWTManager, jwt_required, create_access_token,get_jwt_identity, get_jwt)
from flask import Blueprint, json
import base64
from .models import Theatre, Show, TheatreShow, User
views = Blueprint('views', __name__)
 
# from . import get_cache, get_app
from flask_sqlalchemy import SQLAlchemy
import os
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy
import uuid
from flask_security import Security, login_required, UserMixin, RoleMixin
from werkzeug.security import check_password_hash
    
@views.route('/', methods=['GET', 'POST'])
def log():
    print('/is reached')
    return render_template('index2.html')   
    
@views.route('/getlist', methods=['GET'])
# @jwt_required()
def getlist():
    locations = Theatre.query.with_entities(Theatre.city).distinct().all()
    locationList= [location[0] for location in locations]
    print(locationList)
    prices = Show.query.with_entities(Show.price).distinct().all()
    price = [l[0] for l in prices]
    print(price)
    all_tags = get_distinct_tags()
    

    return {'location':locationList, 'price':price, 'tag':all_tags}

# @views.route('alldtags', methods = ['GET'])
def get_distinct_tags():
    # Retrieve all shows from the database
    shows = Show.query.all()
    # Initialize an empty list to store distinct tags
    distinct_tags = []

    # Loop through each show and split its tags into a list
    for show in shows:
        tags = show.tags.split(',')
        
        # Remove leading and trailing whitespace from each tag
        tags = [tag.strip() for tag in tags]
        
        # Add the tags to the distinct_tags list, filtering out duplicates
        distinct_tags.extend([tag for tag in tags if tag not in distinct_tags])

    return distinct_tags


@views.route('/userfiltervenue/<type>/<value>', methods=['GET'])
def searchvenue(type, value):
    print(type, value)
    if value == 'All':
        reqList=[]
        allvenue=Theatre.query.all()
        for a in allvenue:
            allLinkedtheatreshow=TheatreShow.query.filter_by(theatre_id=a.id).all()
            venlist=[]
            venlist.append(a.to_dict())   
            for b in allLinkedtheatreshow:
                allLinkedShow=Show.query.filter_by(id=b.show_id).all()
                for c in allLinkedShow:
                    print(allLinkedShow)
                    venlist.append(c.to_dict())
            reqList.append(venlist)
        print(reqList)
        return json.dumps({'data':reqList}), 200
    else:
        if type == 'location':
            reqList=[]
            searchlist=Theatre.query.filter_by(city=value).all()
            for a in searchlist:
                allLinkedtheatreshow=TheatreShow.query.filter_by(theatre_id=a.id).all()
                venlist=[]
                venlist.append(a.to_dict())   
                for b in allLinkedtheatreshow:
                    allLinkedShow=Show.query.filter_by(id=b.show_id).all()
                    for c in allLinkedShow:
                        print(allLinkedShow)
                        venlist.append(c.to_dict())
                reqList.append(venlist)
                print(reqList)
            return json.dumps({'data':reqList}), 200
        else:
            # print(value)
            reqList=[]
            alltre = Theatre.query.all()
            for t in alltre:
                venlist = []
                tsh = TheatreShow.query.filter_by(theatre_id=t.id).all()
                for shw in tsh:
                    asw = Show.query.filter_by(id = shw.show_id).first()
                    tlist = asw.tags.split(',')
                    tags = [tag.strip() for tag in tlist]
                    print(tags)
                    for s in tags:
                        if s == value:
                            print(s)
                            if t.to_dict() not in venlist:
                                venlist.append(t.to_dict())
                            venlist.append(asw.to_dict())    
                            # print(venlist)
                if venlist != []:           
                    reqList.append(venlist)   
            print(reqList)         
            return json.dumps({'data':reqList}), 200
            # allshow = Show.query.all()
            # for a in allshow:
            #     # tagg = a.tags
            #     t = a.tags.split(',')
            #     tags = [tag.strip() for tag in t]
            #     print(tags)
            #     for s in tags:
            #         if s == value:
            #             print(a)
            # searchlist2=Show.query.filter_by(price = value).all()
            # for k in searchlist2:
            #     linkedtheatreshows=TheatreShow.query.filter_by(show_id = k.id).all()
            #     # alltheatreshows=TheatreShow.query.all()
            #     # for t in alltheatreshows:
            #     for g in linkedtheatreshows:
            #         venlist=[]
            #         tobj = Theatre.query.filter_by(id = g.theatre_id).first()
            #         sobj = Show.query.filter_by(id = g.show_id).first()
            #         venlist.append(tobj.to_dict())
            #         venlist.append(sobj.to_dict())
            #         for h in linkedtheatreshows:
            #             if (g.id != h.id):
            #                 if (g.theatre_id == h.theatre_id):
            #                     sobj2 = Show.query.filter_by(id = h.show_id).first()
            #                     venlist.append(sobj2) 
            

@views.route('/home', methods=['GET','POST'])
@jwt_required()
def home():
    print("/home is reached")
    current_user = get_jwt_identity()
    return json.dumps({'message':'true'})
    # return render_template('userhome.html')

@views.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    print(current_user)
    return json.dumps({'message': f'Hello, {current_user}! This is a protected route.'}), 200

@views.route('/checkauth', methods=['GET'])
@jwt_required(optional=True)
def checkauth():
    current_identity = get_jwt_identity()
    if current_identity:
        return json.dumps({'message': True}), 200
        # return jsonify(logged_in_as=current_identity)
    else:
        return json.dumps({'message': False}), 200
        # return jsonify(logged_in_as="anonymous user")
    

