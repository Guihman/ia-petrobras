import styles from "./WelcomePage.module.css";

function WelcomePage({ onStart }) {
  return (
    <section className={styles.page}>
      <div className={styles.content}>
        <span className={styles.badge}>Assistente de projetos</span>

        <h1 className={styles.title}>Bem-vindo à PetroAlly</h1>

        <p className={styles.subtitle}>
          Estou aqui para te ajudar a estruturar ideias, analisar projetos e
          transformar informações em decisões mais claras.
        </p>

        <div className={styles.actions}>
          <button className={styles.primaryButton} onClick={onStart}>
            Vamos lá
          </button>
        </div>
      </div>
    </section>
  );
}

export default WelcomePage;