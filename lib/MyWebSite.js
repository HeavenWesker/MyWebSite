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
$(document).ready(function(){
  propulateTable();
  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
  $('#btnAddUser').on('click', addUser);
  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
  $('#btnUpdateUser').on('click', updateUser);
});
