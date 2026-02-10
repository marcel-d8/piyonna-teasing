// Piyonna Teasing Page - Main JavaScript

// ============================================
// COUNTDOWN TIMER
// ============================================

// Target date - HARD CODED (change this to your launch date)
const TARGET_DATE = new Date('2026-02-28T00:00:00');

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
// KLAVIYO CONFIGURATION
// ============================================

const KLAVIYO_PUBLIC_KEY = 'Rgku2X';
const KLAVIYO_LIST_ID = 'X9YUF8';

// ============================================
// EMAIL FORM HANDLING
// ============================================

const form = document.getElementById('email-form');
const emailInput = document.getElementById('email');
const agreeCheckbox = document.getElementById('agree');
const submitButton = form.querySelector('button[type="submit"]');

// ============================================
// BUTTON ACTIVATION LOGIC
// ============================================

function updateButtonState() {
  const isEmailValid = isValidEmail(emailInput.value.trim());
  const isAgreed = agreeCheckbox.checked;
  submitButton.disabled = !(isEmailValid && isAgreed);
}

emailInput.addEventListener('input', updateButtonState);
agreeCheckbox.addEventListener('change', updateButtonState);

form.addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = emailInput.value.trim();

  // Disable button and show loading state
  const originalText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = '<span>Submitting...</span>';

  try {
    const success = await subscribeToKlaviyo(email);

    if (success) {
      showPopup('Verify your email for', '30% OFF on launch day');
      form.reset();
      updateButtonState();
    } else {
      // showPopup('Oops!', 'Something went wrong. Please try again.');
    }

  } catch (error) {
    console.error('Klaviyo API Error:', error);
    // showPopup('Oops!', 'Something went wrong. Please try again.');
  } finally {
    submitButton.innerHTML = originalText;
    updateButtonState();
  }
});

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Klaviyo Client Subscription API
async function subscribeToKlaviyo(email) {
  const requestBody = {
    data: {
      type: 'subscription',
      attributes: {
        profile: {
          data: {
            type: 'profile',
            attributes: { email: email }
          }
        },
        custom_source: 'PIYONNA Teasing Page'
      },
      relationships: {
        list: {
          data: {
            type: 'list',
            id: KLAVIYO_LIST_ID
          }
        }
      }
    }
  };

  console.log('Request Body:', JSON.stringify(requestBody, null, 2));

  const response = await fetch(
    `https://a.klaviyo.com/client/subscriptions?company_id=${KLAVIYO_PUBLIC_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'revision': '2024-10-15'
      },
      body: JSON.stringify(requestBody)
    }
  );

  // 에러 응답 확인
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Klaviyo Error Response:', errorText);
  }

  return response.ok;
}

// ============================================
// POPUP MODAL
// ============================================

function showPopup(title, subtitle) {
  const overlay = document.getElementById('popup-overlay');
  const content = document.getElementById('popup-content');
  overlay.classList.remove('opacity-0', 'pointer-events-none');
  content.classList.remove('scale-95');
  content.classList.add('scale-100');
}

function hidePopup() {
  const overlay = document.getElementById('popup-overlay');
  const content = document.getElementById('popup-content');
  overlay.classList.add('opacity-0', 'pointer-events-none');
  content.classList.remove('scale-100');
  content.classList.add('scale-95');
}

document.getElementById('popup-close').addEventListener('click', hidePopup);
document.getElementById('popup-overlay').addEventListener('click', function(e) {
  if (e.target === this) hidePopup();
});

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
