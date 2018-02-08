FROM postgres

ENV POSTGRES_DB sst

EXPOSE 5432

COPY *.sql /docker-entrypoint-initdb.d/
