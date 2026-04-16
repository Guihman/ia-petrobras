import styles from "./ProjectPage.module.css";

function ProjectPage({
  selectedArea,
  projectDescription,
  onChangeDescription,
  onBack,
  onContinue,
}) {
  const isValid = projectDescription.trim().length >= 20;

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <span className={styles.badge}>Etapa 3</span>
        <h2 className={styles.title}>Fale sobre seu projeto</h2>

        <p className={styles.subtitle}>
          Conte a ideia com liberdade. Quanto mais contexto você colocar, melhor
          fica a análise.
        </p>

        <div className={styles.areaBox}>
          <span className={styles.areaLabel}>Área selecionada</span>
          <strong>{selectedArea?.title}</strong>
        </div>

        <textarea
          className={styles.textarea}
          placeholder="Exemplo: queremos uma solução para reduzir atrasos na operação, melhorar previsibilidade, organizar custos e apoiar decisões com dados..."
          value={projectDescription}
          onChange={(event) => onChangeDescription(event.target.value)}
        />

        <div className={styles.footer}>
          <span className={styles.hint}>
            Mínimo recomendado: 20 caracteres
          </span>

          <span className={styles.counter}>
            {projectDescription.trim().length} caracteres
          </span>
        </div>

        <div className={styles.actions}>
          <button className={styles.secondaryButton} onClick={onBack}>
            Voltar
          </button>

          <button
            className={styles.primaryButton}
            onClick={onContinue}
            disabled={!isValid}
          >
            Analisar projeto
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProjectPage;