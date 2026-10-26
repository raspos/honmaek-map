import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('c:/Users/kimwo/honmaek-app/src/components/CorporateMatcher.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("".join(lines[240:330]))
