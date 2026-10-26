import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

# 1. Update families.json
with open('c:/Users/kimwo/honmaek-app/src/data/families.json', 'r', encoding='utf-8') as f:
    families = json.load(f)

for fam in families:
    if fam['id'] == 'FAM_LG':
        fam['related_groups'] = ['LG', 'LS', 'GS', 'LX', 'LIG', '희성', 'LT', 'LF', '아워홈', 'E1', '예스코']
        fam['history_summary'] = "구인회 창업주와 허만정 공동창업주의 동업으로 시작하여 LG, GS(허씨 분가), LS(구태회·구평회·구두회 3형제 분가), LX(구본준 분가), LIG, LF, 아워홈 등으로 분화한 대한민국 대표 제조·전자·화학 재벌 가문."
        print("Updated FAM_LG")
    elif fam['id'] == 'FAM_LS':
        fam['name'] = "범LG·LS가"
        fam['founder'] = "구태회·구평회·구두회 (구인회 동생들)"
        fam['history_summary'] = "LG그룹 공동창업주인 구인회 회장의 동생들인 구태회(전 국회부의장), 구평회(E1 명예회장), 구두회(예스코 명예회장) 3형제 일가가 2003년 LG그룹에서 계열분리하여 설립한 범LG가 직계 가문 (LS, E1, 예스코 등)."
        fam['parent_family_id'] = "FAM_LG"
        fam['related_groups'] = ["LS", "E1", "예스코"]
        print("Updated FAM_LS")

with open('c:/Users/kimwo/honmaek-app/src/data/families.json', 'w', encoding='utf-8') as f:
    json.dump(families, f, ensure_ascii=False, indent=2)

# 2. Update corporate_groups.json
with open('c:/Users/kimwo/honmaek-app/src/data/corporate_groups.json', 'r', encoding='utf-8') as f:
    groups = json.load(f)

for g in groups:
    if g['id'] == 'GRP_LS':
        g['family_id'] = 'FAM_LG'  # Map to root FAM_LG for genealogy viewing
        g['pan_family'] = '범LG가'
        g['parent_group_id'] = 'GRP_LG'
        g['branch_origin'] = '범LG가 직계 (구태회·구평회·구두회 3형제 계열)'
        print("Updated GRP_LS in corporate_groups.json")

with open('c:/Users/kimwo/honmaek-app/src/data/corporate_groups.json', 'w', encoding='utf-8') as f:
    json.dump(groups, f, ensure_ascii=False, indent=2)

print("Applied updates successfully!")
