class DefaultConfig(object):
  DEBUG = True
  HOST  = '0.0.0.0'
  PORT  = 9000

  # SQLAlchemy
  SQLALCHEMY_DATABASE_URI = 'mysql://root:root@mysql/conference'
  SQLALCHEMY_ECHO = True
