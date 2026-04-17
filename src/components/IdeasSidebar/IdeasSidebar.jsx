import styles from "./IdeasSidebar.module.css";

function formatDate(dateValue) {
  if (!dateValue) return "";

  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateValue));
  } catch {
    return "";
  }
}

function IdeasSidebar({
  userName,
  ideas,
  topIdeas,
  activeIdeaId,
  onNewIdea,
  onOpenIdea,
  onDeleteIdea,
}) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <div>
          <span className={styles.badge}>Workspace</span>
          <h2 className={styles.title}>Olá, {userName}</h2>
          <p className={styles.subtitle}>
            Suas ideias ficam salvas no navegador e podem ser reabertas depois.
          </p>
        </div>

        <button type="button" className={styles.newButton} onClick={onNewIdea}>
          + Nova ideia
        </button>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Top 3 scores</h3>
        </div>

        {topIdeas.length === 0 ? (
          <div className={styles.emptyBox}>
            Gere análises para montar o ranking automático.
          </div>
        ) : (
          <div className={styles.rankingList}>
            {topIdeas.map((idea, index) => (
              <button
                key={idea.id}
                type="button"
                className={styles.rankingCard}
                onClick={() => onOpenIdea(idea.id)}
              >
                <span className={styles.rankingPosition}>#{index + 1}</span>

                <div className={styles.rankingContent}>
                  <strong>{idea.title}</strong>
                  <small>{idea.areaTitle}</small>
                </div>

                <span className={styles.rankingScore}>{idea.score}/100</span>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Ideias salvas</h3>
          <span className={styles.counter}>{ideas.length}</span>
        </div>

        {ideas.length === 0 ? (
          <div className={styles.emptyBox}>
            Nenhuma ideia salva ainda. Crie uma nova ideia e gere a análise.
          </div>
        ) : (
          <div className={styles.ideaList}>
            {ideas.map((idea) => {
              const isActive = idea.id === activeIdeaId;

              return (
                <div
                  key={idea.id}
                  className={`${styles.ideaRow} ${
                    isActive ? styles.ideaRowActive : ""
                  }`}
                >
                  <button
                    type="button"
                    className={styles.ideaButton}
                    onClick={() => onOpenIdea(idea.id)}
                  >
                    <strong>{idea.title}</strong>
                    <small>{idea.areaTitle}</small>

                    <div className={styles.ideaMeta}>
                      <span className={styles.ideaScore}>
                        Score {idea.score}/100
                      </span>
                      <span>{formatDate(idea.updatedAt)}</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => onDeleteIdea(idea.id)}
                    aria-label={`Excluir ${idea.title}`}
                    title="Excluir ideia"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default IdeasSidebar;