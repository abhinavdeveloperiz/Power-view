from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField
from wtforms.validators import DataRequired, Length, Optional, Email, Regexp

SERVICE_CHOICES = [
    ('', 'Select a service…'),
    ('cctv', 'CCTV & Surveillance'),
    ('solar', 'Solar Solutions'),
    ('inverter', 'Online UPS & Inverters'),
    ('battery', 'Tubular Battery'),
    ('water_heater', 'Solar Water Heater'),
    ('gate', 'Remote Control Gates / Video Door Phone'),
    ('other', 'Other / General Enquiry'),
]


class EnquiryForm(FlaskForm):
    name = StringField('Your Name', validators=[
        DataRequired(message="Name is required."),
        Length(min=2, max=100, message="Name must be between 2 and 100 characters.")
    ])
    phone = StringField('Phone Number', validators=[
        DataRequired(message="Phone number is required."),
        Regexp(r'^[6-9]\d{9}$', message="Enter a valid 10-digit Indian mobile number.")
    ])
    email = StringField('Email Address', validators=[
        Optional(),
        Email(message="Enter a valid email address.")
    ])
    service = SelectField('Service Interested In', choices=SERVICE_CHOICES, validators=[
        DataRequired(message="Please select a service.")
    ])
    message = TextAreaField('Message', validators=[
        Optional(),
        Length(max=1000, message="Message cannot exceed 1000 characters.")
    ])
