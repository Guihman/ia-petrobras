import styles from "./WorkspacePage.module.css";

function WorkspacePage({
  selectedArea,
  projectDescription,
  modes,
  activeMode,
  onChangeMode,
  insights,
  onBack,
  onRestart,
}) {
  return (
    <section className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarBadge}>Modo de conversa</span>
          <h3>Como você quer trabalhar?</h3>
          <p>Escolha o estilo que mais combina com este momento do projeto.</p>
        </div>

        <div className={styles.modeList}>
          {modes.map((mode) => {
            const isActive = mode.id === activeMode;

            return (
              <button
                key={mode.id}
                type="button"
                className={`${styles.modeButton} ${
                  isActive ? styles.modeButtonActive : ""
                }`}
                onClick={() => onChangeMode(mode.id)}
              >
                <span className={styles.modeDot} />
                <span className={styles.modeText}>
                  <strong>{mode.label}</strong>
                  <small>{mode.description}</small>
                </span>
              </button>
            );
          })}
        </div>

        <div className={styles.sidebarFooter}>
          <button className={styles.secondaryButton} onClick={onBack}>
            Voltar
          </button>
          <button className={styles.primaryButton} onClick={onRestart}>
            Reiniciar fluxo
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <div className={styles.topRow}>
          <div className={styles.areaTag}>{selectedArea?.title}</div>

          <div className={styles.userBubble}>
            <span>Projeto informado</span>
            <p>{projectDescription}</p>
          </div>
        </div>

        <div className={styles.cards}>
          {insights.map((item) => (
            <article key={item.title} className={styles.card}>
              <span className={styles.cardTag}>{item.tag}</span>
              <h4>{item.title}</h4>
              <p>{item.content}</p>

              <div className={styles.questionBox}>{item.question}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WorkspacePage;