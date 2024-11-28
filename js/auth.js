// data.js - Login Submission Handler

async function handleLogin(event) {
    // Prevent the default form submission
    event.preventDefault();

    // Gather form data
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Basic client-side validation
    if (!username || !password || !role) {
        alert('Please fill in all fields');
        return;
    }

    try {
        // Send login request to the backend
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
                role
            })
        });

        // Parse the response
        const result = await response.json();

        // Handle different response scenarios
        if (response.ok) {
            // Successful login
            // Store the authentication token (if provided)
            if (result.token) {
                localStorage.setItem('authToken', result.token);
            }

            // Redirect based on user role
            if (role === 'admin') {
                window.location.href = '../pages/admin.html';
            } else {
                window.location.href = '../pages/user.html';
            }

        } else {
            // Login failed
            alert(result.message || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred. Please try again.');
    }
}

// Optional: Add event listener to the form
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});