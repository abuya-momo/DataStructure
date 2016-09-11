"""readingPlan URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import include, url
from django.contrib import admin
#
# urlpatterns = [
#     url(r'^admin/', include(admin.site.urls)),
#     url(r'^login/$', 'note.views.login',name='login'),
#     url(r'^index/$', 'note.views.index',name='index'),
#     url(r'^plan/$', 'note.views.addPlan',name='addPlan'),
#     url(r'^memo/$', 'note.views.getBookNote',name='memo'),
#     url(r'^getBookNote/$', 'note.views.getBookNote',name='getBookNote'),
#     url(r'^ajaxPlanData/$', 'note.views.ajaxPlanData',name='ajaxPlanData'),
# 	url(r'^getPlan/', 'note.views.getPlan',name='getPlan'),
# 	url(r'^updatePlan/', 'note.views.updatePlan',name='updatePlan'),
# ]


urlpatterns = [
	url(r'^admin/', include(admin.site.urls)),
	# url(r'^getlogin/$', 'note.views.login1',name='getlogin'),
	url(r'^login/$', 'note.views.login',name='login'),
	url(r'^logout/$', 'note.views.logout',name='logout'),
	url(r'^index/$', 'note.views.index',name='index'),
	url(r'^plan/$', 'note.views.plan',name='plan'),
	# url(r'^plan/$', 'note.views.addPlan',name='addPlan'),
	# url(r'^memo/$', 'note.views.getBookNote',name='memo'),
	# url(r'^getBookNote/$', 'note.views.getBookNote',name='getBookNote'),
	url(r'^ajaxPlanData/$', 'note.views.ajaxPlanData',name='ajaxPlanData'),
	url(r'^getPlan/$', 'note.views.getPlan',name='getPlan'),
	url(r'^updatePlan/$', 'note.views.updatePlan',name='updatePlan'),
	url(r'^memo/$', 'note.views.memo',name='memo'),
	url(r'^addPlan/$', 'note.views.addPlan',name='addPlan'),
	# url(r'^plan/$', 'note.views.plan',name='plan'),
	url(r'^statisic/$', 'note.views.statisic',name='statisic'),
	url(r'^friend/$', 'note.views.friend',name='friend'),
	url(r'^uploadBook/$', 'note.views.uploadBook',name='uploadBook'),
	url(r'^getFileList/$', 'note.views.getFileList',name='getFileList'),
	url(r'^getEBookContent/$', 'note.views.getEBookContent',name='getEBookContent'),
	url(r'^createLine/$', 'note.views.createLine',name='createLine'),
	url(r'^getLine/$', 'note.views.getLine',name='getLine'),
	# url(r'^createUserID/$', 'note.views.createUserID',name='createUserID'),
	url(r'^register/$', 'note.views.register',name='register'),
	url(r'^createMemo/$', 'note.views.createMemo',name='createMemo'),
	url(r'^getAllMemo/$', 'note.views.getAllMemo',name='getAllMemo'),
	url(r'^yun/$', 'note.views.yun',name='yun'),
	url(r'^EBook/$', 'note.views.EBook',name='EBook'),
	url(r'^getPreEBookContent/$', 'note.views.getPreEBookContent',name='getPreEBookContent'),
	url(r'^addFriend/$', 'note.views.addFriend',name='addFriend'),
	url(r'^getFriendList/$', 'note.views.getFriendList',name='getFriendList'),
	url(r'^error/$', 'note.views.error',name='error'),
	url(r'^searchFriends/$', 'note.views.searchFriends',name='searchFriends'),
	url(r'^saveTempNote/$', 'note.views.saveTempNote',name='saveTempNote'),
	url(r'^getTempNote/$', 'note.views.getTempNote',name='getTempNote'),
	url(r'^getMyFileList/$', 'note.views.getMyFileList',name='getMyFileList'),
	url(r'^setShare/$', 'note.views.setShare',name='setShare'),
	url(r'^saveWeiXinLink/$', 'note.views.saveWeiXinLink',name='saveWeiXinLink'),
	url(r'^getWeixinLink/$', 'note.views.getWeixinLink',name='getWeixinLink'),
	url(r'^updateSchedule/$', 'note.views.updateSchedule',name='updateSchedule'),
	url(r'^getShareContent/$', 'note.views.getShareContent',name='getShareContent'),
	url(r'^collectContent/$', 'note.views.collectContent',name='collectContent'),
	url(r'^deleteFriend/$', 'note.views.deleteFriend',name='deleteFriend'),
	url(r'^deleteCollect/$', 'note.views.deleteCollect',name='deleteCollect'),
	url(r'^delete/$', 'note.views.deletePage',name='delete'),
	url(r'^deleteNote/$', 'note.views.deleteNote',name='deleteNote'),
	url(r'^deletePlan/$', 'note.views.deletePlan',name='deletePlan'),
	# url(r'^createWeiXin/$', 'note.views.createWeiXin',name='createWeiXin'),
	url(r'^createWeiXin/$', 'note.views.saveWeiXinLink',name='createWeiXin'),

	url(r'^getAllPlan/$', 'note.views.getAllPlan',name='getAllPlan'),
	# url(r'^testTrue/$', 'note.views.testTrue',name='testTrue'),
	# url(r'^testWeiXin/$', 'note.views.testWeiXin',name='testWeiXin'),
	url(r'^deleteLine/$', 'note.views.deleteLine',name='deleteLine'),
	url(r'^getUserAllMemo/$', 'note.views.getUserAllMemo',name='getUserAllMemo'),

]