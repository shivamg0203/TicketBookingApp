from datetime import datetime, time
from functools import wraps
import re
# from redis import *
from flask import Blueprint, json, render_template, request, redirect, url_for, jsonify
from flask_login import login_user
from flask_security import Security, SQLAlchemyUserDatastore, UserMixin, RoleMixin, login_required
from flask_restful import Resource, Api
from flask_jwt_extended import (JWTManager, jwt_required, create_access_token,get_jwt_identity, get_jwt)
from .models import Theatre, TheatreShow, User, Order
from .models import Show as ModelShow
from .import views
from . import tasks
# from flask_bcrypt import Bcrypt
from werkzeug.security import generate_password_hash, check_password_hash


import csv
from email.mime.application import MIMEApplication
import json
from  .workers import celery
from .models import Theatre, TheatreShow, Order
# from .models import Theatre, Show , TheatreShow, Order
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
# from .cache import get_all_show

SMTP_SERVER_HOST = "localhost"
SMTP_SERVER_PORT = 1025
SENDER_ADDRESS = "adminsender@gmail.com"
SENDER_PASSWORD = "SecretAdmin@222"



def loggin(user):
        login_user(user, remember=True)
apiBlueprint = Blueprint("api", __name__,  url_prefix='/api')
  

class UserSignup(Resource):        # 'api/'
    def post(self):
        post_data = request.get_json()
        print(post_data)
        print('/api has reached')
        username = request.json.get('username')
        email = request.json.get('email')
        password = request.json.get('password')
        print(username,email,password)
        from .models import User
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return json.dumps({'message':'Username already exists'})
        existing_email = User.query.filter_by(email=email).first()
        if existing_email:
            print('existing email')
            return json.dumps({'message':'Email already exists'})
      
        try:
            new_user = User(role_id=2, username=username, email=email,  password=generate_password_hash(password, method='sha256'))
            # Add the user to the SQLAlchemy session and commit the changes
            from . import db
            db.session.add(new_user)
            db.session.commit()
            return json.dumps({'message':'Success! Account Created'}), 200
        except Exception as e:
            print(str(e))
            return json.dumps({'message':'Some error occured in database'})
    def get(self):
        return json.dumps({'message':'Get request at UserSignup'})
   
class SignIn(Resource):       #/api/signin
    @jwt_required()
    def get(self):
        # print(cache)
        user = User.query.get(get_jwt_identity())
        print(user.to_dict())
        return user.to_dict()
    
    def post(self):
        posted_data= request.get_json()
        print(posted_data)
        username=posted_data['username']
        password=posted_data['password']
        role=posted_data['role']
        print(username,password,role)
        user = User.query.filter_by(username=username).first()
        if user:
            if role==False:
                if (check_password_hash(user.password, password) and user.role_id==2):
                    # login_user(user)
                    access_token = create_access_token(identity=user.id)
                    return json.dumps({'access_token': access_token,'role':'User'}), 200
                else:
                    return json.dumps({'message':'Invalid User credential'})
            else:
                if(username=='Admin'and password=='SecretAdmin@222' and role==True):
                    # login_user(user)
                    print('admin code')
                    access_token = create_access_token(identity=user.id)
                    return json.dumps({'access_token': access_token, 'role':'Admin'}), 200
                    # return redirect(url_for('views.home'))
                    # return json.dumps({'message':'Success! Admin Login successful'}), 200
                else:
                    return json.dumps({'message':'Invalid Admin credential'})
        else:
            return json.dumps({'message':'User not found'})

blacklist = set()
class SignOut(Resource):   #/api/signout
    @jwt_required()
    def post(self):
        try:
            jti = get_jwt()['jti']
            blacklist.add(jti)
            print(blacklist,jti)
            print('/signout')
            return {'message': 'Successfully logged out'}, 200
        except:
            return {'message': 'Internal Error Occured'}, 500
        
