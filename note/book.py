#coding:utf-8
import os
import time
from django import forms
import pdb
import models
import chardet
import note
import sys
reload(sys)
sys.setdefaultencoding("utf-8")

BOOKPATH = "noteInfor" + os.sep + 'book' + os.sep + '%s' + '.txt'
BOOKINDEXPATH = "noteInfor" + os.sep + 'userData' + os.sep + '%s'+ os.sep + 'bookIndex.txt'
EBOOKINDEX = "noteInfor" + os.sep + "book.txt"
EBOOK = "noteInfor" + os.sep + "book" + os.sep
MYFILELIST = "noteInfor" + os.sep + 'userData' + os.sep + '%s'+ os.sep + "myFileList.txt"
LINEINDEX = "noteInfor" + os.sep + 'userData' + os.sep + '%s'+ os.sep + 'bookNote' + os.sep + '%s' + os.sep + 'lineIndex.txt'
PLAN = "noteInfor" + os.sep + 'userData' + os.sep + '%s'+ os.sep + 'plan' + os.sep + '%s' + '.txt'
NOTEINDEX = "noteInfor" + os.sep + 'userData' + os.sep + '%s'+ os.sep + 'bookNote' + os.sep + 'noteIndex.txt'
NOTE = "noteInfor" + os.sep + 'userData' + os.sep + '%s'+ os.sep + 'bookNote' + os.sep + '%s' + os.sep + '%s' + '.txt'
MEMOPATH =  "noteInfor" + os.sep + 'userData' + os.sep + '%s'+ os.sep + 'bookNote' + os.sep + '%s' + os.sep
WEIXINLINK = "noteInfor" + os.sep + 'userData' + os.sep + '%s'+ os.sep + 'weiXinLink.txt'
class UploadFileForm(forms.Form):
    title = forms.CharField(max_length=50)
    file = forms.FileField()

'''文件上传'''
def handleUploadedFile(userID,f,request):
    file_name = ""
    EBookID = models.getFileLines(EBOOKINDEX)
    if EBookID==0:
        EBookID = 1
    EBookID = int(EBookID)
    EBookID = 'E' + str(EBookID)
    path = EBOOK
    if not os.path.exists(path):
        os.makedirs(path)
    file_name = path + EBookID + '.txt'
    newFileName = request.POST.get('bookName',None)
    if not newFileName:
        newFileName = f.name
    with open(file_name, 'wb+') as destination:
        for chunk in f.chunks():
			predict = chardet.detect(chunk)
			if predict['encoding'] == 'GB2312':
				preCoding = 'GBK'
				chunk = chunk.decode(preCoding).encode('utf-8')
				destination.write(chunk)
			else:
				destination.write(chunk)
	destination.close()
	schedule = '0'
	saveMyFileList(userID,EBookID,newFileName,schedule)
	saveEBookIndex(userID,EBookID,newFileName)
	initializeEBookIndex(EBookID)
	path = "noteInfor" + os.sep + 'userData' + os.sep + userID + os.sep + 'bookNote' + os.sep + EBookID
	# path = path.strip(os.sep + 'lineIndex.txt')
	if not note.checkFileExist(path):
		os.mkdir(path)
	path = path + os.sep + "lineIndex.txt"
	with open(path,'a') as f:
		f.close()
	return True

def saveEBookIndex(userID,EBookID,EBookName):
    with open(EBOOKINDEX,'a') as f:
        f.write(EBookID + ',' + EBookName + '\n')
        f.close()
	return True

def saveMyFileList(userID,EBookID,newFileName,schedule):
	with open(MYFILELIST%userID,'a') as f :
		f.write(EBookID + ',' + newFileName + ',' + schedule + '\n')
		f.close()
	return True

def getFileList(userID):
	# userID = '10001'
	fileList = []
	fileListDict = {}
	with open(MYFILELIST%userID,'r') as f:
		while True:
			lineInfor = f.readline().strip('\n')
			if not lineInfor:
				break
			EBookID = lineInfor.split(',')[0]
			EBookName = lineInfor.split(',')[1]
			fileListDict = {'EBookID':EBookID,'EBookName':EBookName}
			fileList.append(fileListDict)
	return fileList


def getBookName(bookID,path):
	result = searchBookIndex(bookID,path)
	if result:
		return result.strip('\n').split(',')[1]
	return None

def getBookID(name,path):
	result = searchBookIndex(name,path)
	if result:
		return result.strip('\n').split(',')[0]
	return None

def searchBookIndex(string,path):
	# path = BOOKINDEXPATH%ID
	with open(path,'r') as f:
		bookIndexString = f.readlines()
		for book in bookIndexString:
			for i in book.strip('\n').split(','):
				if string == i or ("\xef\xbb\xbf" + string) == i:
					return book
	return None

