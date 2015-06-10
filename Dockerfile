FROM ubuntu:14.04
MAINTAINER BBSFA

RUN apt-get -y update --fix-missing
RUN apt-get -y install \
    build-essential \
    libmysqlclient-dev \
    python \
    python-dev \
    python-distribute \
    python-pip \
    nginx \
    supervisor

RUN pip install Flask==0.10.1
RUN pip install Flask-Mail==0.9.0
RUN pip install Flask-SQLAlchemy==1.0
RUN pip install Jinja2==2.7.3
RUN pip install MarkupSafe==0.23
RUN pip install SQLAlchemy==1.0.4
RUN pip install Werkzeug==0.10.4
RUN pip install itsdangerous==0.24
RUN pip install wsgiref==0.1.2
RUN pip install nameparser==0.2.10
RUN pip install MySQL-python==1.2.5
RUN pip install mailchimp==2.0.9

ADD . /opt/app

EXPOSE 9000 80 443
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
