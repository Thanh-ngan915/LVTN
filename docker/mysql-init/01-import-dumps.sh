#!/bin/bash
echo "Starting database dump import..."

echo "Importing usersdb..."
mysql -u root -p"$MYSQL_ROOT_PASSWORD" usersdb < /docker-entrypoint-initdb.d/dumps/usersdb_1307.sql

echo "Importing storesdb..."
mysql -u root -p"$MYSQL_ROOT_PASSWORD" storesdb < /docker-entrypoint-initdb.d/dumps/storesdb_1307.sql

echo "Importing ordersdb..."
mysql -u root -p"$MYSQL_ROOT_PASSWORD" ordersdb < /docker-entrypoint-initdb.d/dumps/ordersdb_1307.sql

echo "Importing livestreamdb..."
mysql -u root -p"$MYSQL_ROOT_PASSWORD" livestreamdb < /docker-entrypoint-initdb.d/dumps/livestreamdb_1307.sql

echo "Importing chatbot_db..."
mysql -u root -p"$MYSQL_ROOT_PASSWORD" chatbot_db < /docker-entrypoint-initdb.d/dumps/chatbot_db_1307.sql

echo "Importing productdb..."
mysql -u root -p"$MYSQL_ROOT_PASSWORD" productdb < /docker-entrypoint-initdb.d/dumps/productdb.sql

echo "All database dumps imported successfully!"
