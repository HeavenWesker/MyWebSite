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
  $('#updateUser #inputUserName').val(userObj.username);
  $('#updateUser #inputUserEmail').val(userObj.email);
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
      'username': $('#addUser input#inputUserName').val(),
      'email': $('#addUser input#inputUserEmail').val(),
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
      if(response.msg === ''){
        $('#addUser input').val('');
        propulateTable();
      }else{
        alert('Error: '+response.msg);
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
    if(response.msg === ''){
      propulateTable();
    }else{
      alert('Error: delete not successed');
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
        'username': $('#updateUser #inputUserName').val(),
        'email': $('#updateUser #inputUserEmail').val(),
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
