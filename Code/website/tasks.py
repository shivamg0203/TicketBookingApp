import csv
from datetime import datetime, time
from email import encoders
from email.mime.application import MIMEApplication
from email.mime.base import MIMEBase
import json
from datetime import timedelta
import os
from jinja2 import Template
from .workers import celery
from .models import Theatre, Show , TheatreShow, Order
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from celery.schedules import crontab
import smtplib
from . import get_app
from .models import Order, Show, User
from weasyprint import HTML
from .import get_cache
SMTP_SERVER_HOST = "localhost"
SMTP_SERVER_PORT = 1025
SENDER_ADDRESS = "adminsender@gmail.com"
SENDER_PASSWORD = "SecretAdmin@222"


@celery.on_after_finalize.connect
def user_report_jobs(sender,**kwargs):
    sender.add_periodic_task(crontab(minute=59,hour=23, day_of_month='L'),entertainment_report.s(),name='Monthly-report')
    # sender.add_periodic_task(crontab(minute=35,hour=11, day_of_week='*'),entertainment_report.s(),name='Monthly-report')
    # sender.add_periodic_task(crontab('*','*'),entertainment_report.s(),name='Monthly-report')
    # sender.add_periodic_task(crontab(),entertainment_report.s(),name='Monthly-report')
    
@celery.on_after_finalize.connect
def user_remainder_jobs(sender,**kwargs):
    sender.add_periodic_task(crontab(minute='*',hour=18, day_of_week='*'),daily_report.s(),name='Daily-report')
    # sender.add_periodic_task(crontab(minute='*',hour='*', day_of_week='*'),daily_report.s(),name='Daily-report')
    # sender.add_periodic_task(crontab("*","*", ),daily_report.s(),name='Daily-report')    #For testing
    # sender.add_periodic_task(crontab(),daily_report.s(),name='Daily-report')    #For testing
    

@celery.task()
def admin_csv_task():
    export_list=[]
    app = get_app()
    with app.app_context():    
        allvenue=Theatre.query.all()
        print(allvenue)
        for v in allvenue:
            print(v)
            print("calculating")
            shows=TheatreShow.query.filter_by(theatre_id=v.id).all()
            print(shows)
            total_show = len(shows)
            print(total_show)
            orders = Order.query.filter_by(venue_id=v.id).all()
            print(total_show)
            if not orders:
                rated=0 # Default value if no orders
                total_bookings=0
            else:        
                total_bookings=Order.query.filter_by(venue_id=v.id).count()
                total_rating = sum(order.rated for order in orders)
                rated = total_rating / len(orders)
            
            venue_data = {
                'id': v.id,
                'name': v.name,
                'city': v.city,
                'place': v.place,
                'capacity': v.capacity,
                'no_of_show':total_show,
                'no_of_booking':total_bookings,
                'rated':rated
                # Add other fields as needed
            }  
            export_list.append(venue_data)
        return export_list  



@celery.task
def daily_report():
    app = get_app()
    with app.app_context():
        start_time = time(0, 0)  # 12:00 AM
        end_time = time(17, 0) 
        starting = datetime.combine(datetime.today(), start_time).strftime('%Y-%m-%d %H:%M:%S.%f')
        ending = datetime.combine(datetime.today(), end_time).strftime('%Y-%m-%d %H:%M:%S.%f')
        all_user = User.query.filter_by(role_id = 2).all()
        all_order = Order.query.filter(Order.created>=starting, Order.created<=ending).all()
        c=False
        for u in all_user:
            c=False
            for s in all_order:
                if u.id == s.user_id:
                    c=True
                    # print("true")
            if c==False:
                print(u.username)
                send_alert(u.email)
        return True        
            


@celery.task
def send_alert(r):
    subject = "Reminder: Visit or Book Something Today!"
    message = "Dear User, we noticed you haven't visited or booked anything today. Please consider exploring our offerings."
    msg=MIMEMultipart()
    msg["From"] = SENDER_ADDRESS
    msg["To"] = r
    msg["Subject"] = subject
    msg.attach(MIMEText(message, "html"))
    s = smtplib.SMTP(host=SMTP_SERVER_HOST, port= SMTP_SERVER_PORT)
    s.login(SENDER_ADDRESS, SENDER_PASSWORD)
    s.send_message(msg)
    s.quit()
    return True   
    
    

