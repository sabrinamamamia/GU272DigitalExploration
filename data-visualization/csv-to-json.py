import csv
import json

slaveDict = {}
parentDict = {}

file = open('csv/SlaveList-02-20-2017.csv')
fileReader = csv.reader(file)
next(fileReader, None)

for row in fileReader:
	# Create slave dictionary (key: slave id, value: all attributes)
	slaveDict[int(row[0])] = {
		"id": row[0],
		"full_name": row[2],
		"first_name": row[3],
		"last_name": row[4],
		"birthdate": row[5],
		"age": row[6],
		"age_approx": row[7],
		"farm_name": row[8],
		"lat": row[9],
		"long": row[10],
		"refernce_url": row[11],
		"identity": row[12],
		"buyer_name": row[13],
		"extra_info": row[14],
		"gender": row[15],
		"ship": row[16],
		"parent": None,
		"children": []
	}

	# If family key == H (indicating head of family), add to 
	# parent dictionary (key: family id, value: slave id). 
	# Else if family key == F (family member), set object's parent 
	# variable and append family member's id to parent's list of children
	for key in row[1].split("; "):
		if key == '':
			continue
		elif key[0] == 'H':
			parentDict[key[1]] = row[0];
		elif key[0] == 'F':
			slaveDict[int(row[0])]["parent"] = int(parentDict[key[1]])
			slaveDict[int(parentDict[key[1]])]["children"].append(int(row[0]))

	# Write slave dictionary to JSON file
	with open('gu272-data.json', 'w') as f:
		f.write("[")
		for slave in slaveDict:
			json.dump(slaveDict[slave], f, indent=2)
			f.write(",\n")
		f.write("]")
