#coding:utf-8
import os
import pdb
import sys
reload(sys)
sys.setdefaultencoding("utf-8")
FRIEND = 'noteInfor' + os.sep + "userData" + os.sep + "%s" + os.sep + 'friends.txt'

def addFriend(request):
	ID = request.GET.get('userID',None)
	friendID = request.GET.get('friendID',None)
	friendName = getFriendName(friendID)
	if checkFriend(ID,friendID):
		return True  #friend exist
	with open(FRIEND%ID,'a') as f:
		f.write(friendID + ',' + friendName + '\n')
	f.close()
	return True

def checkFileExist(path):
	if os.path.exists(path):
		return True
	return False

def checkFriend(ID,friendID):
	if not checkFileExist(FRIEND%ID):
		return False     #friend not exist

	with open(FRIEND%ID,'r') as f:
		for friendInfor in f.readlines():
			friendInfor = friendInfor.strip('\n').split(',')
			if friendInfor[0] == friendID:
				return True    #friend exist
	return False

def getFriendList(request):
	friendList = []
	userID = request.GET.get('userID',None)
	with open(FRIEND%userID,'r') as f:
		for friend in f.readlines():
			friend = friend.strip('\n').split(',')
			if friend:
				friendList.append({'friendID':friend[0],'friendName':friend[1]})
	return friendList

def getFriendName(friendID):
	path = 'noteInfor' + os.sep + 'account.txt'
	friendName = ''
	with open(path,'r') as f:
		for line in f.readlines():
			line = line.strip('\n').split(',')
			if line[0] == friendID:
				return line[2]
	return friendName