def getEBookContent(request):
	returnData = []
	content = []
	userID = request.GET.get('userID',None)
	EBookID = request.GET.get('EBookID',None)
	t = request.GET.get('t',None)
	newIndex = request.GET.get('nowIndex',None)
	# userID = request.POST.get('userID','10001')
	# EBookID = request.POST.get('EBookID','E1')
	# t = request.POST.get('t','0')
	# newIndex = request.POST.get('newIndex','0')

	EBookName = getBookName(EBookID,MYFILELIST%userID)
	if not EBookName:
		EBookName = getBookName(EBookID,WEIXINLINK%userID)
	if t=='1':
		if EBookID[0] == 'E':
			path = MYFILELIST%userID
			fitLine = searchBookIndex(EBookID,path)
			if fitLine:
				fitLine = fitLine.strip('\n')
				fitLine = fitLine.split(',')
				nowIndex = int(fitLine[2])
		elif EBookID[0] == 'W':
			path = WEIXINLINK%userID
			fitLine = searchBookIndex(EBookID,path)

			if fitLine:
				fitLine = fitLine.strip('\n')
				fitLine = fitLine.split(',')
				nowIndex = int(fitLine[3])
		# with open(PLAN%(userID,EBookID),'r') as f:
		# 	linestr = f.readlines()[-1]
		# lineInfor = linestr.strip('\n').split(',')
		# nowIndex = int(lineInfor[3])
	else:
		nowIndex = int(newIndex)
	count = 0
	tempIndex = 0
	if not note.checkFileExist(BOOKPATH%EBookID):
		return returnData
	with open(BOOKPATH%EBookID,'r') as f:
		f.seek(nowIndex)
		tempIndex = f.tell()
		
		while True:
			line = f.readline()
			# line = f.readline().strip('\n')
			count = count + 1
			if count>=60 or line=='':
				# content.append({'newIndex':tempIndex})
				break
			content.append({'index':tempIndex,'c':line.strip('\n')})
			tempIndex = f.tell()
		# content.append({'newIndex':f.tell()})
	# pdb.set_trace()
	returnData.append({'data':content,'newIndex':tempIndex,'EBookName':EBookName})
	return returnData

# def setEBookPlan(EBookID):
# 	pass




def createLine(request):
	userID = request.GET.get('userID',None)
	EBOOKID = request.GET.get('EBookID',None)
	start = request.GET.get('start',None)
	over = request.GET.get('over',None)
	paraIndex = request.GET.get('paraIndex',None)
	endParaIndex = request.GET.get('endParaIndex',None)
	# userID = request.POST.get('userID','10001')
	# EBOOKID = request.POST.get('EBookID','E1')
	# start = request.POST.get('start','111')
	# over = request.POST.get('over','999')
	with open(LINEINDEX%(userID,EBOOKID),'a') as f:
		f.write(paraIndex + ',' + endParaIndex + ',' + start + ',' + over + '\n')
	f.close()
	return True

def getLine(request):
	returnData = []
	userID = request.GET.get('userID',None)
	EBookID = request.GET.get('EBookID',None)
	# userID = request.POST.get('userID','10001')
	# EBookID =  request.POST.get('EBookID','E1')
	linestr = ''
	if not note.checkFileExist(LINEINDEX%(userID,EBookID)):
		return returnData
	with open(LINEINDEX%(userID,EBookID),'r') as f:
		linestrInfor = f.readlines()

		for linestr in linestrInfor:
			linestr =linestr.strip('\n')
			if not linestr:
				continue
			linestr = linestr.split(',')
			if not linestr:
				return returnData
			returnData.append({'paraIndex':linestr[0],'endParaIndex':linestr[1], 'start':linestr[2],'over':linestr[3]})
    
	return returnData

# def setEBookPlan(request):
# 	EBookID = request.POST.get('EBookID',None)
# 	pass

def createMemo(request):
	userID = request.GET.get('userID',None)
	BookID = request.GET.get('BookID',None)
	title = request.GET.get('title',None)
	noteContent = request.GET.get('noteContent',None)
	start = request.GET.get('start',None)
	over = request.GET.get('over',None)

	# userID = request.POST.get('userID','10001')
	# BookID = request.POST.get('BookID','E1')
	# title = request.POST.get('title','test Title')
	# noteContent = request.POST.get('noteContent','test NoteContent')
	# start = request.POST.get('start','0')
	# over = request.POST.get('over','0')
	createTime = time.time()
	createTime = str(createTime)
	with open(NOTEINDEX%userID,'a') as f:
		f.write(createTime + ',' + title + ',' + BookID + ',' + start + ',' + over + '\n')
	f.close()

	newPath = "noteInfor" + os.sep + 'userData' + os.sep + '%s'+ os.sep + 'bookNote' + os.sep + '%s' + os.sep
	if not os.path.exists(newPath%(userID,BookID)):
		os.makedirs(newPath%(userID,BookID))
	with open(NOTE%(userID,BookID,createTime),'w') as f:
		f.write(title + '\n')
		f.writelines(noteContent)
	f.close()
	return True

def getAllMemo(request):
	returnData = []
	userID = request.GET.get('userID',None)
	BookID = request.GET.get('BookID',None)
	# userID = request.POST.get('userID','10001')
	# BookID = request.POST.get('BookID','E1')
	path = MEMOPATH%(userID,BookID)
	if not note.checkFileExist(path):
		return returnData
	fileList=os.listdir(path)
	if not fileList:
		return returnData
	for filename in fileList:
		if filename =='lineIndex.txt':
			continue
		with open(path + filename) as f:
			createTime = filename.strip('.txt')
			returnData.append({'title':f.readline(),'noteContent':f.readlines(),'createTime':createTime})
	return returnData

