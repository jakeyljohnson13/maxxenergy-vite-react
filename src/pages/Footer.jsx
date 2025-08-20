// src/pages/Footer.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Footer = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);          // success or error text
  const [isError, setIsError] = useState(false); // style message

  const emailValid = emailRe.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setIsError(false);

    if (!emailValid) {
      setMsg("Please enter a valid email address.");
      setIsError(true);
      return;
    }

    try {
      setSubmitting(true);
      const baseUrl = import.meta.env.VITE_API_URL || "";
      // Adjust the endpoint to match your backend if different:
      const res = await fetch(`${baseUrl}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Subscription failed (${res.status})`);
      }

      setMsg("Thanks! You’re subscribed.");
      setIsError(false);
      setEmail("");
    } catch (err) {
      setMsg(err.message || "Something went wrong. Please try again.");
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="foot">
      <div className="row">
        {/* Logo + name */}
        <div className="coloumn">
          <img src="MAXX-Energy-Logo-3A.png" width={100} alt="MAXX Energy logo" />
          <p>MAXX Energy</p>
        </div>

        {/* Company info */}
        <div className="coloumn">
          <h3><strong>Company</strong></h3>
          <p>PO Box 111</p>
          <p>1800 S Bern St, San Francisco, CA</p>
          <p className="email-id">Maxxe@gmail.com</p>
          <h4>866-525-MAXX</h4>
        </div>

        {/* Links */}
        <div className="coloumn">
          <p><strong>Links</strong></p>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/faqs">FAQs</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/socials">Social Links</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="coloumn">
          <p><strong>Newsletter</strong></p>

          <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
            {/* visually-hidden label for a11y (style .sr-only in CSS if you like) */}
            <label htmlFor="newsletter-email" className="sr-only">Email address: </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={submitting || !emailValid}>
              {submitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          {msg && (
            <small className={isError ? "newsletter-msg error" : "newsletter-msg success"}>
              {msg}
            </small>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
