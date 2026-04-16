import { useEffect, useState } from "react";
import styles from "./ProjectPage.module.css";

function ProjectPage({
  selectedArea,
  projectDescription,
  onChangeDescription,
  onBack,
  analysis,
}) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const isValid = projectDescription.trim().length >= 20;

  useEffect(() => {
    if (!isValid) {
      setShowAnalysis(false);
    }
  }, [isValid]);

  function handleGenerateAnalysis() {
    if (!isValid) return;
    setShowAnalysis(true);
  }

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.leftColumn}>
          <span className={styles.badge}>Etapa 3</span>

          <h2 className={styles.title}>Descreva a sua ideia</h2>

          <p className={styles.subtitle}>
            Escreva o problema, o objetivo e o que você imagina como solução.
            Esta mesma etapa já exibe score, pontos principais e a resposta da IA.
          </p>

          <div className={styles.areaBox}>
            <span className={styles.areaLabel}>Área selecionada</span>
            <strong>{selectedArea?.title}</strong>
          </div>

          <textarea
            className={styles.textarea}
            placeholder="Exemplo: queremos reduzir atrasos operacionais, melhorar previsibilidade, medir impacto financeiro e criar uma solução integrada com dados da operação..."
            value={projectDescription}
            onChange={(event) => onChangeDescription(event.target.value)}
          />

          <div className={styles.helperRow}>
            <span>Mínimo recomendado: 20 caracteres</span>
            <span>{projectDescription.trim().length} caracteres</span>
          </div>

          <div className={styles.actions}>
            <button className={styles.secondaryButton} onClick={onBack}>
              Voltar
            </button>

            <button
              className={styles.primaryButton}
              onClick={handleGenerateAnalysis}
              disabled={!isValid}
            >
              Gerar leitura inicial
            </button>
          </div>

          <p className={styles.integrationHint}>
            Este bloco já fica preparado para você substituir a lógica simulada
            pela resposta real da sua IA local.
          </p>
        </div>

        <div className={styles.rightColumn}>
          {!showAnalysis ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyStateBadge}>Painel da etapa 3</span>
              <h3>Score, pontos da ideia e resposta da IA</h3>
              <p>
                Digite a descrição do projeto e clique em{" "}
                <strong>Gerar leitura inicial</strong>. A análise aparecerá aqui,
                na própria etapa 3.
              </p>
            </div>
          ) : (
            <div className={styles.analysisPanel}>
              <div className={styles.scoreCard}>
                <span className={styles.scoreLabel}>Score da ideia</span>
                <strong className={styles.scoreValue}>
                  {analysis.score}
                  <small>/100</small>
                </strong>
                <p className={styles.scoreMeta}>{analysis.maturity}</p>
              </div>

              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Pontos principais da ideia</h3>
                <div className={styles.pillList}>
                  {analysis.highlights.map((item) => (
                    <span key={item} className={styles.pill}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Pontos de atenção</h3>
                <ul className={styles.pointList}>
                  {analysis.attentionPoints.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Resposta da IA</h3>
                <div className={styles.responseBox}>{analysis.aiResponse}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProjectPage;