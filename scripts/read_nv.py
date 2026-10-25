import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('c:/Users/kimwo/honmaek-app/src/components/NetworkView.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("Lines count:", len(lines))
print("".join(lines[580:660]))
