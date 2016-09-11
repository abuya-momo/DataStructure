#coding:utf-8
import os
import time
import book
import models
from bs4 import BeautifulSoup
import urllib2
import re
import note


MYFILELIST = "noteInfor" + os.sep + 'userData' + os.sep + '%s'+ os.sep + "myFileList.txt"
MYSHARE =  "noteInfor" + os.sep + 'userData' + os.sep + '%s'+ os.sep + "share.txt"
EBOOKINDEX = "noteInfor" + os.sep + "book.txt"
FRIEND = 'noteInfor' + os.sep + "userData" + os.sep + "%s" + os.sep + 'friends.txt'
EBOOK = "noteInfor" + os.sep + "book" + os.sep
WEIXINLINK = "noteInfor" + os.sep + 'userData' + os.sep + '%s'+ os.sep + 'weiXinLink.txt'
def getMyFileList(request):
	myFileList = []
	userID = request.GET.get('userID',None)
	with open(MYFILELIST%userID,'r') as f:
		for line in f:
			line = line.strip('\n')
			if not line:
				continue
			line = line.split(',')
			myFileList.append({'resourceID':line[0],'resourceName':line[1]})
	return myFileList

def setShare(request):
	userID = request.GET.get('userID',None)
	resourceID = request.GET.get('resourceID',None)
	path = MYSHARE%userID
	fileListPath = MYFILELIST%userID
	resourceName = book.getBookName(resourceID,fileListPath)
	with open(path,'a') as f:
		shareTime = time.strftime('%Y%m%d',time.gmtime())
		f.write(resourceID + ',' + resourceName + ',' + shareTime)
	return True


#微信相关
def saveWeiXinLink(request):
	userID = request.GET.get('userID',None)
	linkName = request.GET.get('linkName',None)
	link = request.GET.get('link',None)
	schedule = request.GET.get('schedule',None)
	EBookID = models.getFileLines(EBOOKINDEX)
	if not schedule:
		schedule = '0'
	if EBookID==0:
		EBookID = 1
	EBookID = int(EBookID) + 1
	EBookID = 'W' + str(EBookID)
	#爬虫相关
	html = urllib2.urlopen(link)
	html = html.read()
	soup = BeautifulSoup(html,'html.parser')
	title = soup.title.string

	fitStr = "<.*?>"
	pattern = re.compile(fitStr)
	# for child in  soup.find_all('p'):
	path = EBOOK + EBookID + '.txt'
	with open(path,'a') as f:
		for child in  soup.find_all('p'):
			child = pattern.sub('',str(child))
			f.write(child + '\n')
	if not linkName:
		linkName = title

	with open(WEIXINLINK%userID,'a') as f:
		f.write(EBookID + ',' + linkName + ',' + link + ',' + schedule + '\n')
	saveLinkContent(EBookID,linkName,link)
	path = "noteInfor" + os.sep + 'userData' + os.sep + userID + os.sep + 'bookNote' + os.sep + EBookID
	# path = path.strip(os.sep + 'lineIndex.txt')
	
	if not note.checkFileExist(path):
		os.mkdir(path)
	path = path + os.sep + "lineIndex.txt"
	with open(path,'a') as f:
		f.close()
	return True

def getWeixinLink(request):
	userID = request.GET.get('userID',None)
	weiXinLink = []
	with open(WEIXINLINK%userID,'r') as f:
		for link in f:
			link = link.strip('\n')
			if not link:
				continue
			link = link.split(',')
			weiXinLink.append({'resourceID':link[0],'resourceName':link[1],'link':link[2]})
	return weiXinLink



def saveLinkContent(EBookID,linkName,link):
	with open(EBOOKINDEX,'a') as f:
		f.write(EBookID + ',' + linkName + ',' + link + '\n')
	book.initializeEBookIndex(EBookID)
	return True


def getShareContent(request):
	userID = request.GET.get('userID',None)
	shareContent = []
	with open(FRIEND%userID,'r') as friends:
		for friend in friends:
			friend = friend.strip('\n')
			if not friend:
				continue
			friend = friend.split(',')
			with open(MYFILELIST%friend[0],'r') as bookID:
				for ID in bookID:
					ID = ID.strip('\n')
					if not ID:
						continue
					ID = ID.split(',')
					EBookID = ID[0]
					EBookName = ID[1]
					# shareTime = ID[2]
					path = EBOOK + EBookID
					# with open(path,'r') as book:
					# 	bookContent = book.readlines()
					# shareContent.append({'EBookID':EBookID,'EBookName':EBookName,\
					# 					 'shareTime':shareTime,'bookContent':bookContent})
					shareContent.append({'EBookID':EBookID,'EBookName':EBookName})
			with open(WEIXINLINK%friend[0],'r') as bookID:
				for ID in bookID:
					ID = ID.strip('\n')
					if not ID:
						continue
					ID = ID.split(',')
					EBookID = ID[0]
					EBookName = ID[1]
					# shareTime = ID[2]
					path = EBOOK + EBookID
					# with open(path,'r') as book:
					# 	bookContent = book.readlines()
					# shareContent.append({'EBookID':EBookID,'EBookName':EBookName,\
					# 					 'shareTime':shareTime,'bookContent':bookContent})
					shareContent.append({'EBookID':EBookID,'EBookName':EBookName})
	return shareContent

def collectContent(request):
	userID = request.GET.get('userID',None)
	resourceID = request.GET.get('resourceID',None)
	# link = request.GET.get('link','')
	resource = book.searchBookIndex(resourceID,EBOOKINDEX)
	if not resource:
		return False
	schedule = '0'
	if resourceID[0] =='E':
		if book.getBookName(resourceID,MYFILELIST%userID):
			return True
		with open(MYFILELIST%userID,'a') as f:
			f.write(resource.strip('\n') + ',' + schedule + '\n')
	elif resourceID[0] == 'W':
		# myFileID = copyFromBook(resourceID)
		if book.getBookName(resourceID,WEIXINLINK%userID):
			return True
		resource = resource.strip('\n').split(',')
		resource[0] = str(models.getFileLines(EBOOKINDEX))
		resource[0] = 'W' + resource[0]
		if copyFromBook(resourceID,resource[0]):
			with open(WEIXINLINK%userID,'a') as f:
				f.write(resource[0] + ',' + resource[1] + ','  + ',' + schedule + '\n')
			with open(EBOOKINDEX,'a') as f:
				f.write(resource[0] + ',' + resource[1] + ',' + schedule +  '\n')
	return True

def copyFromBook(resourceID,newID):
	path = EBOOK + resourceID + '.txt'
	with open(path,'rb') as f:
		content = f.readlines()
	
	path = EBOOK + newID + '.txt'
	with open(path,'w+') as f:
		for i in content:
			f.write(i)
	return True

# def savaLinkContent(link):
#
