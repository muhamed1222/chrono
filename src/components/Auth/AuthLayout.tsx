import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";

const AuthLayout: React.FC = () => {
  const { signIn, signUp, signInWithOAuth } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleOAuth = async (provider: "telegram" | "vk" | "google") => {
    setError("");
    setLoading(true);
    try {
      await signInWithOAuth(provider);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h1 className="modal-title">Войти в Chrono</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-container">
          <div className="social-buttons-container">
            <button
              className="social-button"
              disabled={loading}
              onClick={() => handleOAuth("google")}
            >
              <div className="social-icon">
                <svg
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_161_3973)">
                    <path
                      d="M19.9905 10.9259C19.9905 10.0873 19.9224 9.47531 19.7752 8.8407H10.1992V12.6257H15.8201C15.7068 13.5663 15.0948 14.9829 13.7349 15.9348L13.7159 16.0615L16.7436 18.407L16.9534 18.428C18.8798 16.6487 19.9905 14.0309 19.9905 10.9259Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M10.1992 20.8983C12.953 20.8983 15.2648 19.9917 16.9534 18.4279L13.7349 15.9347C12.8737 16.5353 11.7177 16.9546 10.1992 16.9546C7.50211 16.9546 5.21297 15.1754 4.39695 12.7163L4.27734 12.7265L1.12906 15.1629L1.08789 15.2774C2.76508 18.6091 6.21016 20.8983 10.1992 20.8983Z"
                      fill="#34A853"
                    />
                    <path
                      d="M4.39695 12.7164C4.18164 12.0818 4.05703 11.4018 4.05703 10.6993C4.05703 9.9966 4.18164 9.31668 4.38562 8.68207L4.37992 8.54691L1.19219 6.07129L1.08789 6.1209C0.396641 7.50348 0 9.05605 0 10.6993C0 12.3425 0.396641 13.895 1.08789 15.2775L4.39695 12.7164Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M10.1992 4.44367C12.1144 4.44367 13.4062 5.27094 14.1429 5.96227L17.0213 3.1518C15.2535 1.50859 12.953 0.5 10.1992 0.5C6.21016 0.5 2.76508 2.78914 1.08789 6.12086L4.38562 8.68203C5.21297 6.22289 7.50211 4.44367 10.1992 4.44367Z"
                      fill="#EB4335"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_161_3973">
                      <rect
                        width="20"
                        height="20.4688"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <span className="social-button-text">
                Зарегистрироваться через Google
              </span>
            </button>

            <button
              className="social-button"
              disabled={loading}
              onClick={() => handleOAuth("vk")}
            >
              <div className="social-icon">
                <svg
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_161_3981)">
                    <path
                      d="M19.9905 10.9259C19.9905 10.0873 19.9224 9.47531 19.7752 8.8407H10.1992V12.6257H15.8201C15.7068 13.5663 15.0948 14.9829 13.7349 15.9348L13.7159 16.0615L16.7436 18.407L16.9534 18.428C18.8798 16.6487 19.9905 14.0309 19.9905 10.9259Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M10.1992 20.8983C12.953 20.8983 15.2648 19.9917 16.9534 18.4279L13.7349 15.9347C12.8737 16.5353 11.7177 16.9546 10.1992 16.9546C7.50211 16.9546 5.21297 15.1754 4.39695 12.7163L4.27734 12.7265L1.12906 15.1629L1.08789 15.2774C2.76508 18.6091 6.21016 20.8983 10.1992 20.8983Z"
                      fill="#34A853"
                    />
                    <path
                      d="M4.39695 12.7164C4.18164 12.0818 4.05703 11.4018 4.05703 10.6993C4.05703 9.9966 4.18164 9.31668 4.38562 8.68207L4.37992 8.54691L1.19219 6.07129L1.08789 6.1209C0.396641 7.50348 0 9.05605 0 10.6993C0 12.3425 0.396641 13.895 1.08789 15.2775L4.39695 12.7164Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M10.1992 4.44367C12.1144 4.44367 13.4062 5.27094 14.1429 5.96227L17.0213 3.1518C15.2535 1.50859 12.953 0.5 10.1992 0.5C6.21016 0.5 2.76508 2.78914 1.08789 6.12086L4.38562 8.68203C5.21297 6.22289 7.50211 4.44367 10.1992 4.44367Z"
                      fill="#EB4335"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_161_3981">
                      <rect
                        width="20"
                        height="20.4688"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <span className="social-button-text">
                Зарегистрироваться через VK
              </span>
            </button>

            <button
              className="social-button"
              disabled={loading}
              onClick={() => handleOAuth("telegram")}
            >
              <div className="social-icon">
                <svg
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_161_3989)">
                    <path
                      d="M19.9905 10.9259C19.9905 10.0873 19.9224 9.47531 19.7752 8.8407H10.1992V12.6257H15.8201C15.7068 13.5663 15.0948 14.9829 13.7349 15.9348L13.7159 16.0615L16.7436 18.407L16.9534 18.428C18.8798 16.6487 19.9905 14.0309 19.9905 10.9259Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M10.1992 20.8983C12.953 20.8983 15.2648 19.9917 16.9534 18.4279L13.7349 15.9347C12.8737 16.5353 11.7177 16.9546 10.1992 16.9546C7.50211 16.9546 5.21297 15.1754 4.39695 12.7163L4.27734 12.7265L1.12906 15.1629L1.08789 15.2774C2.76508 18.6091 6.21016 20.8983 10.1992 20.8983Z"
                      fill="#34A853"
                    />
                    <path
                      d="M4.39695 12.7164C4.18164 12.0818 4.05703 11.4018 4.05703 10.6993C4.05703 9.9966 4.18164 9.31668 4.38562 8.68207L4.37992 8.54691L1.19219 6.07129L1.08789 6.1209C0.396641 7.50348 0 9.05605 0 10.6993C0 12.3425 0.396641 13.895 1.08789 15.2775L4.39695 12.7164Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M10.1992 4.44367C12.1144 4.44367 13.4062 5.27094 14.1429 5.96227L17.0213 3.1518C15.2535 1.50859 12.953 0.5 10.1992 0.5C6.21016 0.5 2.76508 2.78914 1.08789 6.12086L4.38562 8.68203C5.21297 6.22289 7.50211 4.44367 10.1992 4.44367Z"
                      fill="#EB4335"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_161_3989">
                      <rect
                        width="20"
                        height="20.4688"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <span className="social-button-text">
                Зарегистрироваться через Telegram
              </span>
            </button>
          </div>

          <div className="alternative-text">
            Или войдите в систему с помощью электронной почты
          </div>

          <form onSubmit={handleSubmit} className="email-form">
            <div className="input-container">
              <div className="input-wrapper">
                <div className="input-label-container">
                  <div className="input-label">
                    <span className="label-text">Email</span>
                  </div>
                </div>
                <div className="input-field">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="chrono@example.com"
                    className="email-input"
                    required
                  />
                </div>
              </div>

              <div className="password-wrapper">
                <div className="password-label-container">
                  <div className="password-label">
                    <span className="label-text">Пароль</span>
                  </div>
                  <div className="forgot-password">
                    <span className="forgot-password-text">Забыли пароль?</span>
                  </div>
                </div>
                <div className="password-field">
                  <svg
                    className="password-dots"
                    width="66"
                    height="6"
                    viewBox="0 0 66 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="3" cy="3" r="3" fill="#7B7B7B" />
                    <circle cx="13" cy="3" r="3" fill="#7B7B7B" />
                    <circle cx="23" cy="3" r="3" fill="#7B7B7B" />
                    <circle cx="33" cy="3" r="3" fill="#7B7B7B" />
                    <circle cx="43" cy="3" r="3" fill="#7B7B7B" />
                    <circle cx="53" cy="3" r="3" fill="#7B7B7B" />
                    <circle cx="63" cy="3" r="3" fill="#7B7B7B" />
                  </svg>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="password-input"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="button-container">
              <button type="submit" disabled={loading} className="login-button">
                <span className="login-button-text">Войти</span>
              </button>

              <div className="footer-container">
                <span className="footer-text">Нужна учетная запись?</span>
                <span
                  className="signup-link"
                  onClick={() => setIsRegister(!isRegister)}
                >
                  Зарегистрироваться
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          display: flex;
          width: 100vw;
          height: 100vh;
          padding: 179px 480px;
          justify-content: center;
          align-items: center;
          opacity: 0.9;
          background: var(--shade04-100);
          position: fixed;
          left: 0;
          top: 0;
        }

        .modal-container {
          display: flex;
          width: 480px;
          padding: 64px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 40px;
          flex-shrink: 0;
          border-radius: 32px;
          background: var(--Backgrounds-surface2);
          box-shadow:
            0px 2.15px 0.5px -2px rgba(0, 0, 0, 0.25),
            0px 24px 24px -16px rgba(8, 8, 8, 0.04),
            0px 6px 13px 0px rgba(8, 8, 8, 0.03),
            0px 6px 4px -4px rgba(8, 8, 8, 0.05),
            0px 5px 1.5px -4px rgba(8, 8, 8, 0.09);
          backdrop-filter: blur(32px);
        }

        .modal-title {
          align-self: stretch;
          color: var(--Text-Primary);
          text-align: center;
          font-family:
            "Inter Display",
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 32px;
          font-style: normal;
          font-weight: 600;
          line-height: 145%;
          letter-spacing: 0.08px;
          margin: 0;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgb(239, 68, 68);
          color: rgb(239, 68, 68);
          padding: 12px 16px;
          border-radius: 8px;
          width: 100%;
          text-align: center;
          font-size: 14px;
        }

        .form-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;
          align-self: stretch;
        }

        .social-buttons-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          align-self: stretch;
        }

        .social-button {
          display: flex;
          height: 48px;
          padding: 14px 28px;
          justify-content: center;
          align-items: center;
          gap: 8px;
          align-self: stretch;
          border-radius: 90px;
          background: var(--Backgrounds-surface1);
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .social-button:hover {
          background: #e5e5e5;
        }

        .social-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .social-icon {
          display: flex;
          width: 24px;
          height: 24px;
          padding: 1.5px 1.5px 2.031px 2.5px;
          justify-content: center;
          align-items: center;
        }

        .social-button-text {
          color: var(--Text-Secondary);
          font-feature-settings: "ss01" on;
          font-family:
            "Inter Display",
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 14px;
          font-style: normal;
          font-weight: 600;
          line-height: 100%;
          letter-spacing: 0.175px;
        }

        .alternative-text {
          align-self: stretch;
          color: var(--Text-Tertiary);
          text-align: center;
          font-family:
            "Inter Display",
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 160%;
          letter-spacing: 0.048px;
        }

        .email-form {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          align-self: stretch;
        }

        .input-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          align-self: stretch;
        }

        .input-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: -6px;
          align-self: stretch;
        }

        .input-label-container {
          display: flex;
          height: 12px;
          padding: 0px 24px;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          gap: 8px;
          align-self: stretch;
        }

        .input-label {
          display: flex;
          padding: 0px 4px;
          justify-content: center;
          align-items: center;
          background: var(--Backgrounds-surface2);
          position: relative;
          z-index: 1;
        }

        .label-text {
          color: var(--Text-Primary);
          text-align: center;
          font-family:
            "Inter Display",
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 160%;
          letter-spacing: 0.048px;
        }

        .input-field {
          display: flex;
          padding: 14px 186px 13px 28px;
          align-items: center;
          align-self: stretch;
          border-radius: 48px;
          border: 1.5px solid var(--Stroke-Subtle);
          position: relative;
          margin-top: -6px;
        }

        .email-input {
          color: var(--Text-Tertiary);
          font-family:
            "Inter Display",
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 150%;
          letter-spacing: 0.035px;
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          position: absolute;
          left: 28px;
          top: 14px;
        }

        .password-wrapper {
          display: flex;
          width: 352px;
          flex-direction: column;
          align-items: flex-start;
          gap: -6px;
        }

        .password-label-container {
          display: flex;
          height: 12px;
          padding: 0px 24px;
          justify-content: center;
          align-items: flex-start;
          gap: 155px;
          align-self: stretch;
          position: relative;
        }

        .password-label {
          display: flex;
          height: 12px;
          padding: 2px 4px;
          justify-content: center;
          align-items: center;
          gap: 8px;
          background: var(--Backgrounds-surface2);
          position: absolute;
          left: 24px;
          top: 0px;
        }

        .forgot-password {
          display: flex;
          height: 12px;
          padding: 2px 4px;
          justify-content: center;
          align-items: center;
          gap: 8px;
          background: var(--Backgrounds-surface2);
          position: absolute;
          right: 24px;
          top: 0px;
          cursor: pointer;
        }

        .forgot-password-text {
          color: var(--Text-Secondary);
          text-align: center;
          font-family:
            "Inter Display",
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 160%;
          letter-spacing: 0.048px;
        }

        .password-field {
          height: 48px;
          align-self: stretch;
          border-radius: 48px;
          border: 1.5px solid var(--Stroke-Stroke2);
          position: relative;
          margin-top: -6px;
        }

        .password-dots {
          display: inline-flex;
          align-items: flex-start;
          gap: 4px;
          position: absolute;
          left: 28px;
          top: 21px;
        }

        .password-input {
          position: absolute;
          left: 28px;
          top: 14px;
          right: 28px;
          bottom: 14px;
          border: none;
          outline: none;
          background: transparent;
          color: var(--Text-Tertiary);
          font-family:
            "Inter Display",
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 14px;
          opacity: 0;
        }

        .button-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          align-self: stretch;
        }

        .login-button {
          display: flex;
          padding: 17px 28px;
          justify-content: center;
          align-items: center;
          gap: 10px;
          align-self: stretch;
          border-radius: 32px;
          border: 1.5px solid rgba(255, 255, 255, 0.4);
          background: linear-gradient(180deg, #2c2c2c 0%, #282828 100%);
          box-shadow: 2px 0px 8px 2px rgba(248, 248, 248, 0.2) inset;
          cursor: pointer;
          transition: all 0.2s;
        }

        .login-button:hover {
          background: linear-gradient(180deg, #3c3c3c 0%, #383838 100%);
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-button-text {
          color: var(--Text-Light);
          font-feature-settings: "ss01" on;
          font-family:
            "Inter Display",
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 14px;
          font-style: normal;
          font-weight: 600;
          line-height: 100%;
          letter-spacing: 0.175px;
        }

        .footer-container {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .footer-text {
          color: var(--Text-Secondary);
          font-family:
            "Inter Display",
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 150%;
          letter-spacing: 0.035px;
        }

        .signup-link {
          color: var(--Text-Primary);
          font-family:
            "Inter Display",
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
          line-height: 150%;
          letter-spacing: 0.035px;
          cursor: pointer;
        }

        .signup-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
