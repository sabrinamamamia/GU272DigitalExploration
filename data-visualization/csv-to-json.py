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

	for key in row[1].split("; "):
		if key == '':
			continue
		# Family key 'H0' indicates head of family 0. Add slave to  
		# parent dictionary (key: family id, value: slave id)
		elif key[0] == 'H':
			parentDict[key[1:]] = row[0];
		# Family key 'FO' indicates member of family 0. Set object's parent 
		# variable and append object's id to its parent's list of children
		elif key[0] == 'F':
			# print "key[1:]"
			# print key[1:]
			if key[1:] in parentDict: 
				slaveDict[int(row[0])]["parent"] = slaveDict[int(parentDict[key[1:]])]
				slaveDict[int(parentDict[key[1:]])]["children"].append(slaveDict[int(row[0])]);

	# Write slave dictionary to JSON file
	with open('gu272-data.json', 'w') as f:
		f.write("[")
		for idx, slave in enumerate(slaveDict):
			json.dump(slaveDict[slave], f, indent=2)
			if idx != len(slaveDict)-1:
				f.write(",\n")
		f.write("]")
