import React, { useState } from 'react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.includes('@')) errs.email = 'Valid email is required';
    if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('User registered successfully!');
        setFormData({ name: '', email: '', password: '' });
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label><br />
        <input name="name" value={formData.name} onChange={handleChange} />
        <div style={{ color: 'red' }}>{errors.name}</div>
      </div>

      <div>
        <label>Email:</label><br />
        <input name="email" type="email" value={formData.email} onChange={handleChange} />
        <div style={{ color: 'red' }}>{errors.email}</div>
      </div>

      <div>
        <label>Password:</label><br />
        <input name="password" type="password" value={formData.password} onChange={handleChange} />
        <div style={{ color: 'red' }}>{errors.password}</div>
      </div>

      <button type="submit">Register</button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default RegistrationForm;
