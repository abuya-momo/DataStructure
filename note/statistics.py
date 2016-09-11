#coding:utf-8
import os
import note
import book
PLAN = "noteInfor" + os.sep + 'userData' + os.sep + '%s'+ os.sep + 'plan' + os.sep
BOOKINDEXPATH = "noteInfor" + os.sep + 'userData' + os.sep + '%s'+ os.sep + 'bookIndex.txt'
EBOOKINDEX = "noteInfor" + os.sep + "book.txt"
def getAllPlan(request):
	userID = request.GET.get('userID',None)
	path = PLAN%userID
	returnData = []
	planData = []
	if not note.checkFileExist(path):
		return returnData
	fileList=os.listdir(path)
	if not fileList:
		return returnData
	for filename in fileList:
		with open(path + filename) as f:
			bookID = filename.strip('.txt')
			findPath = BOOKINDEXPATH%userID
			bookName = book.getBookName(bookID,findPath)
			if not bookName:
				findPath = EBOOKINDEX
				bookName = book.getBookName(bookID,findPath)
			for line in f:
				line = line.strip('\n')
				if not line:
					continue
				line = line.split(',')
				planData.append({'updateDay':line[0],\
					 'pageNumber':line[1],'planDayNumber':line[2],'tempPageNumber':line[3],'option':line[4]})
		returnData.append({'bookID':bookID,'bookName':bookName,'plan':planData})
		planData = []
	return returnData