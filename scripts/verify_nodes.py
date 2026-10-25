import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('c:/Users/kimwo/honmaek-app/src/data/structured_genealogies.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def dump_node(node):
    name = node.get('name', '')
    if name in ['서민정', '홍정환']:
        print(f"=== {name} ===")
        print(json.dumps(node, ensure_ascii=False, indent=2))
    for c in node.get('children', []):
        dump_node(c)

dump_node(data['FAM_AMORE']['root'])
dump_node(data['FAM_JOONGANG_HONG']['root'])
