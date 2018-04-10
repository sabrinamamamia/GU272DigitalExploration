import csv
# reader = csv.DictReader(open('data/gu272.csv'))
# # print(reader[0])
# gu272 = {}
# for row in reader:
# 	# print(row['extra_info'])
# 	# print(row) 
# 	first_name = row['first_name'].split(' (')[0]
# 	key = first_name.lower().rstrip() + " " + row['age']
# 	# print(key)
# 	if key not in gu272:
# 		gu272[key] = row
# print(gu272.keys())

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