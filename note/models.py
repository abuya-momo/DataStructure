#coding:utf-8
#from django.db import models
import os
import time
# from note import note
import note
import pdb
import sys
import book
import delete
reload(sys)
sys.setdefaultencoding("utf-8")

NOTEINFOR ="noteInfor" + os.sep    #noteInfor/      linux
FRIENDS = "friends.txt"
INTRODUCE = "introduce.txt"
ACCOUNT = "account.txt"
PLAN = "plan"
# totalPlan = "totalPlan"
BOOKNOTE = NOTEINFOR + "userData" + os.sep + "%s" + os.sep + "bookNote" + os.sep\
	+ "%s" + os.sep

USERPLANPATH = NOTEINFOR + "userData" + os.sep + "%s" + os.sep + 'plan'  + os.sep

BOOKINDEXPATH = NOTEINFOR + 'userData' + os.sep + '%s'+ os.sep + 'bookIndex.txt'
IDBEGIN = 10000
PLANPATH = NOTEINFOR + 'userData' + os.sep

bookID = 0
# Create your models here.

#check password
def checkPassword(ID,password):
	global IDBEGIN
	lineNum  = int(ID) - IDBEGIN
	# return HttpResponse('ttttt')
	if not note.checkFileExist(NOTEINFOR + ACCOUNT):
		return False

	if lineNum > note.getTotalLine(NOTEINFOR + ACCOUNT):
		return False
	path = NOTEINFOR + ACCOUNT
	linestr = note.getOneLine(path, lineNum)
	linestr = linestr.strip('\n')
	account = linestr.split(',')
	if ID == account[0] and password == account[1]:
		return True
	return False

def saveSession(request,userID):
	request.session[userID] = userID


#save plan infor
def savePlanInfor(request,ID):
	global bookID
	bookID = getFileLines(BOOKINDEXPATH%ID)
	beginTime = time.strftime('%Y%m%d',time.localtime(time.time()))
	bookName = request.GET.get('bookName',None)
	pageNumber = request.GET.get('pageNumber',None)
	planDayNumber = request.GET.get('planDayNumber',None)
	option = request.GET.get('option',None)
	tempPageNumber = request.GET.get('tempPageNumber',None)
	if not tempPageNumber:
		tempPageNumber = '0'
	if not planDayNumber:
		return False
	if option != '3':
		bookID = bookName

		lastLinePath = "noteInfor" + os.sep + "book" + os.sep + bookID + 'LineIndex.txt'
		lastLine = getLastLine(lastLinePath)
		pageNumber = lastLine.strip('\n').split(',')[1]
		if option =='1':
			path = "noteInfor" + os.sep + 'userData' + os.sep + ID + os.sep + 'myFileList.txt'
		elif option == '2':
			path = "noteInfor" + os.sep + 'userData' + os.sep + ID + os.sep + 'weiXinLink.txt'

		bookName = book.getBookName(bookID,path)
		# with open(path,'r') as f:
		line = book.searchBookIndex(bookID,path)
		if line:
			line = line.strip('\n')
			if line:
				line = line.split(',')
				if option =='1':
					tempPageNumber = line[2]
				if option =='2':
					tempPageNumber = line[3]
		if  searchBookIndex(ID,bookID):
			return True
		saveBookIndex(ID,bookID,bookName)
		path = PLANPATH + ID + os.sep + PLAN + os.sep + bookID + '.txt'
		with open(path,'a') as f:
			f.write( beginTime + ',' + pageNumber + ',' + planDayNumber + ',' \
				 + tempPageNumber + ',' + option + '\n')
		return True

	# ID = str(ID)
	if  getBookID(ID,bookName):
		return True
	saveBookIndex(ID,setBookID(),bookName)
	tempID = getBookID(ID,bookName)
	# tempID = '1'
	path = PLANPATH + ID + os.sep + PLAN + os.sep + tempID + '.txt'
	with open(path,'a') as f:
		f.write( beginTime + ',' + pageNumber + ',' + planDayNumber + ',' \
				 + tempPageNumber + ',' + option + '\n')
	return True

def saveBookIndex(ID,bookID,bookName):
	bookID = str(bookID)
	with open(BOOKINDEXPATH%ID,'a') as f:
		f.write(bookID + ',' + bookName + '\n')

def setBookID():
	global bookID
	bookID = bookID + 1
	return bookID


