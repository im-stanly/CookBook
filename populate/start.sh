#!/bin/sh
set -e
echo "Running wait_for_liquibase.sh..."
./wait_for_liquibase.sh
echo "Running pupulate_db.py..."
python pupulate_db.py