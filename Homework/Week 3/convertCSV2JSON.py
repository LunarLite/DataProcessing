# Homework Week 3
# Name: Mick Tozer
# Collaborators: 
#
# This program converts a csv file into json.

# import dependencies
import csv
import json

# open both required files, with required allowances (r/w)
csvfile = open('csvdata.csv', 'r')
jsonfile = open('jsondata.json', 'w')

# determine field names for output whilst reading from csv
fieldnames = ("Date", "Temp")
reader = csv.DictReader( csvfile, fieldnames)

# output the data into the json file
data = []
for row in reader:
	data.append(row)
json.dump(data, jsonfile, indent=2)