def initializeEBookIndex(EBookID):
	count = 1
	offset = 0
	EBookPath = EBOOK + EBookID + '.txt'
	path = EBOOK + EBookID + 'LineIndex.txt'
	with open(EBookPath,'r') as f:
		with open(path,'a') as file:
			while True:
				line = f.readline()
				if line:
					file.write(str(count) + ',' + str(offset) + '\n')
					count = count + 1
					offset = f.tell()
				else:
					break
	return True



def getPreEBookContent(request):
	nowIndex = request.GET.get('nowIndex',None)
	EBookID = request.GET.get('EBookID',None)
	userID = request.GET.get('userID',None)
	t = request.GET.get('t',None)
	content = []
	returnData = []

	if t=='1':
		if EBookID[0] == 'E':
			path = MYFILELIST%userID
			fitLine = searchBookIndex(EBookID,path)
			if fitLine:
				fitLine = fitLine.strip('\n')
				fitLine = fitLine.split(',')
				nowIndex = int(fitLine[2])
		elif EBookID[0] == 'W':
			path = MYFILELIST%userID
			fitLine = searchBookIndex(EBookID,path)
			if fitLine:
				fitLine = fitLine.strip('\n')
				fitLine = fitLine.split(',')
				nowIndex = int(fitLine[3])


	path = EBOOK + EBookID + 'LineIndex.txt'
	EBookName = getBookName(EBookID,EBOOKINDEX)
	count = 60
	lineCount = 0
	nowLine = 0
	preIndex = '0'
	if not note.checkFileExist(path):
		return returnData
	with open(path,'r') as f:
		for line in f:
			if nowIndex == int(line.strip('\n').split(',')[1]):
				nowLine = int(line.strip('\n').split(',')[0])
				break

	preLineNumber = nowLine - count
	if preLineNumber <= 0:
		preLineNumber = 1

	if preLineNumber != 1:
		with open(path,'r') as f:
			for line in f:
				if preLineNumber == int(line.strip('\n').split(',')[0]):
					preIndex = line.strip('\n').split(',')[1]
					break

	# with open(path,'r') as f:
	# 	if preLineNumber == 1:
	# 		return f.readlines(nowLine)
	# 	else:
	# 		f.seek(preIndex)
	# 		return f.readlines(count)
    #修改过后
	bookIndex = EBOOK + EBookID + 'LineIndex.txt'
	lastLine = models.getLastLine(bookIndex)
	if not lastLine:
		lastLine = ''
	lastLine = lastLine.strip('\n').split(',')
	totalIndex = lastLine[1]
	preIndex = '0'
	with open(EBOOK + EBookID + '.txt','r') as f:
		f.seek(int(preIndex))
		tempIndex = f.tell()
		while True:
			# line = f.readline()
			line = f.readline()
			lineCount = lineCount + 1
			# if lineCount>=60 or (not line) or int(preIndex) >= int(nowIndex) or tempIndex >= int(nowIndex):
			 	# content.append({'newIndex':tempIndex})
			if tempIndex > int(nowIndex):
				break
			content.append({'index':tempIndex,'c':line.strip('\n')})
			tempIndex = f.tell()
	returnData.append({'data':content,'newIndex':tempIndex,'EBookName':EBookName,'totalIndex':totalIndex})
	return returnData

def updateSchedule(userID,bookID,schedule):
	# userID = request.GET.get('userID',None)
	# bookID = request.GET.get('bookID',None)
	# schedule = request.GET.get('schedule',None)
	if bookID[0]=='E':
		path = MYFILELIST%userID
		if not getBookName(bookID,path):
			return False
		else:
			with open(path,'r') as f:
				EbookList =  f.readlines()
			for i in range(len(EbookList)):
				line = EbookList[i]
				line = line.strip('\n')
				if not line:
					continue
				line = line.split(',')
				if bookID == line[0]:
					if int(line[2]) < int(schedule):
						line[2] = schedule
					# line[2] = str(int(schedule) + int(line[2]))
				EbookList[i] = line[0] + ',' + line[1] + ',' + line[2] + '\n'
			with open(path,'w') as f:
				for line in EbookList:
					f.write(line)
			return True
	if bookID[0]=='W':
		path =  "noteInfor" + os.sep + 'userData' + os.sep + userID + os.sep + 'weiXinLink.txt'
		if not getBookName(bookID,path):
			return False
		else:
			with open(path,'r') as f:
				EbookList =  f.readlines()
			for i in range(len(EbookList)):
				line = EbookList[i]
				line = line.strip('\n')
				if not line:
					continue
				line = line.split(',')
				if bookID == line[0]:
					if int(line[3]) < int(schedule):
						line[3] = schedule
				EbookList[i] = line[0] + ',' + line[1] + ',' + line[2] + ',' + line[3] +  '\n'
			with open(path,'w') as f:
				for line in EbookList:
					f.write(line)
			return True
	return True












