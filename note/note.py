#coding:utf-8
import os
import time
import linecache
import book
BOOKNOTE = 'noteInfor' + os.sep + "userData" + os.sep + "%s" + os.sep + "bookNote" + os.sep\
	+ "%s" + os.sep
TEMPNOTE = path = 'noteInfor' + os.sep + "userData" + os.sep + "%s" + os.sep + 'tempNote' + os.sep
EBOOKINDEX = "noteInfor" + os.sep + "book.txt"
BOOKINDEXPATH = "noteInfor" + os.sep + 'userData' + os.sep + '%s'+ os.sep + 'bookIndex.txt'

def checkFileExist(path):
	if os.path.exists(path):
		return True
	return False

def getTotalLine(path):
	count = 0
	with open(path,'rb') as f:
		while True:
			buffer = f.read(8192*1024)
			if not buffer:
				break
			count +=buffer.count('\n')
	return count

def getOneLine(path,lineNum):
	if checkFileExist(path):
		return linecache.getline(path,lineNum)
	return None

def setBookNote(ID,bookName,note):
	notedate = time.strftime('%Y%m%d',time.localtime(time.time()))
	path = BOOKNOTE % (ID,bookName) + notedate + ".txt"
	getNoteName(notedate)
	with open(path,'w') as f:
		 f.write(note)


def getBookNote(ID,bookName,timeString):
	if timeString:
		path = path = BOOKNOTE % (ID,bookName) + timeString + ".txt"
	else:
		pass
	with open(path,'r') as f:
		note = f.read()
	return note


def getNoteName(timeString):
	pass

def saveTempNote(request):
	userID = request.GET.get('userID',None)
	noteContent = request.GET.get('noteContent',None)
	title = request.GET.get('title',None)
	path = TEMPNOTE%userID + 'tempNote.txt'
	with open(path,'w') as f:
		if not noteContent:
			return False
		f.write(title + '\n' + noteContent)
	return True

def getTempNote(request):
	noteData = []
	userID = request.GET.get('userID',None)
	path = TEMPNOTE%userID + 'tempNote.txt'
	with open(path,'r') as f:
		title = f.readline()
		noteContent = f.readlines()
		noteData.append({'title':title,'noteContent':noteContent})

	return noteData


def getUserAllMemo(request):
	userID = request.GET.get('userID',None)
	returnData = []
	path = 'noteInfor' + os.sep + "userData" + os.sep + "%s" + os.sep + "bookNote"
	allFile = os.walk(path%userID)
	for root, dirs, files in allFile:
		for file in files:
			if file == 'lineIndex.txt' or file == 'noteIndex.txt' or file == 'lineIndex':
				continue
			bookID = root.split(os.sep)[-1]
			path = EBOOKINDEX
			bookName = book.getBookName(bookID,path)
			if not bookName:
				path = BOOKINDEXPATH%userID
				bookName = book.getBookName(bookID,path)
			if not bookName:
				bookName = ''
			memoContent = []
			createTime = file.strip('.txt')
			path = root + os.sep + file
			with open(path,'r') as f:
				memoContent.append({'title':f.readline(),'noteContent':f.readlines(),'createTime':createTime})
			returnData.append({'bookID':bookID,'bookName':bookName,'memoContent':memoContent})
	path = ''
	return returnData

