FROM mysql:8.0

# Copy initialization scripts
# Scripts in /docker-entrypoint-initdb.d/ are executed alphabetically
COPY mysql-init /docker-entrypoint-initdb.d/
