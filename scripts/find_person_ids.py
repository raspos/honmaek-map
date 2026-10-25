import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('c:/Users/kimwo/honmaek-app/src/data/persons.json', 'r', encoding='utf-8') as f:
    persons = json.load(f)

targets = ['방준오', '홍정현', '장옥빈', '장세홍', '조현범', '조석래', '이수연', '송광자', '허유정', '허서홍', '이영진', '박은경']

for p in persons:
    if p.get('name') in targets:
        print(f"Name: {p.get('name')}, ID: {p.get('id')}, Fam: {p.get('family_id')}, Role: {p.get('role')}")
