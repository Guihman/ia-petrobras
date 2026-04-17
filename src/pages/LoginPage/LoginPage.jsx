import { useState } from "react";
import styles from "./LoginPage.module.css";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  function validateForm() {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Digite um e-mail.";
    }

    if (!password.trim()) {
      nextErrors.password = "Digite uma senha.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    onLogin({
      email: email.trim(),
      password: password.trim(),
    });
  }

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGlowOne} />
      <div className={styles.backgroundGlowTwo} />

      <section className={styles.loginShell}>
        <div className={styles.leftPanel}>
          <span className={styles.badge}>PetroAlly</span>

          <h1 className={styles.title}>Acesse a plataforma</h1>

          <p className={styles.description}>
            Entre para continuar organizando ideias, analisando projetos e
            construindo propostas de forma mais visual e moderna.
          </p>

          <div className={styles.featureList}>
            <div className={styles.featureItem}>
              <span className={styles.featureDot} />
              <p>Ambiente moderno para apoio a projetos</p>
            </div>

            <div className={styles.featureItem}>
              <span className={styles.featureDot} />
              <p>Visual limpo, elegante e profissional</p>
            </div>

            <div className={styles.featureItem}>
              <span className={styles.featureDot} />
              <p>Login apenas demonstrativo para navegação</p>
            </div>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <form className={styles.formCard} onSubmit={handleSubmit}>
            <div className={styles.formHeader}>
              <h2>Entrar</h2>
              <p>Digite e-mail e senha para acessar</p>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="text"
                placeholder="Digite qualquer e-mail"
                autoComplete="off"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              {errors.email ? (
                <span className={styles.errorMessage}>{errors.email}</span>
              ) : null}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Senha</label>

              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite qualquer senha"
                  autoComplete="off"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />

                <button
                  type="button"
                  className={styles.showButton}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              {errors.password ? (
                <span className={styles.errorMessage}>{errors.password}</span>
              ) : null}
            </div>

            <div className={styles.formOptions}>
              <label className={styles.rememberMe}>
                <input type="checkbox" />
                <span>Lembrar acesso</span>
              </label>

            </div>

            <button type="submit" className={styles.submitButton}>
              Entrar
            </button>

            <p className={styles.footerText}>
              Esta tela é apenas uma simulação visual de login.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;