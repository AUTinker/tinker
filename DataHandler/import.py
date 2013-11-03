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

            countries[countryName]=years;

    finally:
        print countries;
        f.close()      # closing
        return countries;

def readEthnicity():
    f = open('eth.csv', 'rb') # opens the csv fil

    rownum = 0;
    try:
        reader = csv.reader(f ,delimiter=' ')  # creates the reader object
        header = ['CM', 'CF', 'BM', 'BF', 'AMM', 'AMF', 'ASM', 'ASF', 'HM', 'HF', 'NM', 'NF', 'UM', 'UF','Total'];
        header_year = ['2009', '2010', '2011', '2012', '2013'];
        years = dict();

        for i in range( len(header_year) ):
            years[header_year[i]] = dict();

        rownum = 0
        for row in reader:   # iterates the rows of the file in orders
            colnum = 0
            for col in row:
                #print '%-8s: %s' % (header[colnum], col), colnum
                if(colnum ==0):
                    pass
                else:
                    print header[rownum], col
                    years[header_year[colnum-1]][header[rownum]] =col

                colnum += 1
            rownum += 1


    finally:
        print years;
        f.close()      # closing

        db,cursor = connectDB();

        for key,val in years.items():
            year = key
            race = val
            
            print race[header[0]];
            cursor.execute("INSERT IGNORE INTO Ethnics VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s ) ", (year, race[header[0]], race[header[1]], race[header[2]], race[header[3]], race[header[4]], race[header[5]], race[header[6]], race[header[7]], race[header[8]], race[header[9]], race[header[10]], race[header[11]], race[header[12]], race[header[13]], race[header[14]]  ) )

        closeDB(db, cursor);

        return years;


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

    #states = readStateData();	
    #insertStateDB(states);

    states = readEthnicity();
