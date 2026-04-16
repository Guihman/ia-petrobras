import styles from "./AreasPage.module.css";

//Areas Page . com

function AreasPage({
  areas,
  selectedArea,
  onSelectArea,
  onBack,
  onContinue,
}) {
  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <span className={styles.badge}>Etapa 2</span>
        <h2 className={styles.title}>Em que área vamos trabalhar hoje?</h2>
        <p className={styles.subtitle}>
          Escolha a frente de atuação para eu adaptar a conversa, a análise e o
          estilo das sugestões.
        </p>
      </div>

      <div className={styles.grid}>
        {areas.map((area) => {
          const isActive = selectedArea?.id === area.id;

          return (
            <button
              key={area.id}
              type="button"
              className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
              onClick={() => onSelectArea(area)}
              style={{ "--accent": area.accent }}
            >
              <div className={styles.thumbnail}>
                <span className={styles.icon}>{area.icon}</span>
              </div>

              <div className={styles.cardContent}>
                <h3>{area.title}</h3>
                <p>{area.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className={styles.actions}>
        <button className={styles.secondaryButton} onClick={onBack}>
          Voltar
        </button>

        <button className={styles.primaryButton} onClick={onContinue}>
          Continuar
        </button>
      </div>
    </section>
  );
}

export default AreasPage;