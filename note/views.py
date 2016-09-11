from django.shortcuts import render,render_to_response
from django.http import HttpResponse,HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
import models
import book
import pdb
import json
import registerUser
import friend as Friend
import note
# from note.models import
import share
import sys
import delete
import create
import statistics
# from lxml import etree
from django.utils.encoding import smart_str
reload(sys)
sys.setdefaultencoding("utf-8")
# Create your views here.


# def loginPage(request):
# 	return render(request,'login.html')

def login(request):
	# if checkLogin(request):
	# 	# return HttpResponse("dgddhdh")
	# 	return HttpResponseRedirect('/index/?userID=%s'%request.POST.get('userID',None))


	userID = request.POST.get('userID',None)
	password = request.POST.get('password',None)
	# if userID:
	# 	if checkLogin(request):
	# 		print request.POST.get('userID',None)
	# 		return HttpResponseRedirect('/index/?userID=10001')
	if checkLogin(request):
		return HttpResponseRedirect('/index/?userID=%s'%userID)

	if userID:
		if password:
			if models.checkPassword(userID,password):
				models.saveSession(request,userID)
				return HttpResponseRedirect('/index/?userID=%s'%userID)
			else:
				return HttpResponseRedirect('/error/')
		else:
			return HttpResponseRedirect('/error/')

	return render(request,'login.html')


def checkLogin(request):
	# return render(request,'login.html')
	if request.GET.get('userID',None):
		ID = request.GET.get('userID')
	elif request.POST.get('userID',None):
		ID = request.POST.get('userID')
	else:
		return False
	# return HttpResponse(ID)
	if ID :
		if request.session.get(ID):
			return True
	return False

