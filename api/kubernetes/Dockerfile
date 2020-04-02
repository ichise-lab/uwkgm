FROM python:3

ARG version
ARG env
ARG ext_host
ARG django_secret
ARG mysql_username
ARG mysql_password
ARG mongo_username
ARG mongo_password

EXPOSE 80

ENV PYTHONPATH=/dorest
ENV UWKGM_ENV=${env}
ENV UWKGM_API_VERSION=${version}
ENV UWKGM_EXT_HOST=${ext_host}
ENV UWKGM_DJANGO_SECRET_KEY=${django_secret}
ENV UWKGM_MYSQL_USERNAME=${mysql_username}
ENV UWKGM_MYSQL_PASSWORD=${mysql_password}
ENV UWKGM_MONGO_USERNAME=${mongo_username}
ENV UWKGM_MONGO_PASSWORD=${mongo_password}

COPY dorest /dorest
COPY uwkgm /uwkgm
COPY requirements.txt /requirements.txt

RUN apt-get update
RUN apt-get install libffi-dev libssl-dev libxml2-dev libxslt1-dev
RUN pip install -r requirements.txt

WORKDIR /uwkgm

CMD UWKGM_STATE=migrating python manage.py makemigrations accounts && UWKGM_STATE=migrating python manage.py migrate && UWKGM_STATE=running python manage.py runserver 0.0.0.0:80
