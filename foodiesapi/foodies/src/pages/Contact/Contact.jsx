import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    setSending(true);
    // NOTE: wire this up to your actual contact-form service/endpoint.
    // Simulated delay here so the success animation has something to
    // transition from — replace with the real request + its result.
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setData({ firstName: "", lastName: "", email: "", message: "" });
    }, 900);
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="contact-form p-5 shadow-sm bg-white">
              <h2 className="text-center mb-4 contact-heading">
                Get in Touch
              </h2>

              {sent ? (
                <div className="contact-success text-center py-4">
                  <i className="bi bi-check-circle-fill success-icon"></i>
                  <h4 className="mt-3">Message sent!</h4>
                  <p className="text-muted">
                    Thanks for reaching out — we'll get back to you soon.
                  </p>
                  <button
                    className="btn btn-outline-primary mt-2"
                    onClick={() => setSent(false)}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmitHandler}>
                  <div className="row g-3">
                    <div className="col-md-6 field-in" style={{ animationDelay: "0.05s" }}>
                      <input
                        type="text"
                        className="form-control custom-input"
                        placeholder="First Name"
                        name="firstName"
                        value={data.firstName}
                        onChange={onChangeHandler}
                        required
                      />
                    </div>
                    <div className="col-md-6 field-in" style={{ animationDelay: "0.1s" }}>
                      <input
                        type="text"
                        className="form-control custom-input"
                        placeholder="Last Name"
                        name="lastName"
                        value={data.lastName}
                        onChange={onChangeHandler}
                        required
                      />
                    </div>
                    <div className="col-12 field-in" style={{ animationDelay: "0.15s" }}>
                      <input
                        type="email"
                        className="form-control custom-input"
                        placeholder="Email Address"
                        name="email"
                        value={data.email}
                        onChange={onChangeHandler}
                        required
                      />
                    </div>
                    <div className="col-12 field-in" style={{ animationDelay: "0.2s" }}>
                      <textarea
                        className="form-control custom-input"
                        rows="5"
                        placeholder="Your Message"
                        name="message"
                        value={data.message}
                        onChange={onChangeHandler}
                        required
                      ></textarea>
                    </div>
                    <div className="col-12 field-in" style={{ animationDelay: "0.25s" }}>
                      <button
                        className="btn btn-primary w-100 send-btn"
                        type="submit"
                        disabled={sending}
                      >
                        {sending ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;