def index(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')

	if request.GET.get('userID',None):
		ID = request.GET.get('userID')
	elif request.POST.get('userID',None):
		ID = request.POST.get('userID')
	return render(request,'index.html',{'userID':ID})

def plan(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	return render(request,'plan.html')

def addPlan(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	# if not request.GET.get('bookName',None):
	# 	return render(request,'plan.html')
		# return HttpResponseRedirect('/plan/')
	ID = request.GET.get('userID',None)
	# 	ID = request.GET.get('userID',None)
	# ID = request.GET['userID']
	if ID and models.savePlanInfor(request,ID):
		return HttpResponse(json.dumps('success'))
	return HttpResponse(json.dumps('Failed'))
	# return HttpResponse(json.dumps('Failed'))

def getPlan(request):
	# if not checkLogin(request):
	# 	return HttpResponseRedirect('/login/')

	userID = request.GET.get('userID',None)
	if userID:
		returnData = models.getPlanInfor(userID)
		# jsonData = {'bookName':returnData[0],'bookID':returnData[1],'pageNumber':returnData[2],'tempPageNumber':returnData[3]}
		return HttpResponse(json.dumps(returnData) )
	return HttpResponse(json.dumps("Failed"))

def updatePlan(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	# request.GET.get('userID','10001')
	models.updatePlan(request)
	return HttpResponse(json.dumps("success"))

def memo(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	return render(request,'memo.html')


def statisic(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	return  render(request,'statisic.html')

def friend(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	return render(request,'friend.html')


def getBookNote(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')

	userID = request.GET.get('userID',None)
	bookName = request.GET.get('bookName',None)
	timeString = request.GET.get('timeString',None)
	# userID = '10001'
	# bookName = "test"
	# timeString = "20160614"
	note = models.getBookNote(userID,bookName,timeString)

	return render(request,'memo.html',{'note':note})
#
# def memo(request):
# 	pass

def ajaxPlanData(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	if addPlan(request):
		return HttpResponse(json.dumps('success'))
	return HttpResponse(json.dumps('not success'))

@csrf_exempt
def uploadBook(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')

	if request.method == 'POST':
		form = book.UploadFileForm(request.POST, request.FILES)
	# if form.is_valid():
	if book.handleUploadedFile(request.POST['userID'],request.FILES['file'],request):
		# return HttpResponse(json.dumps('success'))
		return HttpResponseRedirect('/yun/?userID=%s'%request.POST.get('userID',None))
	else:
		form = book.UploadFileForm()
 	return render_to_response('uploadBook.html', {'form': form})


def getFileList(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	# request.GET.get('userID',None)
	fileList = book.getFileList(request.GET.get('userID',None))
	return HttpResponse(json.dumps(fileList))

def getEBookContent(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	EBookContent = book.getEBookContent(request)
	if EBookContent:
		# return HttpResponse(EBookContent)
		return HttpResponse(json.dumps(EBookContent))
	return HttpResponse(json.dumps('Failed'))

def createLine(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	if book.createLine(request):
		return HttpResponse(json.dumps('success'))
	return HttpResponse(json.dumps('Failed'))

def getLine(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	lineInfor = book.getLine(request)
	return HttpResponse(json.dumps(lineInfor))

def createMemo(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	if book.createMemo(request):
		return HttpResponse(json.dumps("success"))
	return HttpResponse(json.dumps('Failed'))

def getAllMemo(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	returnData = book.getAllMemo(request)
	return HttpResponse(json.dumps(returnData))


def yun(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	return  render(request,'yun.html')

def EBook(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	return  render(request,'EBook.html')

def getPreEBookContent(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	# userID = request.GET.get('userID','10001')
	returnData =book.getPreEBookContent(request)
	if returnData:
		return HttpResponse(json.dumps(returnData))

	return HttpResponse(json.dumps('Failed'))


def register(request):
	# if not checkLogin(request):
	# 	return HttpResponseRedirect('/login/')
	if not request.GET.get('password',None):
		return render(request,'register.html')
	data = registerUser.register(request)
	return HttpResponse(json.dumps(data))

# def createUserID(request):
# 	data = registerUser.createUserID(request)
# 	if data:
# 		return HttpResponse(json.dumps(data))

def addFriend(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	if Friend.addFriend(request):
		return HttpResponse(json.dumps('success'))
	return HttpResponse(json.dumps('Failed'))

def getFriendList(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	friendList = Friend.getFriendList(request)
	return HttpResponse(json.dumps(friendList))

def error(request):
	# if not checkLogin(request):
	# 	return HttpResponseRedirect('/login/')
	return  render(request,'error.html')

def searchFriends(request):
	# if not checkLogin(request):
	# 	return HttpResponseRedirect('/login/')
	returnData = registerUser.searchFriends(request)
	return HttpResponse(json.dumps(returnData))

def saveTempNote(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	if note.saveTempNote(request):
		return HttpResponse(json.dumps('success'))
	return HttpResponse(json.dumps('Failed'))

def getTempNote(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	returnData = note.getTempNote(request)
	return HttpResponse(json.dumps(returnData))

def getMyFileList(request):
	# if not checkLogin(request):
	# 	return HttpResponseRedirect('/login/')
	returnData = share.getMyFileList(request)
	return HttpResponse(json.dumps(returnData))

def setShare(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	if share.setShare(request):
		return HttpResponse(json.dumps('success'))
	return HttpResponse(json.dumps('Failed'))

def collectContent(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	if share.collectContent(request):
		return HttpResponse(json.dumps('success'))
	else:
		return HttpResponse(json.dumps('Failed'))

def saveWeiXinLink(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	if share.saveWeiXinLink(request):
		return HttpResponse(json.dumps('success'))
	return HttpResponse(json.dumps('Failes'))

def getWeixinLink(request):
	# if not checkLogin(request):
	# 	return HttpResponseRedirect('/login/')
	returnData = share.getWeixinLink(request)
	return HttpResponse(json.dumps(returnData))

def updateSchedule(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	userID = request.GET.get('userID',None)
	bookID = request.GET.get('bookID',None)
	schedule = request.GET.get('schedule',None)
	if book.updateSchedule(userID,bookID,schedule):
		return HttpResponse(json.dumps('success'))
	return HttpResponse(json.dumps('Failed'))

def getShareContent(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	returnData = share.getShareContent(request)
	return HttpResponse(json.dumps(returnData))

def deleteFriend(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	if delete.deleteFriend(request):
		return HttpResponse(json.dumps('success'))
	return HttpResponse(json.dumps('Failed'))

def deleteCollect(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	if delete.deleteCollect(request):
		return HttpResponse(json.dumps('success'))
	return HttpResponse(json.dumps('Failed'))


def deletePage(request):
	if not checkLogin(request):
		return HttpResponseRedirect('/login/')
	return render(request,'delete.html')

def deletePlan(request):
	if delete.deletePlan(request):
		return HttpResponse(json.dumps('success'))
	return HttpResponse(json.dumps('Failed'))

def deleteNote(request):
	if delete.deleteNote(request):
		return HttpResponse(json.dumps('success'))
	return HttpResponse(json.dumps('Failed'))

def createWeiXin(request):
	if create.createWeiXin(request):
		return HttpResponse(json.dumps('success'))
	return HttpResponse(json.dumps('Failed'))

def getAllPlan(request):
	returnData = statistics.getAllPlan(request)
	return HttpResponse(json.dumps(returnData))
#
# def testTrue(request):
# 	echostr = request.GET.get('echostr',None)
# 	return HttpResponse(echostr)

# @csrf_exempt
# def testWeiXin(request):
# 	if request.method == "GET":
# 		ToUserName  = request.POST.get('ToUserName',None)
# 		FromUserName = request.POST.get('FromUserName',None)
# 		CreateTime = request.POST.get('CreateTime',None)
# 		MsgType = request.POST.get('MsgType',None)
# 		Content = request.POST.get('Content',None)
# 		MsgId = request.POST.get('MsgId',None)
# 		test = request.raw_data
# 		if not ToUserName:
# 			ToUserName = ''
# 		if not FromUserName:
# 			FromUserName = ''
# 		if not CreateTime:
# 			CreateTime = ''
# 		if not MsgType:
# 			MsgType = ''
# 		if not Content:
# 			Content = ''
# 		if not MsgId:
# 			MsgId = ''
# 		with open('test.txt','w') as f:
# 			f.write(ToUserName + '\n')
# 			f.write(FromUserName + '\n')
# 			f.write(CreateTime + '\n')
# 			f.write(MsgType + '\n')
# 			f.write(Content + '\n')
# 			f.write(MsgId + '\n')
# 	else:
# 		xml_str = smart_str(request.body)
# 		request_xml = etree.fromstring(xml_str)
# 		with open('xml.txt','w') as f:
# 			f.write(request_xml)
#
# 	return HttpResponse(True)

def deleteLine(request):
	if delete.deleteLine(request):
		return HttpResponse(json.dumps("success"))
	return HttpResponse(json.dumps("Failed"))

def logout(request):
	userID = request.GET.get('userID',None)
	try:
		del request.session[userID]
	except KeyError:
		pass
	return HttpResponseRedirect('/login/')

def getUserAllMemo(request):
	returnData = note.getUserAllMemo(request)
	if returnData:
		return HttpResponse(json.dumps(returnData))
	return HttpResponse(json.dumps('Failed'))

