const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyE1POyOb8BE_nSJYN75YrnPiJyfsbnc8NeVuNgKbfKV5vjWSXvdmVfvn93oYQQXRUnPQ/exec';

const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const errorMessage = document.getElementById('errorMessage');
const thankyouOverlay = document.getElementById('thankyouOverlay');
const tyEmail = document.getElementById('tyEmail');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMessage.classList.add('hidden');

  const fields = form.querySelectorAll('input[required]');
  let valid = true;

  fields.forEach((field) => {
    field.classList.remove('invalid');
    if (!field.value.trim()) {
      field.classList.add('invalid');
      valid = false;
    }
  });

  const emailInput = document.getElementById('email');
  if (emailInput.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
    emailInput.classList.add('invalid');
    valid = false;
  }

  if (!valid) return;

  setLoading(true);

  const payload = {
    nome: document.getElementById('nome').value.trim(),
    empresa: document.getElementById('empresa').value.trim(),
    email: emailInput.value.trim(),
    cargo: document.getElementById('cargo').value.trim(),
    timestamp: new Date().toISOString(),
  };

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(payload),
    });

    tyEmail.textContent = payload.email;
    thankyouOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  } catch (err) {
    console.error(err);
    errorMessage.classList.remove('hidden');
  } finally {
    setLoading(false);
  }
});

function setLoading(loading) {
  submitBtn.disabled = loading;
  btnText.classList.toggle('hidden', loading);
  btnLoader.classList.toggle('hidden', !loading);
}
