# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Update relations.json
with open('c:/Users/kimwo/honmaek-app/src/data/relations.json', 'r', encoding='utf-8') as f:
    relations = json.load(f)

# Check if M_BOKWANG_AMORE already exists
exists = any(r.get('id') == 'M_BOKWANG_AMORE' for r in relations)
if not exists:
    relations.append({
        "id": "M_BOKWANG_AMORE",
        "from_id": "PER_FAM_JOONGANG_HONG_2702",
        "to_id": "PER_FAM_AMORE_2133",
        "type": "MARRIAGE",
        "label": "혼인 (보광 홍정환 - 아모레퍼시픽 서민정)",
        "start_year": 2020,
        "end_year": 2021,
        "status": "VERIFIED",
        "is_inter_family": True,
        "fam_from": "FAM_JOONGANG_HONG",
        "fam_to": "FAM_AMORE",
        "desc": "홍석준 보광창업투자 회장 장남 홍정환과 서경배 아모레퍼시픽 회장 장녀 서민정의 2020년 혼인 및 2021년 합의 이혼 (보광·중앙일보 - 아모레퍼시픽 통혼)",
        "source_ids": ["SRC_NAMU_001"]
    })
    print("Added M_BOKWANG_AMORE to relations.json")

with open('c:/Users/kimwo/honmaek-app/src/data/relations.json', 'w', encoding='utf-8') as f:
    json.dump(relations, f, ensure_ascii=False, indent=2)

# 2. Update structured_genealogies.json
with open('c:/Users/kimwo/honmaek-app/src/data/structured_genealogies.json', 'r', encoding='utf-8') as f:
    genealogies = json.load(f)

def clean_tree_node(node, fid):
    role = node.get('role', '')
    name = node.get('name', '')
    
    # Custom fixes
    if name == '서민정' and fid == 'FAM_AMORE':
        node['role'] = '아모레퍼시픽 럭셔리브랜드디비전 담당'
        node['spouses'] = [{
            'name': '홍정환',
            'birthDeath': '1985 ~',
            'familyOrigin': '보광창업투자 투자심사총괄 (전남편)'
        }]
        node['interMarriage'] = {
            'partnerName': '홍정환',
            'partnerFamily': '중앙일보·보광 홍씨일가 (홍석준 회장 장남)',
            'desc': '홍석준 보광창업투자 회장 장남 홍정환과 2020년 혼인 후 2021년 합의 이혼 (보광·중앙일보 - 아모레퍼시픽 통혼)'
        }
        print("Updated FAM_AMORE 서민정 node with interMarriage")
        
    if name == '홍정환' and fid == 'FAM_JOONGANG_HONG':
        node['role'] = '보광창업투자 투자심사총괄'
        node['interMarriage'] = {
            'partnerName': '서민정',
            'partnerFamily': '아모레퍼시픽가 (서경배 회장 장녀)',
            'desc': '서경배 아모레퍼시픽 회장 장녀 서민정과 2020년 혼인 후 2021년 합의 이혼 (보광·중앙일보 - 아모레퍼시픽 통혼)'
        }
        print("Updated FAM_JOONGANG_HONG 홍정환 node with interMarriage")

    # Clean unparsed / 前夫 or / 前妻 in roles
    if '/ 前夫' in role or '/ 前妻' in role or '前夫' in role or '前妻' in role:
        # Extract former spouse if possible
        m = re.search(r'/\s*前[夫妻]\s*([가-힣]{2,4})?(?:\s*\(([^)]+)\))?(.*)', role)
        if m:
            sp_name = m.group(1) or ''
            sp_dates = m.group(2) or ''
            sp_info = (m.group(3) or '').strip()
            # If spouse name found and not already in spouses
            if sp_name:
                spouses = node.get('spouses', [])
                if not any(sp_name in s.get('name', '') for s in spouses):
                    spouses.append({
                        'name': sp_name,
                        'birthDeath': sp_dates,
                        'familyOrigin': f"{sp_info} (전배우자)".strip()
                    })
                    node['spouses'] = spouses
        # Clean role
        clean_r = re.sub(r'/\s*前[夫妻].*$', '', role).strip()
        if not clean_r or clean_r == '/':
            clean_r = f"{fid.replace('FAM_', '')}가 일원"
        node['role'] = clean_r

    # Recurse children
    for child in node.get('children', []):
        clean_tree_node(child, fid)

for fid, fam_obj in genealogies.items():
    if isinstance(fam_obj, dict) and 'root' in fam_obj:
        clean_tree_node(fam_obj['root'], fid)

with open('c:/Users/kimwo/honmaek-app/src/data/structured_genealogies.json', 'w', encoding='utf-8') as f:
    json.dump(genealogies, f, ensure_ascii=False, indent=2)
print("Updated structured_genealogies.json")

# 3. Update persons.json
with open('c:/Users/kimwo/honmaek-app/src/data/persons.json', 'r', encoding='utf-8') as f:
    persons = json.load(f)

for p in persons:
    name = p.get('name', '')
    role = p.get('role', '')
    main_title = p.get('main_title', '')
    
    if name == '서민정':
        p['role'] = '아모레퍼시픽 럭셔리브랜드디비전 담당'
        p['main_title'] = '아모레퍼시픽 럭셔리브랜드디비전 담당'
    elif '/ 前夫' in role or '/ 前妻' in role or '前夫' in role or '前妻' in role:
        clean_r = re.sub(r'/\s*前[夫妻].*$', '', role).strip()
        clean_r = re.sub(r'관련기사.*$', '', clean_r).strip()
        if not clean_r or clean_r == '/':
            clean_r = f"{p.get('family_id', '').replace('FAM_', '')}가 일원"
        p['role'] = clean_r
        p['main_title'] = clean_r

with open('c:/Users/kimwo/honmaek-app/src/data/persons.json', 'w', encoding='utf-8') as f:
    json.dump(persons, f, ensure_ascii=False, indent=2)
print("Updated persons.json")
