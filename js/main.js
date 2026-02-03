// Piyonna Teasing Page - Main JavaScript

// ============================================
// COUNTDOWN TIMER
// ============================================

// Target date - HARD CODED (change this to your launch date)
const TARGET_DATE = new Date('2025-03-01T00:00:00');

function updateCountdown() {
  const now = new Date();
  const diff = TARGET_DATE - now;

  if (diff <= 0) {
    // Countdown finished
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Update countdown every second
updateCountdown();
setInterval(updateCountdown, 1000);

// ============================================
// EMAIL FORM HANDLING
// ============================================

const form = document.getElementById('email-form');
const emailInput = document.getElementById('email');
const agreeCheckbox = document.getElementById('agree');

form.addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = emailInput.value.trim();
  const agreed = agreeCheckbox.checked;

  // Basic validation
  if (!email) {
    alert('Please enter your email address.');
    return;
  }

  if (!isValidEmail(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  if (!agreed) {
    alert('Please agree to receive updates.');
    return;
  }

  // Fake HTTP request (mock API call)
  console.log('=== MOCK API REQUEST ===');
  console.log('Endpoint: POST /api/subscribe');
  console.log('Payload:', {
    email: email,
    agreed: agreed,
    timestamp: new Date().toISOString()
  });

  // Simulate network delay
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = '<span>Submitting...</span>';

  try {
    // Simulate API call with delay
    await mockApiCall({ email, agreed });

    console.log('Response: 200 OK');
    console.log('=== END MOCK REQUEST ===');

    // Success feedback
    alert('Thank you for subscribing! Check your email for the discount code.');
    form.reset();

  } catch (error) {
    console.error('Mock API Error:', error);
    alert('Something went wrong. Please try again.');
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalText;
  }
});

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Mock API call function
function mockApiCall(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Subscription successful' });
    }, 1000); // 1 second delay to simulate network
  });
}

// ============================================
// CHECKBOX VISUAL FEEDBACK
// ============================================

agreeCheckbox.addEventListener('change', function() {
  if (this.checked) {
    this.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='white'%3E%3Cpath fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/%3E%3C/svg%3E\")";
    this.style.backgroundSize = '14px';
    this.style.backgroundPosition = 'center';
    this.style.backgroundRepeat = 'no-repeat';
  } else {
    this.style.backgroundImage = 'none';
  }
});
