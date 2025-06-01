import psycopg2
import csv
import re
import os

# Replace unicode fractions with text equivalents
unicode_fraction_map = {
    '¼': '1/4', '½': '1/2', '¾': '3/4', '⅐': '1/7', '⅑': '1/9', '⅒': '1/10',
    '⅓': '1/3', '⅔': '2/3', '⅕': '1/5', '⅖': '2/5', '⅗': '3/5', '⅘': '4/5',
    '⅙': '1/6', '⅚': '5/6', '⅛': '1/8', '⅜': '3/8', '⅝': '5/8', '⅞': '7/8'
}

def replace_unicode_fractions(text):
    for uni, frac in unicode_fraction_map.items():
        text = text.replace(uni, frac)
    return text

# Connect to DB
try:
    conn = psycopg2.connect(
        dbname=os.getenv("POSTGRESDB_DATABASE", "cookBookDB"),
        user=os.getenv("POSTGRESDB_USER", "cookBook"),
        password=os.getenv("POSTGRESDB_ROOT_PASSWORD", "1234"),
        host=os.getenv("POSTGRESDB_HOST", "postgresdb"),
        port=os.getenv("POSTGRESDB_DOCKER_PORT", "5432")
    )
    conn.autocommit = False
except Exception as e:
    raise SystemExit(f"Database connection failed: {e}")

cur = conn.cursor()

# Step 1: Parse combined_output.txt into a dictionary
parsed_ingredient_map = {}  # original_line -> (ingredient, unit, start, end)
valid_ingredients = set()
valid_units = set()

with open('combined_output.txt', 'r', encoding='utf-8') as f:
    for line in f:
        line = replace_unicode_fractions(line.strip())
        if not line or '#' not in line:
            continue
        parts = line.split('#')
        if len(parts) != 5:
            continue
        original, ingr, unit, start_str, end_str = parts
        ingr = ingr.strip().lower()
        unit = unit.strip().lower()
        original = original.strip().lower()

        if ingr in {'none', 'invalid', 'empty',''} or unit in {'invalid', 'empty',''}:
            continue
        try:
            start = float(start_str)
            end = float(end_str)
        except ValueError:
            continue

        parsed_ingredient_map[original] = (ingr, unit, start, end)
        valid_ingredients.add(ingr)
        valid_units.add(unit)

# Step 2: Insert valid ingredients and units
for ingr in valid_ingredients:
    cur.execute(
        "INSERT INTO INGREDIENTS (NAME, APPROXIMATE_CALORIES_PER_100_GRAM) VALUES (%s, %s) ON CONFLICT DO NOTHING;",
        (ingr, 10)
    )

for unit in valid_units:
    cur.execute(
        "INSERT INTO MEASUREMENT_UNITS (NAME) VALUES (%s) ON CONFLICT DO NOTHING;",
        (unit,)
    )

# Step 3: Process CSV and match ingredients strictly by original string
with open('13k-recipes.csv', 'r', encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile)
    headers = next(reader, None)

    for row in reader:
        if len(row) < 4:
            continue

        recipe_name = row[1].strip()
        raw_ingredients = replace_unicode_fractions(row[2]).strip("[]")
        instructions = row[3].strip()
        description = f"Ingredients: {raw_ingredients} Description: {instructions}"

        # Split ingredient lines
        ingredient_lines = [i.strip().strip("'").lower() for i in raw_ingredients.split(',') if i.strip()]

        # Match all ingredient lines
        recipe_ings = []
        for line in ingredient_lines:
            if line in parsed_ingredient_map:
                recipe_ings.append((line, *parsed_ingredient_map[line]))
            else:
                recipe_ings = []
                break

        if not recipe_ings:
            continue  # skip recipe if any ingredient not matched

        try:
            cur.execute("INSERT INTO RECIPES (NAME, DESCRIPTION) VALUES (%s, %s) RETURNING ID;", (recipe_name, description))
            recipe_id = cur.fetchone()[0]
        except Exception as e:
            conn.rollback()
            raise SystemExit(f"Failed to insert recipe '{recipe_name}': {e}")

        inserted_ingredients = set()
        for _, ingr, unit, start, end in recipe_ings:
            if ingr in inserted_ingredients:
                continue
            inserted_ingredients.add(ingr)
            try:
                cur.execute(
                    """
                    INSERT INTO INGREDIENTS_IN_RECIPES (RECIPE_ID, INGREDIENT_ID, MEASUREMENT_UNIT_ID, AMOUNT_RANGE_START, AMOUNT_RANGE_END)
                    SELECT %s, i.ID, u.ID, %s, %s FROM INGREDIENTS i, MEASUREMENT_UNITS u
                    WHERE i.NAME = %s AND u.NAME = %s;
                    """,
                    (recipe_id, start, end, ingr, unit)
                )
            except Exception as e:
                conn.rollback()
                raise SystemExit(f"Failed to link '{ingr}' to recipe '{recipe_name}': {e}")

# Step 4: Insert measurement unit conversions
with open('mu_conversions_valid.txt', 'r', encoding='utf-8') as f:
    for line in f:
        parts = line.strip().split()
        if len(parts) != 3:
            continue
        mu_from, mu_to, conv_val = parts
        try:
            conv_val = float(conv_val)
        except ValueError:
            continue
        try:
            cur.execute(
                """
                INSERT INTO MU_CONVERSIONS (MU_FROM_ID, MU_TO_ID, CONVERSION_PER_ONE_UNIT)
                SELECT from_u.ID, to_u.ID, %s
                FROM MEASUREMENT_UNITS from_u, MEASUREMENT_UNITS to_u
                WHERE from_u.NAME = %s AND to_u.NAME = %s
                ON CONFLICT DO NOTHING;
                """,
                (conv_val, mu_from, mu_to)
            )
        except Exception as e:
            conn.rollback()
            raise SystemExit(f"Failed to insert MU_CONVERSION {mu_from} -> {mu_to}: {e}")

conn.commit()
print("Database population completed successfully.")
cur.close()
conn.close()
