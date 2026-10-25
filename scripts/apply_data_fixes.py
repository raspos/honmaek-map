import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

# 1. Update corporate_groups.json
with open('c:/Users/kimwo/honmaek-app/src/data/corporate_groups.json', 'r', encoding='utf-8') as f:
    groups = json.load(f)

gids = set(g['id'] for g in groups)

new_groups = [
    {
        "id": "GRP_HYUNDAI",
        "name": "현대그룹(모태)",
        "family_id": "FAM_HYUNDAI",
        "founding_year": 1947,
        "ftc_rank": 35,
        "assets_trillion": 5.0,
        "leader": "현정은",
        "industry": "해운, 물류, 엘리베이터, 건설",
        "key_companies": ["현대엘리베이터", "현대아산", "현대무벡스"]
    },
    {
        "id": "GRP_KUMHO_ASIANA",
        "name": "금호아시아나",
        "family_id": "FAM_KUMHO",
        "founding_year": 1946,
        "ftc_rank": 40,
        "assets_trillion": 4.5,
        "leader": "박삼구",
        "industry": "고속버스, 건설",
        "key_companies": ["금호고속", "금호건설"]
    },
    {
        "id": "GRP_KISCO",
        "name": "KISCO홀딩스(한국철강)",
        "family_id": "FAM_DONGKUK",
        "founding_year": 2001,
        "ftc_rank": 70,
        "assets_trillion": 2.2,
        "leader": "장세홍",
        "industry": "철강, 건설용 봉강",
        "key_companies": ["한국철강", "환영철강공업"]
    }
]

for ng in new_groups:
    if ng['id'] not in gids:
        groups.append(ng)
        print(f"Added corporate group: {ng['id']} ({ng['name']})")

with open('c:/Users/kimwo/honmaek-app/src/data/corporate_groups.json', 'w', encoding='utf-8') as f:
    json.dump(groups, f, ensure_ascii=False, indent=2)

# 2. Update relations.json
with open('c:/Users/kimwo/honmaek-app/src/data/relations.json', 'r', encoding='utf-8') as f:
    relations = json.load(f)

for r in relations:
    rid = r.get('id')
    if rid == 'M_GS_CHOSUN':
        r['from_id'] = 'PER_FAM_CHOSUN_ILBO_2592'
        r['to_id'] = 'P_HUH_YOO_JUNG'
        print("Fixed M_GS_CHOSUN IDs")
    elif rid == 'M_GS_HONG':
        r['from_id'] = 'P_HUH_SEO_HONG'
        r['to_id'] = 'PER_FAM_JOONGANG_HONG_2688'
        print("Fixed M_GS_HONG IDs")
    elif rid == 'M_TK_DK':
        r['from_id'] = 'P_LEE_YOUNG_JIN_TK'
        r['to_id'] = 'PER_FAM_DONGKUK_1682'
        print("Fixed M_TK_DK IDs")
    elif rid == 'M_KH_DK':
        r['from_id'] = 'PER_FAM_DONGKUK_1738'
        r['to_id'] = 'P_PARK_EUN_KYUNG'
        print("Fixed M_KH_DK IDs")
    elif rid == 'M_HYOSUNG_PRESIDENT_LEE':
        r['from_id'] = 'P_CHO_HYUN_BUM'
        r['to_id'] = 'PER_LEE_SOO_YEON'
        print("Fixed M_HYOSUNG_PRESIDENT_LEE IDs")
    elif rid == 'M_HYOSUNG_SONG':
        r['from_id'] = 'P_CHO_SUCK_RAE'
        r['to_id'] = 'P_SONG_KWANG_JA'
        print("Fixed M_HYOSUNG_SONG IDs")
    elif rid == 'REL_SP_010':
        r['from_id'] = 'GRP_KUMHO_ASIANA'
        r['to_id'] = 'GRP_KUMHO'
        print("Fixed REL_SP_010 Kumho Spinoff")
    elif rid == 'REL_SP_011':
        r['from_id'] = 'GRP_DONGKUK_STEEL'
        r['to_id'] = 'GRP_KISCO'
        print("Fixed REL_SP_011 Dongkuk/KISCO Spinoff")

with open('c:/Users/kimwo/honmaek-app/src/data/relations.json', 'w', encoding='utf-8') as f:
    json.dump(relations, f, ensure_ascii=False, indent=2)

print("Data fixes applied successfully!")
