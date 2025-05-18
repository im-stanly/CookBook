#!/bin/sh

echo "Waiting for Liquibase to finish migrations..."


until PGPASSWORD=$POSTGRESDB_ROOT_PASSWORD psql -h postgresdb -U $POSTGRESDB_USER -d $POSTGRESDB_DATABASE -c "SELECT 1 FROM RECIPES LIMIT 1;" >/dev/null 2>&1; do
  echo "Still waiting for DB schema..."
  sleep 5
done

echo "DB is ready. Proceeding to populate it..."
