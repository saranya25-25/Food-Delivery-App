import { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    setSending(true);
    setStatus("");

    try {
      const response = await fetch(
          "https://formspree.io/f/xbgrqgwy",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(data),
          }
      );

      if (response.ok) {
        setStatus("success");

        setData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
        });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Form submission failed:", error);
      setStatus("error");
    } finally {
      setSending(false);
    }
  };

  return (
      <section className="contact-section">
        <div className="contact-overlay"></div>

        <div className="container contact-container">
          <div className="contact-content">

            {/* Left Side */}
            <div className="contact-info">
                        <span className="contact-badge">
                            <i className="bi bi-chat-dots-fill"></i>
                            Get in Touch
                        </span>

              <h1>
                Let's talk about
                <span> delicious food!</span>
              </h1>

              <p>
                Have a question, suggestion, or feedback?
                We'd love to hear from you. Send us a message
                and our team will get back to you soon.
              </p>

              <div className="contact-details">

                <div className="contact-detail">
                  <div className="detail-icon">
                    <i className="bi bi-envelope-fill"></i>
                  </div>

                  <div>
                    <small>Email</small>
                    <p>We'll reply to your email</p>
                  </div>
                </div>

                <div className="contact-detail">
                  <div className="detail-icon">
                    <i className="bi bi-clock-fill"></i>
                  </div>

                  <div>
                    <small>Response Time</small>
                    <p>Usually within 24 hours</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Contact Card */}
            <div className="contact-card">

              {status === "success" ? (
                  <div className="contact-success">

                    <div className="success-circle">
                      <i className="bi bi-check-lg"></i>
                    </div>

                    <h2>Message Sent!</h2>

                    <p>
                      Thanks for reaching out. We've received
                      your message and will get back to you soon.
                    </p>

                    <button
                        type="button"
                        className="send-another-btn"
                        onClick={() => setStatus("")}
                    >
                      Send Another Message
                    </button>

                  </div>
              ) : (
                  <>
                    <div className="form-header">
                      <h2>Send us a message</h2>

                      <p>
                        Fill in the details below and we'll
                        get back to you.
                      </p>
                    </div>

                    <form onSubmit={onSubmitHandler}>

                      <div className="form-row">

                        <div className="form-group">
                          <label htmlFor="firstName">
                            First Name
                          </label>

                          <div className="input-wrapper">
                            <i className="bi bi-person"></i>

                            <input
                                id="firstName"
                                type="text"
                                name="firstName"
                                placeholder="Enter your first name"
                                value={data.firstName}
                                onChange={onChangeHandler}
                                required
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label htmlFor="lastName">
                            Last Name
                          </label>

                          <div className="input-wrapper">
                            <i className="bi bi-person"></i>

                            <input
                                id="lastName"
                                type="text"
                                name="lastName"
                                placeholder="Enter your last name"
                                value={data.lastName}
                                onChange={onChangeHandler}
                                required
                            />
                          </div>
                        </div>

                      </div>

                      <div className="form-group">
                        <label htmlFor="email">
                          Email Address
                        </label>

                        <div className="input-wrapper">
                          <i className="bi bi-envelope"></i>

                          <input
                              id="email"
                              type="email"
                              name="email"
                              placeholder="you@example.com"
                              value={data.email}
                              onChange={onChangeHandler}
                              required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="message">
                          Your Message
                        </label>

                        <div className="input-wrapper textarea-wrapper">
                          <i className="bi bi-chat-left-text"></i>

                          <textarea
                              id="message"
                              name="message"
                              rows="5"
                              placeholder="Tell us how we can help..."
                              value={data.message}
                              onChange={onChangeHandler}
                              required
                          ></textarea>
                        </div>
                      </div>

                      {status === "error" && (
                          <div className="error-message">
                            <i className="bi bi-exclamation-circle-fill"></i>
                            Something went wrong. Please try
                            again.
                          </div>
                      )}

                      <button
                          type="submit"
                          className="send-btn"
                          disabled={sending}
                      >
                        {sending ? (
                            <>
                              <span className="spinner"></span>
                              Sending Message...
                            </>
                        ) : (
                            <>
                              Send Message
                              <i className="bi bi-send-fill"></i>
                            </>
                        )}
                      </button>

                    </form>
                  </>
              )}

            </div>
          </div>
        </div>
      </section>
  );
};

export default Contact;