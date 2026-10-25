import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('c:/Users/kimwo/honmaek-app/src/App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(78, 86):
    print(repr(lines[i]))
