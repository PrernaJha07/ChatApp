document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const res = await fetch('/register', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  if (data.success) {
    alert("Registered successfully");
    window.location.href = "/login.html";
  } else {
    alert("Registration failed");
  }
});
