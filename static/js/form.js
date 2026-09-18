// =====================================================
// form.js — Contact form enhancement
//   1. Pre-fill service dropdown from URL ?service= param
//   2. Client-side validation with inline error messages
//   3. Flash toast auto-dismiss
//   4. Character counter for message textarea
// =====================================================

(function () {
  'use strict';

  /* ---- Pre-fill service from URL query/hash ---- */
  function getServiceParam() {
    // Support ?service=cctv and hash-style #contact?service=cctv
    const search = window.location.search || window.location.hash.replace(/^[^?]*/, '');
    const params = new URLSearchParams(search);
    return params.get('service') || '';
  }

  function prefillService() {
    const service = getServiceParam();
    if (!service) return;
    const select = document.getElementById('service');
    if (select) {
      const option = Array.from(select.options).find(
        o => o.value.toLowerCase() === service.toLowerCase()
      );
      if (option) {
        select.value = option.value;
      }
    }
  }

  /* ---- Show field error ---- */
  function showError(field, msg) {
    field.classList.add('ring-2', 'ring-red-400', 'border-red-400');
    field.classList.remove('ring-pv-blue', 'border-gray-200');
    let errEl = field.parentElement.querySelector('.field-error');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.className = 'field-error text-red-500 text-xs mt-1';
      field.parentElement.appendChild(errEl);
    }
    errEl.textContent = msg;
  }

  function clearError(field) {
    field.classList.remove('ring-2', 'ring-red-400', 'border-red-400');
    const errEl = field.parentElement.querySelector('.field-error');
    if (errEl) errEl.remove();
  }

  /* ---- Validate all fields ---- */
  function validateForm(form) {
    let valid = true;

    const name = form.querySelector('#name');
    if (name && name.value.trim().length < 2) {
      showError(name, 'Please enter your name (at least 2 characters).');
      valid = false;
    } else if (name) clearError(name);

    const phone = form.querySelector('#phone');
    if (phone && !/^[6-9]\d{9}$/.test(phone.value.trim())) {
      showError(phone, 'Enter a valid 10-digit Indian mobile number.');
      valid = false;
    } else if (phone) clearError(phone);

    const email = form.querySelector('#email');
    if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showError(email, 'Enter a valid email address.');
      valid = false;
    } else if (email) clearError(email);

    const service = form.querySelector('#service');
    if (service && !service.value) {
      showError(service, 'Please select a service.');
      valid = false;
    } else if (service) clearError(service);

    return valid;
  }

  /* ---- Character counter ---- */
  function setupCharCounter() {
    const textarea = document.getElementById('message');
    const counter = document.getElementById('msg-counter');
    if (!textarea || !counter) return;
    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      counter.textContent = `${len} / 1000`;
      counter.classList.toggle('text-red-500', len > 950);
    });
  }

  /* ---- Auto-dismiss flash toasts ---- */
  function setupToasts() {
    document.querySelectorAll('[data-toast]').forEach(toast => {
      setTimeout(() => {
        toast.style.transition = 'opacity 0.5s';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
      }, 5000);

      const closeBtn = toast.querySelector('[data-toast-close]');
      if (closeBtn) closeBtn.addEventListener('click', () => toast.remove());
    });
  }

  /* ---- Init ---- */
  document.addEventListener('DOMContentLoaded', () => {
    prefillService();
    setupCharCounter();
    setupToasts();
    setupFormValidation();
  });
})();
