FROM python:3.11-slim

# Install PostgreSQL client and system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app

# Copy files
COPY pupulate_db.py .
COPY 13k-recipes.csv .
COPY valid_ingredients_map.txt .
COPY combined_output.txt .
COPY wait_for_liquibase.sh .

# Install Python dependencies
RUN pip install psycopg2-binary

# Make wait script executable
RUN chmod +x wait_for_liquibase.sh

# Set entrypoint: wait until Liquibase finishes, then run the script
ENTRYPOINT ["sh", "-c", "./wait_for_liquibase.sh && python pupulate_db.py"]
