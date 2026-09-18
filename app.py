import os
from datetime import datetime
from flask import Flask, render_template, request, flash, redirect, url_for
from flask_mail import Mail, Message
from forms import EnquiryForm

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-change-in-production')

# Flask-Mail config (read from environment)
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'true').lower() == 'true'
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_USERNAME')

mail = Mail(app)

BUSINESS_EMAIL = "shyamlal9947@gmail.com"


@app.route('/')
@app.route('/home')
def index():
    form = EnquiryForm()
    return render_template('index.html', form=form, current_year=datetime.now().year)


@app.route('/about')
@app.route('/about-us')
def about():
    return redirect(url_for('index') + '#about')


@app.route('/service')
@app.route('/services')
def services():
    return redirect(url_for('index') + '#services')


@app.route('/contact')
@app.route('/contact-us')
def contact():
    return redirect(url_for('index') + '#contact')


@app.route('/enquiry', methods=['POST'])
@app.route('/enquire', methods=['POST'])
def enquiry():
    form = EnquiryForm()
    if form.validate_on_submit():
        msg = Message(
            subject=f"New Enquiry from {form.name.data} — Power View Website",
            recipients=[BUSINESS_EMAIL],
            body=(
                f"Name: {form.name.data}\n"
                f"Phone: {form.phone.data}\n"
                f"Email: {form.email.data or 'Not provided'}\n"
                f"Service: {form.service.data}\n"
                f"Message: {form.message.data or 'No message provided'}\n"
                f"\n---\nSent from Power View website contact form."
            )
        )
        try:
            mail.send(msg)
            flash('Thanks! Your enquiry has been sent — we will contact you shortly.', 'success')
        except Exception as e:
            app.logger.error(f"Mail send failed: {e}")
            flash('Something went wrong sending your enquiry. Please call us directly on 9947 367 322.', 'error')
        return redirect(url_for('index') + '#contact')

    flash('Please check the highlighted fields and try again.', 'error')
    return render_template('index.html', form=form, current_year=datetime.now().year), 400


@app.route('/sitemap.xml')
def sitemap():
    from flask import Response
    with open(os.path.join(app.static_folder, 'sitemap.xml')) as f:
        xml = f.read()
    return Response(xml, mimetype='application/xml')


@app.route('/robots.txt')
def robots():
    from flask import Response
    with open(os.path.join(app.static_folder, 'robots.txt')) as f:
        txt = f.read()
    return Response(txt, mimetype='text/plain')


if __name__ == '__main__':
    app.run(debug=True)
