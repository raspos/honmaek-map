import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('c:/Users/kimwo/honmaek-app/src/data/structured_genealogies.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def search_tree(node, query):
    found = []
    if query in node.get('name', ''):
        found.append(node)
    for c in node.get('children', []):
        found.extend(search_tree(c, query))
    return found

print("Searching in FAM_LG:")
for name in ['구태회', '구평회', '구두회', '구자홍', '구자열', '구자은']:
    res = search_tree(data['FAM_LG']['root'], name)
    print(f"{name}: {len(res)} matches -> {[r.get('name') + ' (' + r.get('role') + ')' for r in res]}")
