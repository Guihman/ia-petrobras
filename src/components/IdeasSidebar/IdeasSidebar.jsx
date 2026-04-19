import styles from "./IdeasSidebar.module.css";

// Formata para Milhões de Dólares (ex: 50M -> $ 50.000.000)
function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateValue) {
  if (!dateValue) return "";
  const d = new Date(dateValue);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function IdeasSidebar({
  userName,
  ideas = [],
  topIdeas = [],
  activeIdeaId,
  onNewIdea,
  onOpenIdea,
  onDeleteIdea,
}) {
  // SIMULAÇÃO: META DE POUPANÇA NET ZERO
  const metaEconomia = 1000000000; // Meta: Poupar 1 Bilião USD com novas tecnologias
  
  // Calcula o total poupado. 
  // Usa o valor retornado pela IA, ou um valor médio (ex: 45 Milhões) se a API ainda não estiver ligada.
  const economiaGerada = ideas.reduce((acc, idea) => {
    const valorIA = idea.analysis?.resumo?.potencial_economia;
    const valorAdicionado = valorIA ? Number(valorIA) * 1000000 : 45000000;
    return acc + valorAdicionado;
  }, 0);

  // Percentagem do objetivo atingido
  const percentagemAtingida = Math.min((economiaGerada / metaEconomia) * 100, 100);

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <div>
          <span className={styles.badge}>Meta Net Zero 2050</span>
          <h2 className={styles.title}>Olá{userName ? `, ${userName}` : ''}</h2>
          <p className={styles.subtitle}>
            Avalie o retorno financeiro (ROI) do seu portfólio de projetos de descarbonização.
          </p>
        </div>

        {/* PAINEL DE MÉTRICAS: FOCO EM POUPANÇA */}
        <div className={styles.metricsPanel}>
          <div className={styles.metricRow}>
            <small>Economia Gerada (OPEX / Multas Evitadas)</small>
            <strong style={{ color: '#4dd4a0' }}>{formatCurrency(economiaGerada)}</strong>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ 
                width: `${percentagemAtingida}%`, 
                backgroundColor: '#4dd4a0' // Verde constante porque é algo positivo
              }}
            />
          </div>
          <small className={styles.budgetWarning}>
            Meta: {formatCurrency(metaEconomia)}
          </small>
        </div>

        <button type="button" className={styles.newButton} onClick={onNewIdea}>
          + Nova Estratégia
        </button>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Maior Potencial de Mitigação</h3>
        </div>

        {topIdeas.length === 0 ? (
          <div className={styles.emptyBox}>
            Nenhuma estratégia validada ainda.
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
                <div className={styles.rankingPosition}>{index + 1}</div>
                <div className={styles.rankingContent}>
                  <strong>{idea.title}</strong>
                  <span className={styles.rankingScore}>
                    Score IA: {idea.score}/100
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Lista Geral de Ideias */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Todas as Estratégias</h3>
          <span className={styles.counter}>{ideas.length}</span>
        </div>

        {ideas.length === 0 ? (
          <div className={styles.emptyBox}>
            Nenhuma estratégia criada.
          </div>
        ) : (
          <div className={styles.ideaList}>
            {ideas.map((idea) => {
              const isActive = idea.id === activeIdeaId;
              return (
                <div
                  key={idea.id}
                  className={`${styles.ideaRow} ${isActive ? styles.ideaRowActive : ""}`}
                >
                  <button
                    type="button"
                    className={styles.ideaButton}
                    onClick={() => onOpenIdea(idea.id)}
                  >
                    <strong>{idea.title}</strong>
                    <small>{formatDate(idea.createdAt)}</small>
                    <div className={styles.ideaMeta}>
                      <span className={styles.ideaScore}>Aprovado</span>
                      <span>{idea.area}</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => onDeleteIdea(idea.id)}
                    title="Apagar estratégia"
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