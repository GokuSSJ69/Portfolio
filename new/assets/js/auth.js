/**
 * Authentication Form Handling
 * Uses localStorage for client-side authentication
 */

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true';
}

// Get current user
function getCurrentUser() {
  const userData = localStorage.getItem('currentUser');
  return userData ? JSON.parse(userData) : null;
}

// Set login state
function setLoginState(user) {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('currentUser', JSON.stringify(user));
}

// Logout function
function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// Check if already logged in and redirect
if (isLoggedIn()) {
  if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) {
    window.location.href = 'front.html';
  }
}

// Password toggle functionality
const passwordToggles = document.querySelectorAll('.password-toggle');

passwordToggles.forEach(toggle => {
  toggle.addEventListener('click', function() {
    const input = this.parentElement.querySelector('input');
    const icon = this.querySelector('ion-icon');
    
    if (input.type === 'password') {
      input.type = 'text';
      icon.setAttribute('name', 'eye-off-outline');
    } else {
      input.type = 'password';
      icon.setAttribute('name', 'eye-outline');
    }
  });
});

// Email validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation (minimum 8 characters, at least one letter and one number)
function validatePassword(password) {
  const minLength = 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return password.length >= minLength && hasLetter && hasNumber;
}

// Show error message
function showError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const errorElement = document.getElementById(errorId);
  
  if (errorElement) {
    errorElement.textContent = message;
    input.style.borderColor = 'var(--bg-red-salsa)';
  }
}

// Clear error message
function clearError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const errorElement = document.getElementById(errorId);
  
  if (errorElement) {
    errorElement.textContent = '';
    input.style.borderColor = '';
  }
}

// Login form handling
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    let isValid = true;
    
    // Clear previous errors
    clearError('loginEmail', 'emailError');
    clearError('loginPassword', 'passwordError');
    
    // Validate email
    if (!email) {
      showError('loginEmail', 'emailError', 'Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      showError('loginEmail', 'emailError', 'Please enter a valid email address');
      isValid = false;
    }
    
    // Validate password
    if (!password) {
      showError('loginPassword', 'passwordError', 'Password is required');
      isValid = false;
    } else if (password.length < 6) {
      showError('loginPassword', 'passwordError', 'Password must be at least 6 characters');
      isValid = false;
    }
    
    if (isValid) {
      // Check if user exists in localStorage (from signup)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Logging in...</span>';
      submitBtn.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        if (user) {
          // User found, login successful
          setLoginState(user);
          submitBtn.innerHTML = '<span>Login successful! Redirecting...</span>';
          setTimeout(() => {
            // Check for redirect parameter
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect');
            if (redirect === 'booking') {
              // Get booking params from URL if available
              const bookingParams = new URLSearchParams(window.location.search);
              const destination = bookingParams.get('destination');
              const location = bookingParams.get('location');
              const price = bookingParams.get('price');
              
              if (destination && location && price) {
                window.location.href = `booking.html?destination=${encodeURIComponent(destination)}&location=${encodeURIComponent(location)}&price=${price}`;
              } else {
                window.location.href = 'booking.html';
              }
            } else if (user.role === 'admin' && document.getElementById('admin').checked) {
              window.location.href = 'admin.html';
            } else {
              window.location.href = 'front.html';
            }
          }, 1000);
        } else {
          // User not found or wrong password
          showError('loginPassword', 'passwordError', 'Invalid email or password');
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      }, 1000);
    }
  });
  
  // Real-time validation
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  
  if (loginEmail) {
    loginEmail.addEventListener('blur', function() {
      const email = this.value.trim();
      if (email && !validateEmail(email)) {
        showError('loginEmail', 'emailError', 'Please enter a valid email address');
      } else {
        clearError('loginEmail', 'emailError');
      }
    });
  }
  
  if (loginPassword) {
    loginPassword.addEventListener('blur', function() {
      const password = this.value;
      if (password && password.length < 6) {
        showError('loginPassword', 'passwordError', 'Password must be at least 6 characters');
      } else {
        clearError('loginPassword', 'passwordError');
      }
    });
  }
}

// Signup form handling
const signupForm = document.getElementById('signupForm');

