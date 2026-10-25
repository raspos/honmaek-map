import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('c:/Users/kimwo/honmaek-app/src/data/relations.json', 'r', encoding='utf-8') as f:
    relations = json.load(f)

for r in relations:
    if r.get('type') == 'SPINOFF':
        print(r)
