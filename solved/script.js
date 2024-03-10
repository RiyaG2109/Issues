const form = document.querySelector('#form');
const username = document.querySelector('#username');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const cpassword = document.querySelector('#cpassword');
const gender = document.querySelector('.radio-group input[name="gender"]');

const userListContainer = document.querySelector('#userList');
const users = [];
let index = -1;// -1 means null

form.addEventListener('submit', registerUser);

function onFormInteraction() {
    const submitButton = document.getElementById('submitButton');
    const currentText = submitButton.textContent;

    if (currentText === 'Update') {
        submitButton.textContent = 'update';
        resetForm();
    } else {
        submitButton.textContent = 'Register';
    }
}

function resetForm() {
    form.reset();
    onFormInteraction(); // Switch the button label back to "Register"
    index = -1; // Reset the index after successful form submission
}
function getSelectedGender() {
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    for (const radio of genderRadios) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return ''; // Return an empty string if no gender is selected
}

function registerUser(e) {
    e.preventDefault();

    if (!validateInput(e)) {
        return;
    }

    const user = {
        username: username.value.trim(),
        email: email.value.trim(),
        password: password.value.trim(),
        gender: getSelectedGender(),
    };

    const existingUserIndex = users.findIndex(u => u.email === user.email);

    if (existingUserIndex !== -1 && existingUserIndex !== index) {
        showAlert('User with the same email already exists.');
        return;
    }

    if (index === -1) {
        users.push(user);
        resetForm();
        showAlert('User registered successfully!');
    } else {
        users[index] = user;
        resetForm(); // Call resetForm after successful update
        showAlert('User details updated successfully!');
    }

    displayUsers();
    console.log('Users:', users);
}

// Add a function to set the button label based on the form mode
function setButtonLabel(isUpdateMode) {
    const submitButton = document.getElementById('submitButton');
    submitButton.textContent = isUpdateMode ? 'Update' : 'Register';
}

function showAlert(message) {
    alert(message);
}

// Your existing validation functions...

// Event listeners to remove errors on input change
username.addEventListener('input', () => removeError(username));
email.addEventListener('input', () => removeError(email));
password.addEventListener('input', () => removeError(password));
cpassword.addEventListener('input', () => removeError(cpassword));
gender.addEventListener('input',()=>removeError(gender))

// Event listener for form elements to validate on input change
form.addEventListener('input', (e) => {
    if (e.target.id) {
        validateInput(e.target);
    }
});

// Function to remove errors on input change
function removeError(element) {
    const inputGroup = element.parentElement;
    inputGroup.classList.remove('error');
    const errorElement = inputGroup.querySelector('.error');
    if (errorElement) {
        errorElement.innerText = '';
        validateInput(element); // Validate the input after removing the error
    }
}



function validateEmailFormat(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}



// username.addEventListener('input', () => validateInput(username));
// email.addEventListener('input', () => validateInput(email));
// password.addEventListener('input', () => validateInput(password));
// cpassword.addEventListener('input', () => validateInput(cpassword));
// form.addEventListener('input', () => validateInput(gender));


function validateInput(){
    
    const usernameVal = username.value.trim()
    const emailVal = email.value.trim();
    const passwordVal = password.value.trim();
    const cpasswordVal = cpassword.value.trim();
    const genderVal = gender.value.trim();
    let success = true

    if(usernameVal===''){
        success= false;
        setError(username,'Username is required')
    }else if (!/^[a-zA-Z\s]+$/.test(usernameVal)) {
        setError(username, 'Username can only contain alphabets and spaces');
    }
    else{
        setSuccess(username)
    }

    if(emailVal===''){
        success = false;
        setError(email,'Email is required')
    }
    else if(!validateEmailFormat(emailVal)){
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

    validateGender();
    return success;

}

function validateGender() {
    const errorElement = document.getElementById('gender-error');
    const genderInputs = document.querySelectorAll('.radio-group input[name="gender"]');
    const selectedGender = [...genderInputs].find(input => input.checked);

    if (!selectedGender) {
        setError(document.querySelector('.radio-group'), 'Please select a gender');
    } else {
        setSuccess(document.querySelector('.radio-group'));
    }
}



function setError(element, message) {
    const inputGroup = element.parentElement;
    const errorElement = inputGroup.querySelector('.error');

    errorElement.innerText = message;
    inputGroup.classList.add('error');
    inputGroup.classList.remove('success');
}

function setSuccess(element) {
    const inputGroup = element.parentElement;
    const errorElement = inputGroup.querySelector('.error');

    errorElement.innerText = '';
    inputGroup.classList.add('success');
    inputGroup.classList.remove('error');
}
// Display users on initial load
// displayUsers();

// Function to display users
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
            ${users.map((user, i) => `
                <tr>
                    <td>${i + 1}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.gender}</td>
                    <td>
                        <button class='btn btn-primary' onclick='deleteUser(${i})'>Delete</button>
                        <button class='btn btn-primary' onclick='editUser(${i})'>Edit</button>
                    </td>
                </tr>`).join('')}
        </tbody>`;

    userListContainer.innerHTML = '';
    userListContainer.appendChild(table);
}

// Function to delete user
function deleteUser(i) {
    if (window.confirm('Do you really want to delete?')) {
        users.splice(i, 1);
        displayUsers();
        showAlert('User deleted successfully!');
    }
}

// Function to edit user
function editUser(i) {
    onFormInteraction();
    index = i;
    const user = users[i];
    username.value = user.username;
    email.value = user.email;
    password.value = user.password;
    cpassword.value = user.password;

    // Set the gender based on the user's gender
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    for (const radio of genderRadios) {
        radio.checked = (radio.value === user.gender);
    }

    setButtonLabel(true); // Set the button label to "Update"
    validateGender(); // Validate gender after setting the value
}