def getPlanInfor(ID):
	returnData = []
	planInforList = {}
	fileList = []
	fileList=os.listdir(USERPLANPATH%ID)
	# fileList.sort(compareFileTime)
	for filename in fileList:
		(filename,extension) = os.path.splitext(filename)
		tempBookID = filename
		bookName = getBookName(ID,tempBookID)
		path = USERPLANPATH%ID + tempBookID + '.txt'
		getFileLines(path)
		with open(path,'r') as f:
			line = f.readline()
			line = line.strip('\n')
			if line:
				line = line.split(',')
				startDay = line[0]
		f.close()
		penultimate = ''
		with open(path,'r') as f:
			allLine = f.readlines()
			if not allLine:
				continue
			linestr = allLine[-1]
			if len(allLine) >=2:
				penultimate = allLine[-2]
		lineInfor = linestr.strip('\n')
		if not lineInfor:
			return returnData
		if penultimate == '':
			yesterday = ''
		else:
			penultimate = penultimate.strip('\n')
			penultimate = penultimate.split(',')
			yesterday = penultimate[3]

		lineInfor = lineInfor.split(',')
		today = time.strftime('%Y%m%d',time.localtime(time.time()))
		if int(lineInfor[0]) < int(today):
			yesterday = lineInfor[3]
		# if tempBookID[0] != 'E':
		planInforList = {'bookName':bookName,'bookID':tempBookID,'pageNumber':lineInfor[1],\
						 'tempPageNumber':lineInfor[3],'startDay':startDay,'planDayNumber':lineInfor[2],\
						 'option':lineInfor[4],'yesterday':yesterday}
		# else:
		# 	planInforList = {'EBookName':bookName,'EBookID':tempBookID,'totalIndex':lineInfor[1],'tempIndex':lineInfor[3]}
		# planInforList['bookName'] = bookName
		# planInforList['bookID'] =tempBookID
		# planInforList['pageNumber'] =lineInfor[1]
		# planInforList['tempPageNumber'] =lineInfor[4]
		returnData.append(planInforList)

	return returnData

# def compareFileTime(x,y):
# 	stat_x = os.stat(x)
# 	stat_y = os.stat(y)
# 	if stat_x.st_ctime < stat_y.st_ctime:
# 		return -1
# 	elif stat_x.st_ctime > stat_y.st_ctime:
# 		return 1
# 	else:
# 		return 0

def updatePlan(request):
	userID = request.GET.get('userID',None)
	tempBookID = request.GET.get('bookID',None)
	addPageNumber = request.GET.get('addPageNumber',None)   #读到页数
	# userID = '10001'
	# tempBookID = '1'
	# addPageNumber = int('100')
	path = USERPLANPATH%userID + tempBookID + '.txt'
	book.updateSchedule(userID,tempBookID,addPageNumber)
	if not note.checkFileExist(path):
		return True
	with open(path,'r') as f:
		linestr = f.readlines()
		if not linestr:
			return True
		linestr = linestr[-1]
	lineInfor = linestr.strip('\n').split(',')
	updateDay = time.strftime('%Y%m%d',time.localtime(time.time()))
	# lineInfor[3] = request.POST.POST.get('oldIndex','0')
	# lineInfor[3] =str(int(lineInfor[3]) + int(addPageNumber))
	if int(lineInfor[3]) <= int(addPageNumber):
		lineInfor[3] = addPageNumber
	if lineInfor[0] == updateDay:
		if delete.deleteOneLine(updateDay,path):
			with open(path,'a') as updateFile:
				updateFile.write(updateDay + ',' + lineInfor[1] + ',' \
								 + lineInfor[2] + ',' + lineInfor[3] + ',' + lineInfor[4] + '\n')
	else:
		with open(path,'a') as updateFile:
			updateFile.write(updateDay + ',' + lineInfor[1] + ',' \
								 + lineInfor[2] + ',' + lineInfor[3] + ',' + lineInfor[4] + '\n')


def getBookName(ID,bookID):
	if searchBookIndex(ID,bookID):
		return searchBookIndex(ID,bookID).strip('\n').split(',')[1]
	return None

def getBookID(ID,name):
	if searchBookIndex(ID,name):
		return searchBookIndex(ID,name).strip('\n').split(',')[0]
	return None

def searchBookIndex(ID,string):
	path = BOOKINDEXPATH
	with open(path%ID,'r') as f:
		bookIndexString = f.readlines()
		for book in bookIndexString:
			for i in book.strip('\n').split(','):
				if string == i:
					return book
	return None

def getFileLines(path):
	with open(path,'r') as f:
		count = len(f.readlines())
	return count

def getLastLine(path):
	temp = ''
	if not note.checkFileExist(path):
		return temp
	with open(path,'r') as f:
		for line in f:
			line = line.strip('\n')
			if line:
				temp = line
	return temp