class Venue(Resource):     #api/venue
    @jwt_required()
    def get(self):
        try:
            job = tasks.admin_csv_task.delay()
            return job.get(), 200
        except Exception as e:
            return json.dumps({'message': 'An error occurred', 'error': str(e)})

    @jwt_required()
    def post(self):
        posted_data= request.get_json()
        print(posted_data)
        name=posted_data['name']
        capacity=posted_data['capacity']
        place=posted_data['place']
        city=posted_data['city']
        new_venue=Theatre(name=name,capacity=capacity, place=place, city=city)
        try:
            from . import db
            db.session.add(new_venue)
            db.session.commit()
            return json.dumps({'message':'New Venue created'}), 200
        except:
            return json.dumps({'message':'Internal Error Occured'}), 200
        
    @jwt_required()
    def delete(self):
        posted_data=request.get_json()
        print(posted_data) 
        # print(posted_data['VenueId'])
        venid=posted_data['VenueId']
        from . import db
        try:
            venue = Theatre.query.get(venid)
            if venue is None:
                return json.dumps({'message': 'Venue not found'}), 404
            else:
                tS = TheatreShow.query.filter_by(theatre_id = venid).all()
                for j in tS:
                    shw = ModelShow.query.filter_by(id = j.show_id).first()
                    db.session.delete(shw)
                    db.session.commit()
                # for theatre_show in tS:
                    db.session.delete(j)
                db.session.delete(venue)
                db.session.commit()

            return json.dumps({'message': 'Venue deleted successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return json.dumps({'message': 'An error occurred', 'error': str(e)})
    @jwt_required()
    def patch(self):
        posted_data=request.get_json()
        print(posted_data)
        id=posted_data['id']
        name=posted_data['name']
        capacity=posted_data['capacity']
        place=posted_data['place']
        location=posted_data['location']
        print(id,name,capacity,place,location)
        venueObj=Theatre.query.get(id)
        from .import db
        if not venueObj:
            return json.dumps({'message':'Venue not found'})
        try: 
            venueObj.name=name
            venueObj.capacity=capacity
            venueObj.place=place
            venueObj.city=location
            db.session.commit()
            return json.dumps({'message':'Venue Update Successful'}), 200
        except Exception as e:
            db.session.rollback()
            return json.dumps({'message': 'An error occurred', 'error': str(e)})
            
class Show(Resource):     #api/show
    @jwt_required()
    def get(self):
        reqList=[]
        try:
            allvenue=Theatre.query.all()
            for a in allvenue:
                allLinkedtheatreshow=TheatreShow.query.filter_by(theatre_id=a.id).all()
                venlist=[]
                venlist.append(a.to_dict())   
                for b in allLinkedtheatreshow:
                    allLinkedShow=ModelShow.query.filter_by(id=b.show_id).all()
                    for c in allLinkedShow:
                        print(allLinkedShow)
                        venlist.append(c.to_dict())
                reqList.append(venlist)
            print(reqList)
            return json.dumps({'data':reqList}), 200
        except:
            return json.dumps({'data':'Some Error occured'}), 500
        # get_all_show()


        
    @jwt_required()
    def post(self):
        posted_data= request.get_json()
        print(posted_data)
        linkVID=posted_data['linkVID']
        showname=posted_data['showname']       
        ratings=posted_data['ratings']       
        duration=posted_data['duration']    
        dateTime=posted_data['dateTime']    
        tags=posted_data['tags']    
        price=posted_data['price']   
        print(duration)
        # print(time(duration))
        try:
            newDateTime = datetime.strptime(dateTime, '%Y-%m-%dT%H:%M')
            seats_available=Theatre.query.get(linkVID).capacity
            print(seats_available)
            newShow=ModelShow(name=showname,duration=datetime.strptime(duration, '%H:%M').time(),rating=ratings,tags=tags,price=price,seat_available=seats_available,dateTime=newDateTime)
            print(newShow) 
            from . import db
            db.session.add(newShow)
            db.session.commit()
            newTheatreShow=TheatreShow(theatre_id=linkVID,show_id=newShow.id)
            # print(TheatreShow.query.get(newTheatreShow))
            print(newTheatreShow)
            db.session.add(newTheatreShow)
            db.session.commit()
            return json.dumps({'message':'New Show Added'}), 200
        except Exception as e:
            print(e)
            return json.dumps({'message':'Internal Error Occured', 'error':str(e)})   
    @jwt_required()
    def patch(self):
        posted_data=request.get_json()
        print(posted_data)
        # linkSID=posted_data['linkSID']
        # linkVID=posted_data['linkVID']
        showname=posted_data['name']       
        ratings=posted_data['rating']       
        id=posted_data['id']       
        duration=posted_data['duration']    
        dateTime=posted_data['dateTime']    
        tags=posted_data['tags']    
        price=posted_data['price'] 
        print(showname,ratings, type(duration),duration, tags,price)     
        showObj=ModelShow.query.get(int(id))
        from .import db
        if not showObj:
            return json.dumps({'message':'Show not found'})
        try: 
            showObj.name=showname
            showObj.rating=ratings
            showObj.duration=time(int((duration)[:2]),int((duration)[3:5]))         
            showObj.price=price
            showObj.tags=tags         
            print('cjhgvaghjskcijhvsab')         
            db.session.commit()
            return json.dumps({'message':'Venue Update Successful'}), 200
        except Exception as e:
            db.session.rollback()
            return json.dumps({'message': 'An error occurred', 'error': str(e)}) 
            

    @jwt_required()
    def delete(self):
        posted_data=request.get_json()
        print(posted_data)
        Vid=posted_data['VenueId']
        Sid=posted_data['ShowId']
        print(Sid, Vid)
        from . import db
        try:
            Vobj = Theatre.query.get(Vid)
            Sobj= ModelShow.query.get(Sid)
            link = TheatreShow.query.filter_by(theatre_id=Vid, show_id=Sid).first()
            # if(Vid and Sid and link):
            print(Sobj, link)
            db.session.delete(link)
            db.session.delete(Sobj)
            # db.session.delete(Vid)
            db.session.commit()
            return json.dumps({'message': 'Venue deleted successfully'}), 200
        except Exception as e:
            print(e)
            db.session.rollback()
            return json.dumps({'message': 'An error occurred', 'error': str(e)})                

        
class Orders(Resource): 
    @jwt_required()
    def get(self):
        try:
            orderlist=Order.query.filter_by(user_id=get_jwt_identity()).all()
            print(orderlist)
            oList=[]
            # oList = [order.to_dict() for order in orderlist]
            for order in orderlist:
                show = ModelShow.query.get(order.show_id)
                venue = Theatre.query.get(order.venue_id)
                # rated = order.rated
                print(show.to_order())
                print(order.to_order())
                print(venue.to_order())
                orderObj={} 
                if show and venue:
                    order_dict ={**order.to_order(), **show.to_order(),  **venue.to_order()}
                    oList.append(order_dict)
            print(oList)
                # print(i.to_dict())
            print(oList)
            return (oList)
        except: 
            return {'message', 'Some Error Occured'}, 500
        
        return json.dumps({'message': '/order is reached'})
    @jwt_required()
    def post(self):
        posted_data=request.get_json()
        print(posted_data)
        show_id=posted_data['SId']
        venue_id=posted_data['VId']
        seats=posted_data['Seats']
        showObj=ModelShow.query.get(show_id)
        from .import db
        if not showObj:
            return json.dumps({'message':'Show not found'})
        try: 
            if (showObj.seat_available < int(seats) or showObj.seat_available ==0):
                return json.dumps({'message':'Not Enough Seats'})
            showObj.seat_available =  showObj.seat_available - int(seats) 
            new_booking=Order(show_id=showObj.id,venue_id=venue_id, user_id = get_jwt_identity(),created = datetime.now(),seats=int(seats), rated = 0)
            db.session.add(new_booking)
            db.session.commit()
            return json.dumps({'message':'Seat Book Successful'}), 200
        except Exception as e:
            db.session.rollback()
            print(e)
            return json.dumps({'message': 'An error occurred', 'error': str(e)}) 
        
    @jwt_required()
    def patch(self):
        posted_data=request.get_json()
        print(posted_data)
        id=posted_data['id']
        rated=posted_data['rated']  
        orderObj=Order.query.get(id)
        from .import db
        if not orderObj:
            return json.dumps({'message':'Order not found'})
        try: 
            orderObj.rated=rated
            db.session.commit()
            return json.dumps({'message':'Order Update Successful'}), 200
        except Exception as e:
            db.session.rollback()
            return json.dumps({'message': 'An error occurred', 'error': str(e)})  
        
        
    @jwt_required()
    def delete(self):
        return json.dumps({'message': '/order is reached'})
    
class Jobs(Resource):
    @jwt_required()
    def post(self):
        print("in jobs")
        posted_data=request.get_json()
        print(posted_data)
        try:
            job = tasks.send_email.delay(to_address = 'adminreceiver@gmail.com', subject="CSV DATA", message=posted_data)
            if job.get():
                return {'message':'Check Your Mail'}, 200
        except Exception as e:
            return json.dumps({'message': 'An error occurred', 'error': str(e)})
        # message_dict = posted_data
        # print("sending emails")
from flask_restful import Api

realapi = Api(apiBlueprint)    
realapi.add_resource(UserSignup, '/')        
realapi.add_resource(SignIn, '/signin')             
realapi.add_resource(SignOut, '/signout')             
realapi.add_resource(Venue, '/venue')             
realapi.add_resource(Show, '/show')             
realapi.add_resource(Orders, '/order')           
realapi.add_resource(Jobs, '/job')           
       
        