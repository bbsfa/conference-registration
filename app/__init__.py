from flask import Flask
from flask import request, render_template, url_for
from flask.json import jsonify
from flask.ext.mail import Mail
from flask.ext.sqlalchemy import SQLAlchemy

class CustomFlask(Flask):
  jinja_options = Flask.jinja_options.copy()
  jinja_options.update(dict(
      block_start_string='<%',
      block_end_string='%>',
      variable_start_string='%%',
      variable_end_string='%%',
      comment_start_string='<#',
      comment_end_string='#>',
  ))

app = CustomFlask(__name__)
app.config.from_object('app.config.DefaultConfig')
db = SQLAlchemy(app)

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/api/ipn', methods=['POST'])
def ipn():
    pass

@app.route('/api/signup', methods=['POST'])
def signup():
    from app.models import Signup
    from nameparser import HumanName
    from datetime import datetime
    import urllib
    
    ticket_types = {
      'adult': 40,
      'child': 20
    }

    name = HumanName(request.json['name'])
    bbs  = request.json.get('bbs', {})

    # Insert the parent record.
    signup = Signup(
        first_name=name.first,
        last_name=name.last,
        address=request.json.get('address'),
        address2=request.json.get('address2'),
        city=request.json.get('city'),
        state=request.json.get('city'),
        zip=request.json.get('zip'),
        email=request.json.get('email'),
        phone=request.json.get('phone'),
        shirt_size=request.json.get('shirt_size'),
        bbs_relationship=bbs.get('relationship'),
        bbs_gene=bbs.get('gene'),
        bbs_birth_year=bbs.get('birth_year'),
        bbs_cribbs=bbs.get('cribbs'),
        ticket_type='adult',
        donation_amount=request.json.get('donation_amount', 0) or 0,
        payment_method=request.json.get('payment_method'),
        payment_status='',
        created_at=datetime.utcnow()
    )

    signup.ticket_cost = ticket_types[signup.ticket_type]
    signup.registration_amount = 0
    signup.total_amount = 0         

    db.session.add(signup)
    db.session.flush()
    
    attendee_cost = 0
    for attendee in request.json.get('attendees'):
        name = HumanName(attendee['name'])
        a = Signup(
          first_name=name.first,
          last_name=name.last,
          ticket_type=attendee.get('ticket_type', 'adult'),
          created_at=signup.created_at
        )
        a.attendee_of = signup.id
        a.ticket_cost = ticket_types[a.ticket_type]
        attendee_cost += a.ticket_cost

        db.session.add(a)
        db.session.flush()

    signup.registration_amount = signup.ticket_cost + attendee_cost
    signup.total_amount = signup.registration_amount + signup.donation_amount
    db.session.commit()


    # Build the PayPal link
    # https://developer.paypal.com/webapps/developer/docs/classic/paypal-payments-standard/integration-guide/Appx_websitestandard_htmlvariables/#id08A6HF00TZS
    url    = 'https://www.paypal.com/cgi-bin/webscr'
    notify_url = 'http://' + request.host + url_for('ipn')
    params = {
        'first_name': signup.first_name,
        'last_name': signup.last_name,
        'email': signup.email,
        'business': 'payments@bardetbiedl.org',
        'cmd': '_xclick',
        'item_number': signup.id,
        'item_name': 'BBSFA Connect 2015',
        'amount': signup.registration_amount,
        'notify_url': notify_url
    }

    paypal_url= url + '?' + urllib.urlencode(params)
    return jsonify(id=signup.id, paypal_url=paypal_url)