if (signupForm) {
  signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const terms = document.getElementById('terms').checked;
    
    let isValid = true;
    
    // Clear previous errors
    clearError('signupName', 'nameError');
    clearError('signupEmail', 'emailError');
    clearError('signupPassword', 'passwordError');
    clearError('signupConfirmPassword', 'confirmPasswordError');
    
    // Validate name
    if (!name) {
      showError('signupName', 'nameError', 'Name is required');
      isValid = false;
    } else if (name.length < 2) {
      showError('signupName', 'nameError', 'Name must be at least 2 characters');
      isValid = false;
    }
    
    // Validate email
    if (!email) {
      showError('signupEmail', 'emailError', 'Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      showError('signupEmail', 'emailError', 'Please enter a valid email address');
      isValid = false;
    }
    
    // Validate password
    if (!password) {
      showError('signupPassword', 'passwordError', 'Password is required');
      isValid = false;
    } else if (!validatePassword(password)) {
      showError('signupPassword', 'passwordError', 'Password must be at least 8 characters with letters and numbers');
      isValid = false;
    }
    
    // Validate confirm password
    if (!confirmPassword) {
      showError('signupConfirmPassword', 'confirmPasswordError', 'Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      showError('signupConfirmPassword', 'confirmPasswordError', 'Passwords do not match');
      isValid = false;
    }
    
    // Validate terms
    if (!terms) {
      alert('Please accept the Terms & Conditions');
      isValid = false;
    }
    
    if (isValid) {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some(u => u.email === email);
      
      if (userExists) {
        showError('signupEmail', 'emailError', 'Email already registered. Please login instead.');
        return;
      }
      
      // Create user object
      const user = {
        name: name,
        email: email,
        password: password, // In real app, this would be hashed
        role: document.getElementById('admin').checked ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      };
      
      // Save user to localStorage
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Show success message
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Creating account...</span>';
      submitBtn.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        submitBtn.innerHTML = '<span>Account created! Redirecting to login...</span>';
        setTimeout(() => {
          window.location.href = 'login.html?signup=success';
        }, 1000);
      }, 1000);
    }
  });
  
  // Real-time validation
  const signupName = document.getElementById('signupName');
  const signupEmail = document.getElementById('signupEmail');
  const signupPassword = document.getElementById('signupPassword');
  const signupConfirmPassword = document.getElementById('signupConfirmPassword');
  
  if (signupName) {
    signupName.addEventListener('blur', function() {
      const name = this.value.trim();
      if (name && name.length < 2) {
        showError('signupName', 'nameError', 'Name must be at least 2 characters');
      } else {
        clearError('signupName', 'nameError');
      }
    });
  }
  
  if (signupEmail) {
    signupEmail.addEventListener('blur', function() {
      const email = this.value.trim();
      if (email && !validateEmail(email)) {
        showError('signupEmail', 'emailError', 'Please enter a valid email address');
      } else {
        clearError('signupEmail', 'emailError');
      }
    });
  }
  
  if (signupPassword) {
    signupPassword.addEventListener('blur', function() {
      const password = this.value;
      if (password && !validatePassword(password)) {
        showError('signupPassword', 'passwordError', 'Password must be at least 8 characters with letters and numbers');
      } else {
        clearError('signupPassword', 'passwordError');
      }
    });
  }
  
  if (signupConfirmPassword) {
    signupConfirmPassword.addEventListener('blur', function() {
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = this.value;
      if (confirmPassword && password !== confirmPassword) {
        showError('signupConfirmPassword', 'confirmPasswordError', 'Passwords do not match');
      } else {
        clearError('signupConfirmPassword', 'confirmPasswordError');
      }
    });
    
    // Also validate when password changes
    if (signupPassword) {
      signupPassword.addEventListener('input', function() {
        const password = this.value;
        const confirmPassword = signupConfirmPassword.value;
        if (confirmPassword && password !== confirmPassword) {
          showError('signupConfirmPassword', 'confirmPasswordError', 'Passwords do not match');
        } else {
          clearError('signupConfirmPassword', 'confirmPasswordError');
        }
      });
    }
  }
}

// Social login buttons (demo functionality)
const socialButtons = document.querySelectorAll('.social-btn');

socialButtons.forEach(button => {
  button.addEventListener('click', function() {
    const platform = this.querySelector('span').textContent;
    alert(`${platform} login is not implemented yet. This is a demo.`);
  });
});

// Show success message on login page if coming from signup
if (window.location.pathname.includes('login.html')) {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('signup') === 'success') {
    const successMessage = document.getElementById('signupSuccessMessage');
    if (successMessage) {
      successMessage.style.display = 'flex';
      // Hide message after 5 seconds
      setTimeout(() => {
        successMessage.style.display = 'none';
      }, 5000);
    }
    // Focus on email input
    setTimeout(() => {
      const loginEmail = document.getElementById('loginEmail');
      if (loginEmail) {
        loginEmail.focus();
      }
    }, 100);
  }
}

// Make logout function available globally
window.logout = logout;