@celery.task
def entertainment_report():
    app = get_app()
    with app.app_context():  
        now = datetime.now()
        previous_month = (now.replace(day=1) - timedelta(days=1)).replace(day=1)
        first_day_of_previous_month = previous_month.replace(day=1)
        last_day_of_previous_month = datetime.now() - timedelta(days=now.date().day)  # This job will be done on first day of every month
        orders_in_last_month = Order.query.filter(
        Order.created >= first_day_of_previous_month,
        Order.created <= last_day_of_previous_month
        ).all()
        print(first_day_of_previous_month, last_day_of_previous_month)
        print(orders_in_last_month)
        all_users = User.query.filter_by(role_id = 2).all()
        for l in all_users:
            req_email=l.email
            userdata=[]
            for order in orders_in_last_month:
                dict={}
                if order.user_id == l.id:
                    showObj=Show.query.get(order.show_id)
                    showName=showObj.name 
                    showPrice=showObj.price
                    noOfSeat=order.seats
                    rating = order.rated
                    revenue = noOfSeat*showPrice
                    dict={'show_name':showName,'rating':rating, 'paid':revenue}
                    userdata.append(dict)
                    # print(userdata)
            send_monthly_report(userdata, req_email)        
                
@celery.task
def send_monthly_report(data, req_email):
    print('in monthly task')
    print(data)
    # data = [{'show_name':'Show1','rating':5, 'paid':5000},{'show_name':'Show2','rating':6, 'paid':6000},{'show_name':"Show",'rating':7, 'paid':7000}]     #Assuming example value of data for demo
    message = format_report(template_file= "website/templates/report.html", data=data)
    html = HTML(string=message)
    print(message, html)

    file_name = "monthly-report.pdf"
    html.write_pdf(target=file_name)
    msg =MIMEMultipart()
    msg["From"] = SENDER_ADDRESS
    msg["To"] = req_email
    msg["Subject"] = "Monthly Report"
    pdf_filename = 'monthly-report.pdf'
    pdf_attachment = open("monthly-report.pdf", 'rb')
    # pdf_attachment = open("website/templates/report.html", 'rb')
    attachment = MIMEBase('application', 'pdf')
    attachment.set_payload(pdf_attachment.read())
    encoders.encode_base64(attachment)
    attachment.add_header('Content-Disposition', f'attachment; filename= {pdf_filename}')
    msg.attach(attachment)    
    msg.attach(MIMEText(message, "html"))
    
    
    s= smtplib.SMTP(host=SMTP_SERVER_HOST, port=SMTP_SERVER_PORT)
    s.login(SENDER_ADDRESS, SENDER_PASSWORD)
    s.send_message(msg)
    s.quit()
    return True

@celery.task 
def format_report(template_file, data):
    print(data)
    with open(template_file) as file:
        template = Template(file.read())
        return template.render(data=data)  
             
        
 
@celery.task
def send_email(to_address, subject, message):
    message_dict = message
    print("sending emails")
    headers = message_dict.keys()
    # print(headers)
    csv_rows = ([
        str(message_dict['id']),
        str(message_dict['name']),
        str(message_dict['city']),
        str(message_dict['place']),
        str(message_dict['capacity']),
        str(message_dict['no_of_show']),
        str(message_dict['no_of_booking']),
        str(message_dict['rated'])
    ])            
    
    csv_filename = 'theatredata.csv'
    msg =MIMEMultipart()
    msg["From"] = SENDER_ADDRESS
    msg["To"] = 'adminreceiver@gmail.com'
    msg["Subject"] = "CSV DATA"
    
    with open("theatredata.csv", "w") as csv_file:
        fobj = csv.writer(csv_file)
        fobj.writerow(headers)  # Write the header
        fobj.writerow(csv_rows)  # Wr

    with open(csv_filename, 'rb') as csv_file:
        csv_part = MIMEApplication(csv_file.read(), Name=csv_filename)
        csv_part['Content-Disposition'] = f'attachment; filename="{csv_filename}"'
        msg.attach(csv_part)

    msg.attach(MIMEText(json.dumps(message_dict, indent=4), "plain"))
    # msg.attach(MIMEText(message, "html"))
    
    s= smtplib.SMTP(host=SMTP_SERVER_HOST, port=SMTP_SERVER_PORT)
    s.login(SENDER_ADDRESS, SENDER_PASSWORD)
    s.send_message(msg)
    s.quit()
    return True


