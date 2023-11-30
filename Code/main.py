from website import create_app, models

app,api, celery, cache = create_app()

# create_app()
if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000) 
