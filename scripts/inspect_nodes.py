import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('c:/Users/kimwo/honmaek-app/src/data/persons.json', 'r', encoding='utf-8') as f:
    persons = json.load(f)

for p in persons:
    r = p.get('role', '') + ' ' + p.get('main_title', '')
    if any(k in r for k in ['/ 前夫', '/ 前妻', '前夫', '前妻', '[각주', '각주']):
        print(f"[{p.get('family_id')}] {p.get('name')} ({p.get('id')}): role='{p.get('role')}', main_title='{p.get('main_title')}'")
