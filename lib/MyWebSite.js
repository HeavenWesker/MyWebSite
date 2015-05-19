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
$(document).ready(function(){
  propulateTable();
  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
  $('#btnAddUser').on('click', addUser);
});
