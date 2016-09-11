function addNev(userID) {

	$('#wrap')
	.prepend("<div id='top'>\
				<div id='top_main'>\
					<div id='logoBox'>\
						<h1>\
							<a href='../index/' id='index'>阅读计划<span>—— "+ document.title.split('-')[1] +"</span></a>\
						</h1>\
						<img id='logo' src=''>\
					</div>\
					<div id='nev'>\
						<ul id='nev'>\
							<li class='nev'>\
								<a class='nev_a' href='../delete/'>\
									<span class='nev_span'>管理</span>\
								</a>\
							</li>\
							<li class='nev'>\
								<a class='nev_a' href='../plan/'>\
									<span class='nev_span'>计划</span>\
								</a>\
							</li>\
							<li class='nev'>\
								<a class='nev_a' href='../statisic/'>\
									<span class='nev_span'>统计</span>\
								</a>\
							</li>\
							<li class='nev'>\
								<a class='nev_a' href='../friend/'>\
									<span class='nev_span'>好友</span>\
								</a>\
							</li>\
							<li class='nev'>\
								<a class='nev_a' href='../yun/'>\
									<span class='nev_span'>云空间</span>\
								</a>\
							</li>\
						</ul>\
					</div>\
				</div>\
				<a href='../logout/' id='logout'>退出</a>\
			</div>");	
	linkHrefForUserID(userID);
}