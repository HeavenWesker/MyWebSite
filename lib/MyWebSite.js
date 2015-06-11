var userListData = [];
function propulateTable(){
  $.getJSON('/users/userlist', function(data){
    var tableContent = '';
    userListData = data;
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="'+ this.username +'">'+ this.username +'</td>';
      tableContent += '<td>' + this.email + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="'+ this._id +'">delete'+'</a></td>';
      tableContent += '</tr>';
    });
    $('#userList table tbody').html(tableContent);
  });
}
function errAlert(errMessage){
  alert('Error'+errMessage);
}
function showUserInfo(event){
  event.preventDefault();
  var thisUserName = $(this).attr('rel');
  var arrayPosition = userListData.map(function(arrayItem){
    return arrayItem.username;
  }).indexOf(thisUserName);
  var userObj = userListData[arrayPosition];
  $('#userInfoName').text(userObj.username);
  $('#userInfoAge').text(userObj.age);
  $('#userInfoGender').text(userObj.gender);
  $('#userInfoLocation').text(userObj.location);

  $('#updateUser #inputUserId').val(userObj._id);
  $('#updateUser #input-username').val(userObj.username);
  $('#updateUser #input-user-email').val(userObj.email);
  $('#updateUser #inputUserFullName').val(userObj.fullname);
  $('#updateUser #inputUserAge').val(userObj.age);
  $('#updateUser #inputUserGender').val(userObj.gender);
  $('#updateUser #inputUserLocation').val(userObj.location);
}
function addUser(event){
  event.preventDefault();
  var errCount = 0;
  $('#addUser input').each(function(){
    if($(this).val() === ''){
      errCount++;
    }
  });
  if(errCount === 0){
    var newUser = {
      'username': $('#addUser input#input-username').val(),
      'email': $('#addUser input#input-user-email').val(),
      'fullname': $('#addUser input#inputUserFullName').val(),
      'age': $('#addUser input#inputUserAge').val(),
      'gender': $('#addUser input#inputUserGender').val(),
      'location': $('#addUser input#inputUserLocation').val()
    };
    $.ajax({
      method: 'POST',
      data: newUser,
      url: '/users/adduser',
      dataType: 'JSON'
    }).done(function(response){
      if(response.err === undefined){
        $('#addUser input').val('');
        propulateTable();
      }else{
        alert('Error: '+response.err);
      }
    });
  }else{
    alert('Error, please input all information');
  }
}
function deleteUser(event){
  event.preventDefault();
  $.ajax({
    method: 'DELETE',
    url: '/users/deleteuser/' + $(this).attr('rel')
  }).done(function(response){
    if(response.err !== null){
      if(response.msg.n !== 0){
        propulateTable();
      }else{
        //alert('Error: delete not successed');
        errAlert(response.err);
      }
    }else{
      errAlert(response.err);
    }
  });
}
function updateUser(event){
  event.preventDefault();
  if($('#updateUser input#inputUserId').val() !== ''){
    $.ajax({
      method: 'PUT',
      url: '/users/updateuser/'+ $('#updateUser #inputUserId').val(),
      data: {
        'username': $('#updateUser #input-username').val(),
        'email': $('#updateUser #input-user-email').val(),
        'fullname': $('#updateUser #inputUserFullName').val(),
        'age': $('#updateUser #inputUserAge').val(),
        'gender': $('#updateUser #inputUserGender').val(),
        'location': $('#updateUser #inputUserLocation').val()
      }
    }).done(function(response){
      if(response.msg === ''){
        propulateTable();
      }else{
        alert('Error: update not successed');
      }
    });
  }
}
function getMonthWord(monthInt){
  if(monthInt === 0){
    return 'Jan';
  }else if(monthInt === 1){
    return 'Feb';
  }else if(monthInt === 2){
    return 'Mar';
  }else if(monthInt === 3){
    return 'Apr';
  }else if(monthInt === 4){
    return 'May';
  }else if(monthInt === 5){
    return 'Jun';
  }else if(monthInt === 6){
    return 'Jul';
  }else if(monthInt === 7){
    return 'Aug';
  }else if(monthInt === 8){
    return 'Sep';
  }else if(monthInt === 9){
    return 'Oct';
  }else if(monthInt === 10){
    return 'Nov';
  }else if(monthInt === 11){
    return 'Dec';
  }
}
function loadMorePosts(force) {
  console.log('force');
  console.log(force !== undefined);
  if(force === undefined && (window.noMorePosts === true || 
     window.updating === true || 
       window.errorHappened === true)){
    console.log('stop');
    return;
  }
  $('#error-notification').remove();
  window.updating = true;
  $('.spinner').show();
  var data = {};
  data.action = 'old';
  data.oldid = $('.post').last().attr('id').substring(5);
  $.ajax({
    dataType: 'JSON',
    url: '/posts/postlist',
    data: data
  }).done(function(response){
    if(response.err === undefined){
      window.errorHappened = false;
      if(response.length === 0){
        window.noMorePosts = true;
      }
      console.log(response);
      for(var i = 0; i < response.length; i++){
        var ISODate = new Date(response[i].ISODate)
        $('#post-list').append('<div id="post-'+response[i]._id+'" class="post">'+
                                 '<img src="/images/headers/'+response[i].header_image+'.png" class="header-image">'+
                                 '<a class="post-title" href="/post/' + response[i]._id +'">'+response[i].title+'</a>'+
                                 '<p class="post-date">'+
                                 ISODate.getFullYear()+'-'+
                                 getMonthWord(ISODate.getMonth())+'-'+
                                 ISODate.getDate()+
                                 '</p>'+
                               '</div>');
      }
    }
  })
  .fail(function(){
    window.errorHappened = true;
    $('.spinner').before('<div id="error-notification">'+
                         'Network Error'+
                         '<a onclick="loadMorePosts(true)">TryAgain</a>'+
                         '</div>');
  })
  .always(function(){
    $('.spinner').hide();
    window.updating = false;
  })
  ;
}
$(document).ready(function(){
  //propulateTable();
  //$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
  //$('#btnAddUser').on('click', addUser);
  //$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
  //$('#btnUpdateUser').on('click', updateUser);
  $('#pageControl').hide();
});
$(window).scroll(function() {
  if($(window).scrollTop() + $(window).height() == $(document).height()) {
    loadMorePosts();
  }
});
