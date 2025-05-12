import psycopg2
import csv
import re
import os
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


unit_map = {}
with open('valid_ingredients_map.txt', 'r', encoding='utf-8') as map_file:
    for line in map_file:
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        if '#' in line:
            raw_unit, norm_unit = line.split('#', 1)
            raw_unit = raw_unit.strip()
            norm_unit = norm_unit.strip()
            unit_map[raw_unit] = norm_unit

recipes = []
with open('13k-recipes.csv', 'r', encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile)
    headers = next(reader, None)
    for idx, row in enumerate(reader):
        if not row or len(row) < 2:
            continue
        recipe_name = row[1].strip()
        if recipe_name == "" or recipe_name is None:
            recipe_name = f"Recipe {idx}"
        description = ""

        ingredients_text = row[2].strip() if len(row) > 2 else ""
        instructions_text = row[3].strip() if len(row) > 3 else ""
        description = f"Ingredients: {ingredients_text} Description: {instructions_text}"
        try:
            cur.execute(
                "INSERT INTO RECIPES (NAME, DESCRIPTION) VALUES (%s, %s) ON CONFLICT DO NOTHING;",
                (recipe_name, description)
            )
        except Exception as e:
            conn.rollback()
            raise SystemExit(f"Failed to insert recipe '{recipe_name}': {e}")

        recipes.append(recipe_name)


conn.commit()
ingredient_inserted = set()
unit_inserted = set()
valid_entries = []
recipe_item_counts = []
with open('13k-recipes.csv', 'r', encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile)
    next(reader, None)  # skip header
    for row in reader:
        if not row or len(row) < 3:
            recipe_item_counts.append(0)
            continue
        ingredients_list_str = row[2]
        if ingredients_list_str.startswith("['") and ingredients_list_str.endswith("']"):
            inner = ingredients_list_str[2:-2]
        else:
            inner = ingredients_list_str.strip()
            if inner.startswith('[') and inner.endswith(']'):
                inner = inner[1:-1]
            inner = inner.strip("'\"")
        if inner == "":
            recipe_item_counts.append(0)
        else:
            items = inner.split("', '")
            recipe_item_counts.append(len(items))


current_recipe = 0
items_remaining = recipe_item_counts[0] if recipe_item_counts else 0

with open('combined_output.txt', 'r', encoding='utf-8') as comb_file:
    for raw_line in comb_file:
        line = raw_line.strip('\n')
        if current_recipe >= len(recipe_item_counts):
            break
        if items_remaining <= 0:
            text = line.lstrip(' "*\t')
            if text == "":
                continue
            if re.match(r'^[0-9¼½¾⅓⅔]', text):
                current_recipe += 1
                if current_recipe >= len(recipe_item_counts):
                    break
                items_remaining = recipe_item_counts[current_recipe]
            if current_recipe >= len(recipe_item_counts):
                break
            if items_remaining <= 0:
                continue
        if items_remaining <= 0:
            if items_remaining <= 0:
                continue

        items_remaining -= 1
        parts = line.split('#')
        if len(parts) != 5:
            continue
        _, ingredient_raw, unit_raw, range_start_str, range_end_str = parts
        ingredient_raw = ingredient_raw.strip()
        unit_raw = unit_raw.strip()
        if ingredient_raw.lower() == 'none' or ingredient_raw == "" or unit_raw.lower() in ('none', 'empty', ''):
            continue

        unit_norm = unit_map.get(unit_raw, None)
        if unit_norm is None:
            continue
        if unit_norm.lower() == 'invalid':
            continue

        ingredient_norm = ingredient_raw.strip()
        if ingredient_norm == "" or ingredient_norm.lower() == 'none':
            continue

        try:
            range_start = float(range_start_str)
            range_end = float(range_end_str)
        except:
            continue

        if range_start <= 0 and range_end <= 0:
            continue

        recipe_id = current_recipe + 1
        valid_entries.append((recipe_id, ingredient_norm, unit_norm, range_start, range_end))
        if ingredient_norm not in ingredient_inserted:
            try:
                cur.execute(
                    "INSERT INTO INGREDIENTS (NAME, APPROXIMATE_CALORIES_PER_100_GRAM) VALUES (%s, %s) ON CONFLICT DO NOTHING;",
                    (ingredient_norm, 10)
                )
            except Exception as e:
                conn.rollback()
                raise SystemExit(f"Failed to insert ingredient '{ingredient_norm}': {e}")
            ingredient_inserted.add(ingredient_norm)

        if unit_norm not in unit_inserted:
            try:
                cur.execute(
                    "INSERT INTO MEASUREMENT_UNITS (NAME) VALUES (%s) ON CONFLICT DO NOTHING;",
                    (unit_norm,)
                )
            except Exception as e:
                conn.rollback()
                raise SystemExit(f"Failed to insert measurement unit '{unit_norm}': {e}")
            unit_inserted.add(unit_norm)


conn.commit()
for recipe_id, ingr_name, unit_name, r_start, r_end in valid_entries:
    try:
        cur.execute(
            """
            INSERT INTO INGREDIENTS_IN_RECIPES (RECIPE_ID, INGREDIENT_ID, MEASUREMENT_UNIT_ID, AMOUNT_RANGE_START, AMOUNT_RANGE_END)
            VALUES (
                (SELECT ID FROM RECIPES WHERE ID = %s),
                (SELECT ID FROM INGREDIENTS WHERE NAME = %s),
                (SELECT ID FROM MEASUREMENT_UNITS WHERE NAME = %s),
                %s, %s
            );
            """,
            (recipe_id, ingr_name, unit_name, r_start, r_end)
        )
    except Exception as e:

        conn.rollback()
        raise SystemExit(f"Failed to link ingredient '{ingr_name}' in recipe {recipe_id}: {e}")


conn.commit()
print("Database population completed successfully.")

cur.close()
conn.close()
