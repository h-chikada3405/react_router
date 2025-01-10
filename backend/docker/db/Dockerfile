FROM postgres:16

RUN apt-get update && \
  apt-get install -y git make gcc postgresql-server-dev-16

RUN cd /tmp && \
  git clone --branch v0.7.4 https://github.com/pgvector/pgvector.git && \
  cd pgvector && \
  make && \
  make install && \
  cd .. && rm -rf pgvector

RUN echo "CREATE EXTENSION vector;" > /docker-entrypoint-initdb.d/init-vector.sql
