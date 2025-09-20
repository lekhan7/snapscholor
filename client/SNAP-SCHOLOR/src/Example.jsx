import React, { useState } from 'react';

function Example() {
  const [form, setForm] = useState({
    username: "",
    email: "",
  });

  const handelchange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handeldata = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email) {
      alert("Fill the form first ❌");
      return;
    }

    try {
      await fetch("http://localhost:5000/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      alert("Signup Done ✅ Please log in");
    } catch (error) {
      console.log(error);
      alert("Sorry 😢 Server error, please try later");
    }
  };

  return (
    <div>
      <input
        type="text"
        name="username"
        value={form.username}
        onChange={handelchange}
      />
  <br />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handelchange}
      />
<br />
      <button onClick={handeldata}>click me!</button>
    </div>
  );
}

export default Example;
