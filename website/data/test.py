import csv
from collections import Counter
with open('gu272.csv') as f:
  reader = csv.reader(f, delimiter='\t')
  header = next(reader)
  lines = [line for line in reader]
  # print(lines)
  # for l in lines:
  	# print(l[0].split(",")[8])
  counts = Counter([l[0].split(",")[13] for l in lines])
print(counts)
