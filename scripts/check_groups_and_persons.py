import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('c:/Users/kimwo/honmaek-app/src/data/corporate_groups.json', 'r', encoding='utf-8') as f:
    groups = json.load(f)

print('=== ALL CORPORATE GROUPS ===')
for g in groups:
    print(f"{g['id']}: {g['name']}")

with open('c:/Users/kimwo/honmaek-app/src/data/relations.json', 'r', encoding='utf-8') as f:
    relations = json.load(f)

with open('c:/Users/kimwo/honmaek-app/src/data/persons.json', 'r', encoding='utf-8') as f:
    persons = json.load(f)

pids = {p['id']: p for p in persons}
pnames = {}
for p in persons:
    pnames.setdefault(p['name'], []).append(p)

print('\n=== CHECKING UNMATCHED PERSON IDS IN RELATIONS ===')
for r in relations:
    if r.get('type') in ['MARRIAGE', 'BLOOD']:
        f_id = r.get('from_id')
        t_id = r.get('to_id')
        f_found = f_id in pids
        t_found = t_id in pids
        if not f_found or not t_found:
            print(f"Rel: {r['id']} ({r.get('label')})")
            if not f_found:
                print(f"  from_id NOT FOUND: {f_id}")
            if not t_found:
                print(f"  to_id NOT FOUND: {t_id}")
