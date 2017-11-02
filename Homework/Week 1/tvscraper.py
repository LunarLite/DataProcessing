#!/usr/bin/env python
# Name:
# Student number:
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv


from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):

	amount_series = 0
	amount_info = 5
	# check how many series there are to be scraped
	for Series in dom.by_class("lister-item-content"):
		amount_series += 1

	# create 2D array of appropriate size
	tvseries = [[0 for x in range(amount_info)] for y in range(amount_series)] 
	count = 0
	# grab all Series and the details to then enter into the 2D array
	for Series in dom.by_class("lister-item-content"):
	
		# for all subsequent for loops, make sure the content isn't None or an empty string
		# also convert all unicode characters to normal characters
		# finally add them to their appropriate spot in the 2D array
	
		# grab Series name
		for Item in Series.by_class("lister-item-header"):
			title = Item.by_tag('a')[0].content.encode("windows-1252")
			if title in ("", None):
				tvseries[count][0] = "Empty"
			else:
				tvseries[count][0] = title
			
		# grab rating
		for Item in Series.by_class("ratings-imdb-rating"):
			rating = Item.by_tag("strong")[0].content.encode("windows-1252")
			if rating in ("", None):
				tvseries[count][1] = "Empty"
			else:
				tvseries[count][1] = rating
			
		# grab Genre
		for Item in Series.by_class("genre"):
			genre = Item.content[1:-12].encode("windows-1252")
			if genre in ("", None):
				tvseries[count][2] = "Empty"
			else:
				tvseries[count][2] = genre
			
		
		# grab Actors
		actorList = []
		for Item in Series.by_tag("p")[2].by_tag("a"):
			actorList.append(Item.content.encode("windows-1252"))
		actors = ", ".join(actorList)
		
		if actors in ("", None):
			tvseries[count][3] = "Empty"
		else:
			tvseries[count][3] = actors

		# grab Runtime
		for Item in Series.by_class("runtime"):
			runtime = Item.content[:-4].encode("windows-1252")
			if runtime in ("", None):
				tvseries[count][4] = "Empty"s
			else:
				tvseries[count][4] = runtime
		
		count += 1
			
    #return []  # replace this line as well as appropriate
	return tvseries;


def save_csv(f, tvseries):
    # '''
    # Output a CSV file containing highest rated TV-series.
    # '''
	writer = csv.writer(f)
	writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
	tvseries = tvseries
	count = 0
	# write the data of each entree in the 2D array
	for series in tvseries:
		writer.writerow([tvseries[count][0], tvseries[count][1], tvseries[count][2], tvseries[count][3], tvseries[count][4]])
		count += 1


    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE TV-SERIES TO DISK

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)
