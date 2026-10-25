import json

with open('c:/Users/kimwo/honmaek-app/src/data/families.json', 'r', encoding='utf-8') as f: families = json.load(f)
with open('c:/Users/kimwo/honmaek-app/src/data/persons.json', 'r', encoding='utf-8') as f: persons = json.load(f)
with open('c:/Users/kimwo/honmaek-app/src/data/corporate_groups.json', 'r', encoding='utf-8') as f: corporateGroups = json.load(f)
with open('c:/Users/kimwo/honmaek-app/src/data/relations.json', 'r', encoding='utf-8') as f: relations = json.load(f)

def test_level(lvl):
    elements = []
    if lvl == 1:
        activeEdges = []
        for r in relations:
            if r.get('type') == 'MARRIAGE' and r.get('is_inter_family') and r.get('fam_from') and r.get('fam_to'):
                activeEdges.append({'id': r['id'], 'source': r['fam_from'], 'target': r['fam_to']})
        connectedFamIds = set([e['source'] for e in activeEdges] + [e['target'] for e in activeEdges])
        for f in families:
            if f['id'] in connectedFamIds:
                elements.append({'id': f['id'], 'type': 'node'})
        elements.extend([{'id': e['id'], 'source': e['source'], 'target': e['target'], 'type': 'edge'} for e in activeEdges])

    elif lvl == 2:
        activeEdges = []
        for r in relations:
            if r.get('type') in ['BLOOD', 'MARRIAGE']:
                activeEdges.append({'id': r['id'], 'source': r['from_id'], 'target': r['to_id']})
        connectedPersonIds = set([e['source'] for e in activeEdges] + [e['target'] for e in activeEdges])
        for p in persons:
            if p['id'] in connectedPersonIds:
                elements.append({'id': p['id'], 'type': 'node'})
        elements.extend([{'id': e['id'], 'source': e['source'], 'target': e['target'], 'type': 'edge'} for e in activeEdges])

    elif lvl == 3:
        activeEdges = []
        for r in relations:
            if r.get('type') == 'SPINOFF':
                activeEdges.append({'id': r['id'], 'source': r['from_id'], 'target': r['to_id']})
        connectedGroupIds = set([e['source'] for e in activeEdges] + [e['target'] for e in activeEdges])
        for g in corporateGroups:
            if g['id'] in connectedGroupIds:
                elements.append({'id': g['id'], 'type': 'node'})
        elements.extend([{'id': e['id'], 'source': e['source'], 'target': e['target'], 'type': 'edge'} for e in activeEdges])

    node_ids = set(e['id'] for e in elements if e['type'] == 'node')
    broken_edges = []
    for e in elements:
        if e['type'] == 'edge':
            if e['source'] not in node_ids:
                broken_edges.append((e['id'], 'source missing', e['source']))
            if e['target'] not in node_ids:
                broken_edges.append((e['id'], 'target missing', e['target']))
    print(f"Level {lvl}: {len(node_ids)} nodes, {len(elements) - len(node_ids)} edges. Broken edges: {len(broken_edges)}")
    for b in broken_edges[:10]:
        print("  Broken:", b)

print("--- Testing current data ---")
test_level(1)
test_level(2)
test_level(3)
