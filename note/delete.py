#coding:utf-8
import book
import os
import note
import pdb
FRIEND = 'noteInfor' + os.sep + "userData" + os.sep + "%s" + os.sep + 'friends.txt'
NOTE = "noteInfor" + os.sep + 'userData' + os.sep + '%s'+ os.sep + 'bookNote' + os.sep + '%s' + os.sep + '%s' + '.txt'
NOTEINDEX = "noteInfor" + os.sep + 'userData' + os.sep + '%s'+ os.sep + 'bookNote' + os.sep + 'noteIndex.txt'
BOOKINDEXPATH = "noteInfor" + os.sep + 'userData' + os.sep + '%s'+ os.sep + 'bookIndex.txt'
PLAN = "noteInfor" + os.sep + 'userData' + os.sep + '%s'+ os.sep + 'plan' + os.sep + '%s' + '.txt'
LINEINDEX = "noteInfor" + os.sep + 'userData' + os.sep + '%s'+ os.sep + 'bookNote' + os.sep + '%s' + os.sep + 'lineIndex.txt'
def deleteFriend(request):
	userID = request.GET.get('userID',None)
	friendID = request.GET.get('ID',None)
	path = FRIEND%userID
	if not book.searchBookIndex(friendID,path):
		return True
	deleteOneLine(friendID,path)
	return True

def deleteCollect(request):
	userID = request.GET.get('userID',None)
	resourceID = request.GET.get('ID',None)
	if not resourceID:
		return True
	if resourceID[0] == 'E':
		path = 'noteInfor' + os.sep + "userData" + os.sep + userID + os.sep + 'myFileList.txt'
	elif resourceID[0] == 'W':
		path = 'noteInfor' + os.sep + "userData" + os.sep + userID + os.sep + 'weiXinLink.txt'

	if not book.searchBookIndex(resourceID,path):
		return True
	deleteOneLine(resourceID,path)
	deletePlan(request)
	return True


def deleteOneLine(fitStr,path):
	flag = 0
	with open(path,'r') as f:
		lineStr =  f.readlines()
	for i in range(len(lineStr)):
		line = lineStr[i]
		line = line.strip('\n')
		if not line:
			continue
		line = line.split(',')
		for element in line:
			if fitStr == element:
				del lineStr[i]
				flag = 1
				break
		if flag == 1:
			flag = 0
			break
	with open(path,'w') as f:
		for line in lineStr:
			f.write(line)
	f.close()
	return True

def deleteNote(request):
	userID = request.GET.get('userID',None)
	createTime = request.GET.get('createTime',None)
	bookID = request.GET.get('bookID',None)
	path = NOTE%(userID,bookID,createTime)
	if not note.checkFileExist(path):
		return True
	os.remove(path)
	path = NOTEINDEX%userID
	deleteOneLine(createTime,path)
	return True

def deletePlan(request):
	userID = request.GET.get('userID',None)
	bookID = request.GET.get('ID',None)
	path = BOOKINDEXPATH%userID
	if book.getBookName(bookID,path):
		deleteOneLine(bookID,path)
	path = PLAN%(userID,bookID)
	if note.checkFileExist(path):
		os.remove(path)
	return True

def deleteLine(request):
	userID = request.GET.get('userID',None)
	start = request.GET.get('start',None)
	bookID = request.GET.get('bookID',None)
	path = LINEINDEX%(userID,bookID)
	if not note.checkFileExist(path):
		return True
	if not book.searchBookIndex(start,path):
		return True
	deleteOneLine(start,path)
	return True

