#coding:utf-8
from django.shortcuts import render
import os
from django.http import HttpResponse

NOTEINFOR = ".." + os.sep +  "noteInfor" + os.sep    #../noteInfor/      linux
FRIENDS = "friends.txt"
INTRODUCE = "introduce.txt"


NUMBER = 10000

def register(ID,username,password):
	with open('count.txt','a') as f:
		f.write(ID + ',' + username + ',' + password + '&\n')
	f.close()

def addUser(request):
	global NUMBER
	username = request.GET.get('username',None)
	password = request.GET.get('password',None)
	ID = NUMBER + 1
	register(ID,username,password)


def addFriends(ID,friendID):
	if checkFriend(ID,friendID):
		HttpResponse("friend is exist")   #friend exist

	with open((NOTEINFOR + ID + FRIENDS),'a') as f:
		f.write(friendID + ',')
	f.close()

def checkFileExist(path):
	if os.path.exists(path):
		return True
	return False

def checkFriend(ID,friendID):
	if not checkFileExist(ID + os.sep + FRIENDS):
		return False     #friend not exist

	with open((ID + os.sep + FRIENDS),'r') as f:
		friendInfor = f.readline()
		friendInfor = friendInfor.split(',')
		for friend in friendInfor:
			if friend == friendID:
				return True    #friend exist
	return False

def checkIntroduce(ID):
	return checkFileExist(ID + os.sep + FRIENDS)

def getIntroduce(ID):
	if not checkIntroduce(ID):
		return None

	with open((NOTEINFOR + os.sep + INTRODUCE),'r') as f:
		introduce = f.readlines()
	f.close()
	return introduce

def setIntroduce(ID,introduce):
	with open((NOTEINFOR + ID + os.sep + INTRODUCE),'w') as f:
		f.writelines(introduce)
	f.close()













