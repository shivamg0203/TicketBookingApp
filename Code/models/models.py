import datetime
from email.policy import default
from unicodedata import name
from . import db
from flask_login import UserMixin, current_user
from sqlalchemy.sql import func



class User(db.Model,UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    role_id = db.Column(db.Integer(), db.ForeignKey('role.id'), nullable=False) 
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    # roles=db.relationship("Role", secondary="roleuser", back_populates="user")
    def __str__(self):
        role_str = f", Role: {self.role.name}" if self.role else ""
        return f"User ID: {self.user_id}, Username: {self.username}, Email: {self.email}{role_str}"
    
    def to_dict(self):
        if self.role_id == 2:
            return {
                'id': self.id,
                'name': self.username,
                'email': self.email,
                'role':'User',
                'role_desc':'You are a regular User'
            }
        else:
            return {
                'id': self.id,
                'name': self.username,
                'email': self.email,
                'role':'Admin',
                'role_desc':'You are an Admin'
            }
        

    
class Role(db.Model, UserMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), nullable=False, unique=True)
    description = db.Column(db.String(), nullable=True, unique=True)
    userrole = db.relationship('User', backref='user_role',lazy=True)    
    # users=db.relationship("User", secondary="roleuser", back_populates="roles")
    def __str__(self):
        return f"Role ID: {self.id}, Name: {self.name}, Description: {self.description}"        

class Theatre(db.Model):
    __tablename__='theatre'
    
    def __init__(self, name, capacity, city, place):
        self.name = name
        self.capacity = capacity
        self.city = city
        self.place = place

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'capacity': self.capacity,
            'city': self.city,
            'place': self.place
        }
    def to_order(self):
        return{
            'theatre_name':self.name
        }    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    city=db.Column(db.String, nullable=False)
    place=db.Column(db.String, nullable=False)
    # theatrevenue = db.relationship('Show', backref='theatre_show',lazy=True)    
    
class TheatreShow(db.Model):
    __tablename__='theatreshow'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    theatre_id=db.Column(db.Integer, db.ForeignKey('theatre.id'), nullable=False)
    show_id=db.Column(db.Integer, db.ForeignKey('show.id'), nullable=False)

    # date=db.Column(db.Date(), nullable=False)
    # time=db.Column(db.Time(), nullable=False)
    
class Show(db.Model):
    __tablename__='show'
    def __init__(self, name, duration, rating, tags, seat_available,price, dateTime=None):
        self.name = name
        self.duration = duration
        self.rating = rating
        self.tags = tags
        self.price = price
        self.seat_available = seat_available
        if dateTime is not None:
            self.dateTime = dateTime

    def to_order(self):
        show_time_start = self.dateTime.strftime('%d %b. %Y %I:%M%p')
        
        if self.duration:
            end_time = self.dateTime + datetime.timedelta(hours=self.duration.hour, minutes=self.duration.minute)
            show_time_end = end_time.strftime('%I:%M%p')
        else:
            show_time_end = ''
        
        return {
            'show_name': self.name,
            'show_time': f"{show_time_start} to {show_time_end}" if self.dateTime else None
        }
        # return {
        #     'name': self.name,
        #     'time_duration': self.duration.isoformat() if self.duration else None,
        #     'dateTime': self.dateTime.isoformat() if self.dateTime else None
        # }
        
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'duration': self.duration.isoformat() if self.duration else None,
            'rating': self.rating,
            'tags': self.tags,
            'price': self.price,
            'seat_available': self.seat_available,
            'dateTime': self.dateTime.isoformat() if self.dateTime else None
        }
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(150), unique=True)
    duration=db.Column(db.Time)  #db.Time
    rating=db.Column(db.Float)
    tags=db.Column(db.Text)
    price=db.Column(db.Integer, default=100)
    seat_available= db.Column(db.Integer, nullable=False)
    dateTime=db.Column(db.DateTime)
    ordervenue = db.relationship('Order', backref='order_show',lazy=True)    
    
class Order(db.Model):
    __tablename__='order'
    def __init__(self, show_id, user_id,venue_id, seats, rated, created):
        self.show_id = show_id
        self.user_id = user_id
        self.venue_id = venue_id
        self.seats = seats
        self.rated = rated
        self.created = created
        
    def to_dict(self):
        return {
            'id': self.id,
            'show_id': self.show_id,
            'user_id': self.user_id,
            'venue_id': self.venue_id,
            'seats': self.seats,
            'rated': self.rated, 
            'created': self.created, 
        }
    def to_order(self):
        return {
            'id': self.id,
            'seats': self.seats,
            'rated': self.rated, 
        }
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    show_id=db.Column(db.Integer, db.ForeignKey('show.id'), nullable=False)
    venue_id=db.Column(db.Integer, db.ForeignKey('theatre.id'), nullable=False)
    user_id=db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rated=db.Column(db.Integer,default=0, nullable=False)
    seats=db.Column(db.Integer, nullable=False)
    created=db.Column(db.DateTime, nullable = False)
 