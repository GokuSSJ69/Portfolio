/**
 * Booking Form Handling
 */

// Get URL parameters //
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    destination: params.get('destination') || '',
    location: params.get('location') || '',
    price: params.get('price') || '0'
  };
}

// Check if user is logged in //
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    const params = getUrlParams();
    let redirectUrl = 'login.html?redirect=booking';
    
    // Preserve booking parameters //
    if (params.destination && params.location && params.price) {
      redirectUrl += `&destination=${encodeURIComponent(params.destination)}&location=${encodeURIComponent(params.location)}&price=${params.price}`;
    }
    
    alert('Please login to continue with booking.');
    window.location.href = redirectUrl;
    return false;
  }
  return true;
}

// Initialize booking page//
document.addEventListener('DOMContentLoaded', function() {
  // Check login status //
  if (!checkLoginStatus()) {
    return;
  }

  // Get URL parameters //
  const params = getUrlParams();
  
  // Populate summary //
  const summaryDestination = document.getElementById('summaryDestination');
  const summaryLocation = document.getElementById('summaryLocation');
  const summaryPrice = document.getElementById('summaryPrice');
  const summaryTotal = document.getElementById('summaryTotal');

  if (summaryDestination) summaryDestination.textContent = params.destination || 'Not selected';
  if (summaryLocation) summaryLocation.textContent = params.location || 'Not selected';
  if (summaryPrice) summaryPrice.textContent = `$${params.price || '0'}`;

  // Set minimum date to today //
  const today = new Date().toISOString().split('T')[0];
  const checkInInput = document.getElementById('bookingCheckIn');
  const checkOutInput = document.getElementById('bookingCheckOut');
  
  if (checkInInput) {
    checkInInput.setAttribute('min', today);
    checkInInput.addEventListener('change', function() {
      if (checkOutInput) {
        const checkInDate = new Date(this.value);
        checkInDate.setDate(checkInDate.getDate() + 1);
        checkOutInput.setAttribute('min', checkInDate.toISOString().split('T')[0]);
      }
    });
  }

  // Auto-fill user data if logged in //
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const bookingName = document.getElementById('bookingName');
  const bookingEmail = document.getElementById('bookingEmail');
  
  if (bookingName && currentUser.name) {
    bookingName.value = currentUser.name;
  }
  if (bookingEmail && currentUser.email) {
    bookingEmail.value = currentUser.email;
  }

  // Calculate total when travelers or dates change //
  const travelersInput = document.getElementById('bookingTravelers');
  
  function calculateTotal() {
    const travelers = parseInt(travelersInput?.value || 1);
    const price = parseFloat(params.price || 0);
    const checkIn = checkInInput?.value;
    const checkOut = checkOutInput?.value;
    
    let total = price * travelers;
    
    // Calculate number of nights if dates are selected //
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      if (nights > 0) {
        total = price * travelers * nights;
      }
    }
    
    if (summaryTotal) {
      summaryTotal.textContent = `$${total.toFixed(2)}`;
    }
  }

  if (travelersInput) {
    travelersInput.addEventListener('input', calculateTotal);
  }
  if (checkInInput) {
    checkInInput.addEventListener('change', calculateTotal);
  }
  if (checkOutInput) {
    checkOutInput.addEventListener('change', calculateTotal);
  }

  // Initial calculation //
  calculateTotal();
});

// Phone number validation //
function validatePhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Show error message //
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

// Booking form submission
const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const params = getUrlParams();
    const name = document.getElementById('bookingName').value.trim();
    const email = document.getElementById('bookingEmail').value.trim();
    const phone = document.getElementById('bookingPhone').value.trim();
    const travelers = parseInt(document.getElementById('bookingTravelers').value);
    const checkIn = document.getElementById('bookingCheckIn').value;
    const checkOut = document.getElementById('bookingCheckOut').value;
    const specialRequests = document.getElementById('bookingSpecial').value.trim();
    const terms = document.getElementById('bookingTerms').checked;
    
    let isValid = true;
    
    // Clear previous errors
    clearError('bookingName', 'nameError');
    clearError('bookingEmail', 'emailError');
    clearError('bookingPhone', 'phoneError');
    clearError('bookingTravelers', 'travelersError');
    clearError('bookingCheckIn', 'checkInError');
    clearError('bookingCheckOut', 'checkOutError');
    
    // Validate name
    if (!name) {
      showError('bookingName', 'nameError', 'Name is required');
      isValid = false;
    } else if (name.length < 2) {
      showError('bookingName', 'nameError', 'Name must be at least 2 characters');
      isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      showError('bookingEmail', 'emailError', 'Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      showError('bookingEmail', 'emailError', 'Please enter a valid email address');
      isValid = false;
    }
    
    // Validate phone
    if (!phone) {
      showError('bookingPhone', 'phoneError', 'Phone number is required');
      isValid = false;
    } else if (!validatePhone(phone)) {
      showError('bookingPhone', 'phoneError', 'Please enter a valid phone number');
      isValid = false;
    }
    
    // Validate travelers
    if (!travelers || travelers < 1 || travelers > 20) {
      showError('bookingTravelers', 'travelersError', 'Please enter a valid number of travelers (1-20)');
      isValid = false;
    }
    
    // Validate dates
    if (!checkIn) {
      showError('bookingCheckIn', 'checkInError', 'Check-in date is required');
      isValid = false;
    }
    
    if (!checkOut) {
      showError('bookingCheckOut', 'checkOutError', 'Check-out date is required');
      isValid = false;
    }
    
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      if (checkOutDate <= checkInDate) {
        showError('bookingCheckOut', 'checkOutError', 'Check-out date must be after check-in date');
        isValid = false;
      }
    }
    
    // Validate terms
    if (!terms) {
      alert('Please accept the Terms & Conditions');
      isValid = false;
    }
    
    if (isValid) {
      // Calculate total
      const price = parseFloat(params.price || 0);
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      const total = price * travelers * nights;
      
      // Create booking object
      const booking = {
        id: Date.now().toString(),
        destination: params.destination,
        location: params.location,
        name: name,
        email: email,
        phone: phone,
        travelers: travelers,
        checkIn: checkIn,
        checkOut: checkOut,
        nights: nights,
        pricePerPerson: price,
        total: total,
        specialRequests: specialRequests,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      
      // Save booking to localStorage
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      bookings.push(booking);
      localStorage.setItem('bookings', JSON.stringify(bookings));
      
      // Show success message
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Processing...</span>';
      submitBtn.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        alert(`Booking confirmed! Your booking ID is: ${booking.id}\n\nTotal Amount: $${total.toFixed(2)}\n\nYou will receive a confirmation email shortly.`);
        window.location.href = 'front.html';
      }, 1500);
    }
  });
}

