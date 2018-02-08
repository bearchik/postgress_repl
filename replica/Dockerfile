FROM postgres

ENV POSTGRES_DB sst

EXPOSE 5432

RUN set -x \
	&& apt-get update && apt-get install -y git

RUN mkdir /home/backup
RUN mkdir /root/.ssh

COPY ./start.sh /start.sh
COPY ./backup_sql /etc/cron.hourly/backup_sql
COPY ./init.sh /tmp/init.sh
COPY ./id_rsa /root/.ssh/id_rsa 
COPY *.sql /docker-entrypoint-initdb.d/


RUN chmod 600 /root/.ssh/id_rsa
RUN chmod 775 /etc/cron.hourly/backup_sql /tmp/init.sh /start.sh

RUN /tmp/init.sh

CMD ["/start.sh"]
