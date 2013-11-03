import csv     # imports the csv module
import sys      # imports the sys module
#import MySQLdb

header_year = [ 'Ter', '01', '02', '03', '04'];
header_gender = ['M', 'F', 'T']

def readCountriesData():
    f = open('01-04.csv', 'rb') # opens the csv fil

    rownum = 0
    try:
        reader = csv.reader(f ,delimiter=',')  # creates the reader object
        countries = dict();
        for row in reader:   # iterates the rows of the file in orders
            colnum = 0;
            years = dict();
			MFT = 0;
            for col in row:
                #print '%-8s: %s' % (header[colnum], col), colnum
                if(colnum ==0):
                    countryName = col;
					colnum += 1
                else:
                    #print header[colnum], col
					if(MFT == 0):
						years[header_year[colnum]] = dict();

                    years[header_year[colnum]][header_gender[MFT]]=col
					MFT += 1;

				if(MFT>2):
					MFT = 0;
					colnum += 1

            countries[countryName]=years;

    finally:
        print countries;
        f.close()      # closing
        return countries;


def insertCountriesDB(data):

    db,cursor = connectDB();

    for key,val in data.items():
        country = key
        years = val
        for key,val in years.items():
            year = key;
            TFM = val;
            #print year, state, totalNum
			num = list();
			for key,val in years.items():
				num.append(val);		

            cursor.execute("INSERT IGNORE INTO Countries VALUES (%s, %s, %s, %s, %s) ", (year, country, num[0], num[1], num[2] ) )
    closeDB(db, cursor);


def connectDB():
    db = MySQLdb.connect(host="localhost", # your host, usually localhost
    user="tinker", # your username
    passwd="tinker", # your password
    db="tinker") # name of the data base

    cursor = db.cursor();
    return db,cursor;

def closeDB(db,cursor):
    cursor.close()
    db.commit()
    db.close()



if __name__ == "__main__":
	states = readCountriesData();	
    #insertCountriesDB(states);

    #states = readStateData();	
    #insertStateDB(states);

    states = readEthnicity();
