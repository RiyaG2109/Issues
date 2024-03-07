const form = document.querySelector('#form')
const username = document.querySelector('#username');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const cpassword = document.querySelector('#cpassword');

const userListContainer = document.querySelector('#userList');
// var gender = document.querySelector('.radio-group input[name="gender"]:checked');
const gender = document.forms.form.elements["gender"]
const users = [];

showGender();
function showGender(){
    document.getElementById('results').innerHTML = gender.value;
}

// function getSelectedGender() {
//     // for (const input of genderInputs) {
//     //     if (input.checked) {
//     //         return input.value;
//     //     }
//     // }
//     // return null;

//     document.form.onclick = function(){
//         var genderVal = document.querySelector('input[name = gender]:checked').value;;
//         result.innerHTML = genderVal;
//     }
// }

function registerUser(e) {
    e.preventDefault();

    if (!validateInputs()) {
        return;
    }

    const user = {
        username: username.value.trim(),
        email: email.value.trim(),
        password: password.value.trim(),
        gender: showGender(),
    };

    const existingUser = users.find(user => user.email === email.value.trim());
    if (existingUser) {
        showAlert('User with the same email already exists.');
        return;
    }

    users.push(user);

    displayUsers();
    console.log('Users:', users);

    username.value = '';
    email.value = '';
    password.value = '';
    cpassword.value = '';

    showAlert('User registered successfully!');
}


form.addEventListener('submit', registerUser);




function showAlert(message) {
    alert(message);
}

function validateInputs(){
    

    const usernameVal = username.value.trim()
    const emailVal = email.value.trim();
    const passwordVal = password.value.trim();
    const cpasswordVal = cpassword.value.trim();
    let success = true

    if(usernameVal===''){
        success=false;
        setError(username,'Username is required')
    }
    else{
        setSuccess(username)
    }

    if(emailVal===''){
        success = false;
        setError(email,'Email is required')
    }
    else if(!validateEmail(emailVal)){
        success = false;
        setError(email,'Please enter a valid email')
    }
    else{
        setSuccess(email)
    }

    if(passwordVal === ''){
        success= false;
        setError(password,'Password is required')
    }
    else if(passwordVal.length<8){
        success = false;
        setError(password,'Password must be atleast 8 characters long')
    }
    else{
        setSuccess(password)
    }

    if(cpasswordVal === ''){
        success = false;
        setError(cpassword,'Confirm password is required')
    }
    else if(cpasswordVal!==passwordVal){
        success = false;
        setError(cpassword,'Password does not match')
    }
    else{
        setSuccess(cpassword)
    }
    return success;

}
function print(){
    const messageElement = document.getElementById("message"); 
    messageElement.textContent = "Registred Users"; 
    messageElement.style.color="black";
}

function displayUsers() {
    const table = document.createElement('table');
    table.innerHTML = `
                        <thead>
                          <tr>
                            <th>UserNo</th>
                              <th>Username</th>
                              <th>Email</th>
                              <th>Gender</th>
                              <th>Action</th>
                              
                          </tr>
                      </thead>
                      <tbody>
                          ${users.map((user,index) => `
                              <tr>
                                <td>${index+1}</td>
                                  <td>${user.username}</td>
                                  <td>${user.email}</td>
                                  <td>${user.gender}</td>
                                  <td>
                                    <button class='btn btn-primary' id="ok" onClick='functionToExecute(event)'>Delete</button>
                                 <button class='btn btn-primary' id='edit' onClick='editForm(event)'>Edit</button></td>
                              </tr>`).join('')}
                      </tbody>`;
    userListContainer.innerHTML = '';
    userListContainer.appendChild(table);
}

function functionToExecute(event) {
    const clickedButton = event.target;
    const parentRow = clickedButton.parentNode.parentNode;
    const emailToDelete = parentRow.querySelector('td:nth-child(3)').textContent;

    
    const indexToDelete = users.findIndex(user => user.email === emailToDelete);

    if (indexToDelete !== -1) {
        
        users.splice(indexToDelete, 1);

        
        
        if (window.confirm("Do you really want to delete?")) {
            console.log('Users:', users);
            displayUsers();
          }    
        
    }
    
    showAlert('User deleted successfully!');
}


function editForm(event) {
    const clickedButton = event.target;
    const parentRow = clickedButton.parentNode.parentNode;
    const index = Array.from(parentRow.parentNode.children).indexOf(parentRow);
    const userAtIndex = users[index];

    
    username.value = userAtIndex['username'];
    email.value = userAtIndex['email'];
    password.value = userAtIndex['password'];
    cpassword.value = userAtIndex['password']; 

    
    

    
    displayUsers();

    
    // form.removeEventListener('submit', registerUser);
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateInputs()) {
            return;
        }

        const updatedUser = {
            username: username.value.trim(),
            email: email.value.trim(),
            password: password.value.trim(),
        };

        
        users.push(updatedUser);

        users.splice(index, 1);
        displayUsers();
        console.log('Users:', users);

        
        form.reset();
        showAlert('User details updated successfully!');
    });
    
}


function setError(element,message){
    const inputGroup = element.parentElement;
    const errorElement = inputGroup.querySelector('.error')

    errorElement.innerText = message;
    inputGroup.classList.add('error')
    inputGroup.classList.remove('success')
}

function setSuccess(element){
    const inputGroup = element.parentElement;
    const errorElement = inputGroup.querySelector('.error')

    errorElement.innerText = '';
    inputGroup.classList.add('success')
    inputGroup.classList.remove('error')
}

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };