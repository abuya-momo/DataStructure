#coding:utf-8
import os
import models
import book
import delete
import note
EBOOKINDEX = "noteInfor" + os.sep + "book.txt"
EBOOK = "noteInfor" + os.sep + "book" + os.sep
WEIXINFILEPATH = 'noteInfor' + os.sep + "userData" + os.sep + "%s" + os.sep + 'weiXinLink.txt'
BOOKINDEXPATH = "noteInfor" + os.sep + 'userData' + os.sep + '%s'+ os.sep + 'bookIndex.txt'
def createWeiXin(request):
	userID = request.GET.get('userID',None)
	articleName = request.GET.get('articleName',None)
	content = request.GET.get('content',None)
	link = request.GET.get('link','')
	resourceID = models.getFileLines(EBOOKINDEX)
	resourceID = 'W' + str(resourceID)
	path = EBOOK + resourceID + '.txt'
	schedule = '0'
	with open(path,'w') as f:
		f.write(content)
	path = EBOOKINDEX
	with open(path,'a') as f:
		# f.write(resourceID + ',' + articleName + ','  + userID + '\n')
		f.write(resourceID + ',' + articleName + '\n')
	# book.saveEBookIndex(userID,resourceID,articleName)
	path = WEIXINFILEPATH%userID
	with open(path,'a') as f:
		f.write(resourceID + ',' + articleName + ',' + link + ',' + schedule + '\n')
	book.initializeEBookIndex(resourceID)

	path = "noteInfor" + os.sep + 'userData' + os.sep + userID + os.sep + 'bookNote' + os.sep + resourceID
	# path = path.strip(os.sep + 'lineIndex.txt')
	
	if not note.checkFileExist(path):
		os.mkdir(path)
	path = path + os.sep + "lineIndex.txt"
	with open(path,'a') as f:
		f.close()
	return True

# def changeWeiXinContent(request):
# 	userID = request.GET.get('userID',None)
# 	articleName = request.GET.get('articleName',None)
# 	content = request.GET.get('content',None)
# 	resourceID = request.GET.get('resourceID',None)
# 	path = WEIXINFILEPATH%userID
# 	schedule = '0'
# 	if not book.searchBookIndex(resourceID,path):
# 		return False
# 	path = EBOOK + resourceID + '.txt'
# 	with open(path,'w') as f:
# 		f.write(content)
# 	path = EBOOKINDEX
# 	line = book.searchBookIndex(resourceID,EBOOKINDEX)
# 	if not line:
# 		return False
# 	delete.deleteOneLine(resourceID,path)
# 	line = line.strip('\n').split(',')
# 	line[-1] = userID
# 	with open(path,'a') as f:
# 		f.write(line[0] + ',' + line[1] + ',' + line[2] + ',' + line[3] + '\n')
# 	path = WEIXINFILEPATH%userID
# 	line = book.searchBookIndex(resourceID,path)
# 	if line:
# 		delete.deleteOneLine(resourceID,path)
# 	line = line.strip('\n').split(',')
# 	line[-2] = schedule
# 	with open(path,'a') as f:
# 		f.write(line[0] + ',' + line[1] + ',' + line[2] + ',' + line[3] + ',' + line[4] + '\n')


