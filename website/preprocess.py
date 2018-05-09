import csv
import json

def readCSV():
	resultFile = open ("data/person-location.json", "w")
	reader = csv.DictReader(open('data/gu272.csv'))
	# print(reader[0])
	latDict = {"White Marsh": 38.98305, "St. Thomas's Manor": 38.46552, "Newtown": 38.25569, "St. Inigoes": 38.15042}
	longitudeDict = {"White Marsh": -76.79814, "St. Thomas's Manor": -77.0237, "Newtown": -76.69998, "St. Inigoes": -76.42385}
	route = []	
	counter = 0
	for row in reader:
		# print(row['extra_info'])
		if row['farm_name'] != '':
			person = {}
			pid = "p" + str(counter)
			name = row['farm_name']
			name_id = row['farm_name'].lower().replace('.', '').replace(' ', '').replace('\'', '')
			lat = latDict[name]
			longitude = longitudeDict[name]
			dest = ""
			if row['buyer_name'] != '':
				if row['buyer_name'] == 'Henry Johnson':
					dest = 'chathamplantation'
				else:
					dest = 'westoakplantation'
			person["name"] = name
			person["name_id"] = name_id
			person["pid"] = pid
			person["lat"] = lat
			person["longitude"] = longitude
			person["dest"] = dest
			route.append(person)
			counter +=1
		print(len(route))
	resultFile.write(json.dumps(route))

	# 	first_name = row['first_name'].split(' (')[0]
	# 	key = first_name.lower().rstrip() + " " + row['age']
	# 	# print(key)
	# 	if key not in gu272:
	# 		gu272[key] = row
	# print(gu272.keys())

def readTxt():
	with open ("data/slave-data.txt") as f:
		lines = list(filter(None,[l.strip().replace("\"", "") for l in f.readlines()]))
		with open('data/age-height-data.csv', 'w') as out_file:
			writer = csv.writer(out_file)
			writer.writerow(('first_name', 'last_name', 'gender', 'age', 'height', 'skin'))
			for l in lines:
				# print(list(filter(None, l.split(" "))))
				info = list(filter(None, l.split(" ")))
				i = 0
				lastName = gender = age = height = skin = ''
				while i < len(info): 
					# First name
					if i == 0:
						firstName = info[i]
					# Last Name
					elif i == 1 and len(info[i]) > 1 and info[i].isalpha():
						lastName = info[i]
					# Gender
					elif info[i] == 'm' or info[i] == 'f':
						gender = info[i]	 
					# Age 
					elif info[i].isdigit():
						age = info[i]	 
					# Height
					elif '-' in info[i]:
						height = info[i]
					# Complexion
					elif info[i] == 'Brown' or info[i] == 'Black':
						skin = info[i]
					i += 1
				# key = firstName.lower() + " " + age
				# if key in gu272:
					# print (key + " Last name: " + lastName + ", Age:" + age)
				entry = firstName + ',' + lastName + ',' + gender + ',' + age + ',' + height + ',' + skin
				print(entry)
				writer.writerow(entry.split(","))
				# print(firstName + ',' + lastName + ',' + gender + ',' + age + ',' + height + ',' + skin)
				# print("First name: " + firstName + ", Last name: " + lastName + ", Gender: " + gender
				# 	+ ", Age:" + age + ", Height: " + height + ", Skin: " + skin)

readCSV()