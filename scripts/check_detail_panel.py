import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('c:/Users/kimwo/honmaek-app/src/components/NetworkView.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(540, 650):
    if i < len(lines):
        print(f"{i+1}: {lines[i]}", end="")
