from datetime import timedelta
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from os import path
import asyncio
from . import workers
from flask_bcrypt import Bcrypt
from flask_cors import CORS
# from flask_login import LoginManager
from flask_jwt_extended import (JWTManager, jwt_required, create_access_token,get_jwt_identity, get_jwt)
from flask_security import Security, SQLAlchemyUserDatastore, auth_required
db = SQLAlchemy()
from .models import User, Role
from flask_caching import Cache
# from . import celery_config
DB_NAME = "database.db"
    
class Config:
    DEBUG = True
    SECRET_KEY = 'your-secret-key'
    CACHE_TYPE = 'RedisCache' 
    CACHE_REDIS_HOST = 'localhost'
    CACHE_REDIS_PORT = 6379
    JWT_SECRET_KEY = "super-secret"
    SECRET_KEY = 'hjshjhdjah kjshkjdhjs'
    JWT_SECRET_KEY = 'your_secret_key'
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{DB_NAME}' 
    
    
def create_app():
    celery= None
    app = Flask(__name__)
    from .api import apiBlueprint
    app.config.from_object(Config)
    # from flask_restful import Api
    # realapi = Api(apiBlueprint)
    # app.config['CACHE_TYPE'] = 'RedisCache' 
    # app.config['CACHE_REDIS_HOST'] = 'localhost'
    # app.config['CACHE_REDIS_PORT'] = 6379
    # app.config["JWT_SECRET_KEY"] = "super-secret"
    # app.config['SECRET_KEY'] = 'hjshjhdjah kjshkjdhjs'
    # app.config['JWT_SECRET_KEY'] = 'your_secret_key'
    # app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}' 
    db.init_app(app)  # initialize the app with the extension. It stores database into instance folder.
    app.app_context().push()
    jwt = JWTManager(app)  
    apis = Api(app)
    app.app_context().push()  
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
    from .views import views
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(apiBlueprint, url_prefix='/api')
    CORS(app, resources={r"/*":{'origins':"*"}})
    app.app_context().push()  
    create_database(app)
    from .models import User, Role
    celery=workers.celery
    celery.conf.update(
        brocker_url = 'redis://localhost:6379/1',
        backend="redis://localhost:6379/2"
    )
    celery.Task = workers.ContextTasks
    app.app_context().push()
    cache = Cache(app)
    app.app_context().push()
    return app,apis, celery, cache



def get_app():
    return create_app()[0]

def get_api():
    return create_app()[1]

def get_celery():
    return create_app()[2]

def get_cache():
    return create_app()[3]
# app, api , celery, cache = create_app()

def create_database(app):
    if not path.exists('instance/' + DB_NAME):
        with app.app_context():
            db.create_all()
            roles_admin = Role(id=1,name='Admin', description='This role belongs to the administrator of the applicaion')
            roles_user = Role(id=2, name='User', description='This role belongs to the user of the applicaion')
            admin = User(username='Admin', role_id=1,email='adminemail@gmail.com', password='SecretAdmin@222')
            db.session.add_all([admin,roles_admin,roles_user])
            db.session.commit()
            db.session.close()
        print('Created Database!')

