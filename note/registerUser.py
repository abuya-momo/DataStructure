#coding:utf-8
import os
import pdb
from models import getFileLines
ACCOUNT = 'noteInfor' + os.sep + 'account.txt'

def createUserID():
	path = ACCOUNT
	userID = getFileLines(path)
	userID = userID + 1
	userID = 10000 + userID
	return userID

def register(request):
	returnData = []
	password = request.GET.get('password',None)
	userName = request.GET.get('userName',None)
	userID = createUserID()
	userID = str(userID)
	path = ACCOUNT
	with open(path,'a') as f:
		f.write(userID + ',' + password + ',' + userName +'\n')
	f.close()
	creatUserPath(userID)
	returnData.append({'userID':userID})
	return returnData

def searchFriends(request):
	matchLine = []
	searchStr = request.GET.get('string',None)
	if not searchStr:
		return matchLine

	with open(ACCOUNT,'r') as f:
		for line in f:
			line = line.strip('\n')
			if not line:
				continue
			if kmpMatch(line,searchStr):
				matchLine.append({'userID':line.split(',')[0],'userName':line.split(',')[2]})
	return matchLine


#KMP
def kmpMatch(line,searchStr):
	m = len(line)
	n = len(searchStr)
	cur = 0
	table = partialTable(searchStr)
	while cur<=m-n:
		for i in range(n):
			if line[i+cur]!=searchStr[i]:
				cur += max(i - table[i-1], 1)
				break
		else:
			return True
	return False

#部分匹配表
def partialTable(searchStr):
	ret = [0]
	prefix = set()
	postfix = set()
	# ret = [0]
	for i in range(1,len(searchStr)):
		prefix.add(searchStr[:i])
		postfix = {searchStr[j:i+1] for j in range(1,i+1)}
		ret.append(len((prefix&postfix or {''}).pop()))
	return ret

def creatUserPath(userID):
	root =  'noteInfor' + os.sep + 'userData' + os.sep + userID + os.sep
	os.mkdir(root)
	os.mkdir(root+'bookNote')
	os.mkdir(root+'plan')
	os.mkdir(root+'tempNote')
	path = root+'bookNote' + os.sep + 'lineIndex.txt'
	with open(path,'a') as f:
		f.close()

	path = root+'bookNote' + os.sep + 'noteIndex.txt'
	with open(path,'a') as f:
		f.close()

	path = root+'tempNote' + os.sep + 'tempNote.txt'
	with open(path,'a') as f:
		f.close()
	path = root+'bookIndex.txt'
	with open(path,'a') as f:
		f.close()

	path = root+'friends.txt'
	with open(path,'a') as f:
		f.close()

	path = root+'myFileList.txt'
	with open(path,'a') as f:
		f.close()

	path = root+'share.txt'
	with open(path,'a') as f:
		f.close()

	path = root+'weiXinLink.txt'
	with open(path,'a') as f:
		f.close()
	return True