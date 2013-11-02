import csv     # imports the csv module
import sys      # imports the sys module
import MySQLdb

def readCountriesData():
    f = open('countries.csv', 'rb') # opens the csv fil

    rownum = 0
    try:
        reader = csv.reader(f ,delimiter=',')  # creates the reader object
        header = ['country', '2009', '2010', '2011', '2012', '2013']
        countries = dict();
        for row in reader:   # iterates the rows of the file in orders
            colnum = 0
            years = dict();
            for col in row:
                #print '%-8s: %s' % (header[colnum], col), colnum
                if(colnum ==0):
                    countryName = col;
                else:
                    #print header[colnum], col
                    years[header[colnum]]=col

                colnum += 1

            #print years;
            #print stateName, years;
            countries[countryName]=years;

    finally:
        print countries;
        f.close()      # closing
        return countries;


def readStateData():
    f = open('JeffStates.csv', 'rb') # opens the csv fil

    rownum = 0
    try:
        reader = csv.reader(f ,delimiter=',')  # creates the reader object
        header = ['states', '2009', '2010', '2011', '2012', '2013']
        states = dict();
        for row in reader:   # iterates the rows of the file in orders
            colnum = 0
            years = dict();
            for col in row:
                #print '%-8s: %s' % (header[colnum], col), colnum
                if(colnum ==0):
                    stateName = col;
                else:
                    #print header[colnum], col
                    years[header[colnum]]=col

                colnum += 1

            #print years;
            #print stateName, years;
            states[stateName]=years;

    finally:
        print states;
        f.close()      # closing
        return states;

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

def insertStateDB(data):

    db,cursor = connectDB();

    for key,val in data.items():
        state = key
        years = val
        for key,val in years.items():
            year = key;
            totalNum = val;
            #print year, state, totalNum
            cursor.execute("INSERT IGNORE INTO States VALUES (%s, %s, '', '', %s) ", (year, state, totalNum))

    closeDB(db, cursor);


def insertCountriesDB(data):

    db,cursor = connectDB();

    for key,val in data.items():
        country = key
        years = val
        for key,val in years.items():
            year = key;
            totalNum = val;
            #print year, state, totalNum
            cursor.execute("INSERT IGNORE INTO Countries VALUES (%s, %s, '', '', %s) ", (year, country, totalNum))

    closeDB(db, cursor);



if __name__ == "__main__":
    #states = readCountriesData();	
    #insertCountriesDB(states);

    states = readStateData();	
    insertStateDB(states);
