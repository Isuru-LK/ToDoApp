FROM postgres:15
COPY init.sql /docker-entrypoint-initdb.d/
ENV POSTGRES_DB=todo
ENV POSTGRES_USER=user
ENV POSTGRES_PASSWORD=password