/*! MyWebSite - v0.0.0 - 2015-05-20
* Copyright (c) 2015 Heaven Wesker; Licensed  */
function propulateTable(){$.getJSON("/users/userlist",function(a){var b="";userListData=a,$.each(a,function(){b+="<tr>",b+='<td><a href="#" class="linkshowuser" rel="'+this.username+'">'+this.username+"</td>",b+="<td>"+this.email+"</td>",b+='<td><a href="#" class="linkdeleteuser" rel="'+this._id+'">delete</a></td>',b+="</tr>"}),$("#userList table tbody").html(b)})}function showUserInfo(a){a.preventDefault();var b=$(this).attr("rel"),c=userListData.map(function(a){return a.username}).indexOf(b),d=userListData[c];$("#userInfoName").text(d.username),$("#userInfoAge").text(d.age),$("#userInfoGender").text(d.gender),$("#userInfoLocation").text(d.location)}function addUser(a){a.preventDefault();var b=0;if($("#addUser input").each(function(){""===$(this).val()&&b++}),0===b){var c={username:$("#addUser input#inputUserName").val(),email:$("#addUser input#inputUserEmail").val(),age:$("#addUser input#inputUserAge").val(),gender:$("#addUser input#inputUserGender").val(),location:$("#addUser input#inputUserLocation").val()};$.ajax({method:"POST",data:c,url:"/users/adduser",dataType:"JSON"}).done(function(a){""===a.msg?($("#addUser input").val(""),propulateTable()):alert("Error: "+a.msg)})}else alert("Error, please input all information")}var userListData=[];$(document).ready(function(){propulateTable(),$("#userList table tbody").on("click","td a.linkshowuser",showUserInfo),$("#btnAddUser").on("click",addUser)});