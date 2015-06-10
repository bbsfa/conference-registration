from datetime import datetime
from app import app, db
class Signup(db.Model):

  __tablename__ = 'signup'

  id = db.Column(db.Integer, primary_key=True)
  first_name = db.Column(db.String(64))
  last_name = db.Column(db.String(64))
  address = db.Column(db.String(64))
  address2 = db.Column(db.String(64))
  city = db.Column(db.String(64))
  state = db.Column(db.String(64))
  zip = db.Column(db.String(64))
  email = db.Column(db.String(64))
  phone = db.Column(db.String(64))
  shirt_size = db.Column(db.String(3))
  bbs_relationship = db.Column(db.String(16))
  bbs_gene = db.Column(db.String(5))
  bbs_birth_year = db.Column(db.String(4))
  bbs_cribbs = db.Column(db.String(16))
  ticket_type = db.Column(db.String(16))
  ticket_cost = db.Column(db.Numeric)
  attendee_of = db.Column(db.Integer)
  registration_amount = db.Column(db.Numeric)
  donation_amount = db.Column(db.Numeric)
  total_amount = db.Column(db.Numeric)
  payment_method = db.Column(db.String(6))
  payment_status = db.Column(db.String(16))
  created_at = db.Column(db.DateTime)


class TShirt(db.Model):

  __tablename__ = 'tshirt'

  id = db.Column(db.Integer, primary_key=True)
  signup_id = db.Column(db.Integer)
  size = db.Column(db.String(3))
  quantity = db.Column(db.Integer)
