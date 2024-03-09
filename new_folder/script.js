const form = document.querySelector('#form');
const username = document.querySelector('#username');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const cpassword = document.querySelector('#cpassword');
const userListContainer = document.querySelector('#userList');
const gender = document.forms.form.elements['gender'];
const users = [];
let success = true; // Declare the success variable
let index = -1; // Declare the index variable for tracking the edited user

function registerUser(e) {
    e.preventDefault();

    if (!validateInputs()) {
        return;
    }

    const user = {
        username: username.value.trim(),
        email: email.value.trim(),
        password: password.value.trim(),
        gender: gender.value,
    };

    const existingUser = users.find((user) => user.email === email.value.trim());
    if (existingUser && index === -1) {
        showAlert('User with the same email already exists.');
        return;
    }

    if (index === -1) {
        users.push(user);
    } else {
        users[index] = user;
        index = -1; // Reset the index after updating the user
        onFormInteraction(); // Reset the form back to registration mode
    }

    displayUsers();
    console.log('Users:', users);

    username.value = '';
    email.value = '';
    password.value = '';
    cpassword.value = '';

    showAlert('User registered successfully!');
}


function updateUser(event) {
    event.preventDefault();

    const updatedUsername = username.value.trim();
    const updatedEmail = email.value.trim();
    const updatedPassword = password.value.trim();
    const updatedCPassword = cpassword.value.trim();

    users[index]['username'] = updatedUsername;
    users[index]['email'] = updatedEmail;
    users[index]['password'] = updatedPassword;
    users[index]['cpassword'] = updatedCPassword;

    users.splice(index, 1);

    displayUsers();
    showAlert('User details updated successfully!');
    form.reset();
}


function editForm(event) {
    onFormInteraction();
    const clickedButton = event.target;
    const parentRow = clickedButton.parentNode.parentNode;
    index = Array.from(parentRow.parentNode.children).indexOf(parentRow);
    const userAtIndex = users[index];

    username.value = userAtIndex['username'];
    email.value = userAtIndex['email'];
    password.value = userAtIndex['password'];
    cpassword.value = userAtIndex['password'];

    displayUsers();

    form.removeEventListener('submit', registerUser); // Remove the registerUser listener
    form.addEventListener('submit', updateUser); // Add the updateUser listener
}

form.addEventListener('submit', registerUser);

function onFormInteraction() {
    const submitButton = document.getElementById('submitButton');
    const currentText = submitButton.textContent;

    if (currentText === 'Update') {
        submitButton.textContent = 'Register';
    } else {
        submitButton.textContent = 'Update';
    }
}

function showAlert(message) {
    alert(message);
}

username.addEventListener('input', () => removeError(username));
email.addEventListener('input', () => removeError(email));
password.addEventListener('input', () => removeError(password));
cpassword.addEventListener('input', () => removeError(cpassword));

function removeError(element) {
    const inputGroup = element.parentElement;
    inputGroup.classList.remove('error');
    const errorElement = inputGroup.querySelector('.error');
    if (errorElement) {
        errorElement.innerText = '';
        validateInput(element); // Validate the input after removing the error
    }
}

function validateInput(element) {
    const inputGroup = element.parentElement;
    const errorElement = inputGroup.querySelector('.error');

    if (element.id === 'username') {
        validateUsername(element);
    } else if (element.id === 'email') {
        validateEmail(element);
    } else if (element.id === 'password') {
        validatePassword(element);
    } else if (element.id === 'cpassword') {
        validateConfirmPassword(element);
    }
}

function validateUsername(element) {
    const usernameValue = username.value.trim(); // Trim to remove leading and trailing spaces
    const errorElement = document.getElementById('username-error');

    if (usernameValue === '') {
        setError(element, 'Username is required');
    } else if (!/^[a-zA-Z\s]+$/.test(usernameValue)) {
        setError(element, 'Username can only contain alphabets and spaces');
    } else {
        setSuccess(element);
    }
}

function validateEmail(element) {
    if (element.value === '') {
        setError(element, 'Email is required');
    } else if (!validateEmailFormat(element.value)) {
        setError(element, 'Please enter a valid email');
    } else {
        setSuccess(element);
    }
}

function validatePassword(element) {
    if (element.value === '') {
        setError(element, 'Password is required');
    } else if (element.value.length < 8) {
        setError(element, 'Password must be at least 8 characters long');
    } else {
        setSuccess(element);
    }
}

function validateConfirmPassword(element) {
    if (element.value === '') {
        setError(element, 'Confirm password is required');
    } else if (element.value !== password.value) {
        setError(element, 'Password does not match');
    } else {
        setSuccess(element);
    }
}

function validateEmailFormat(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateGender() {
    const selectedGender = gender.value;
    const errorElement = document.getElementById('gender-error');

    if (!selectedGender) {
        setError(gender, 'Please select a gender');
    } else {
        setSuccess(gender);
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

function validateInputs() {
    validateUsername(username);
    validateEmail(email);
    validatePassword(password);
    validateConfirmPassword(cpassword);
    validateGender();

    return !document.querySelector('.error');
}

function showGender() {
    removeGenderError(); // Remove gender error when showing the gender
}

function removeGenderError() {
    const errorElement = document.getElementById('gender-error');
    errorElement.innerText = '';
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
            ${users.map((user, i) => `
                <tr>
                    <td>${i + 1}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.gender}</td>
                    <td>
                        <button class='btn btn-primary' id="ok" onClick='functionToExecute(event)'>Delete</button>
                        <button class='btn btn-primary' id='edit' onClick='editForm(event)'>Edit</button>
                    </td>
                </tr>`).join('')}
        </tbody>`;

    userListContainer.innerHTML = '';
    userListContainer.appendChild(table);
}

function functionToExecute(event) {
    const clickedButton = event.target;
    const parentRow = clickedButton.parentNode.parentNode;
    const emailToDelete = parentRow.querySelector('td:nth-child(3)').textContent;

    const indexToDelete = users.findIndex((user) => user.email === emailToDelete);

    if (indexToDelete !== -1) {
        users.splice(indexToDelete, 1);

        if (window.confirm('Do you really want to delete?')) {
            console.log('Users:', users);
            displayUsers();
        }
    }

    showAlert('User deleted successfully!');
}
