import { useMemo } from "react";
import styles from "./WorkspacePage.module.css";

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "Não informado";
  }

  return Number(value).toFixed(1);
}

function buildQuestionsByMode(activeMode, analysisData) {
  const risco = analysisData?.meta?.risco || "Não informado";
  const custo = analysisData?.meta?.custo || "Não informado";
  const tempo = analysisData?.meta?.tempo || "Não informado";

  switch (activeMode) {
    case "tecnico":
      return [
        "Quais dados ou evidências já existem para validar tecnicamente essa proposta?",
        `Como reduzir o risco atual (${risco}) antes de escalar a solução?`,
        `O tempo de implementação (${tempo}) é compatível com o desafio?`,
      ];
    case "estrategico":
      return [
        `O custo estimado (${custo}) cabe no cenário de implantação atual?`,
        "Quais ganhos de negócio justificam priorizar essa ideia agora?",
        "Como diferenciar essa proposta de alternativas já existentes?",
      ];
    case "criativo":
      return [
        "Que versão mais simples poderia ser prototipada em poucos dias?",
        "Como transformar essa ideia em uma proposta mais clara e memorável?",
        "Que parceria ou tecnologia pode acelerar a execução?",
      ];
    default:
      return [
        "Qual é o primeiro teste pequeno que valida essa hipótese?",
        "Que riscos precisam ser tratados antes da próxima etapa?",
        "Como medir o valor gerado pela proposta?",
      ];
  }
}

function buildRealInsights(analysisData, activeMode) {
  if (!analysisData) return [];

  const questions = buildQuestionsByMode(activeMode, analysisData);
  const raw = analysisData.raw || {};
  const dados = raw.dados || raw.resumo || {};

  return [
    {
      tag: "Score",
      title: "Leitura geral da proposta",
      content: `A análise inicial posiciona a ideia com score ${analysisData.score}/100 e maturidade "${analysisData.maturity}".`,
      question: questions[0],
    },
    {
      tag: "Indicadores",
      title: "Viabilidade, impacto e esforço",
      content: `Viabilidade técnica: ${formatNumber(
        analysisData.meta?.viabilidadeTecnica
      )}. Impacto em CO₂: ${formatNumber(
        analysisData.meta?.impactoCo2
      )}. Custo: ${analysisData.meta?.custo || "Não informado"}. Tempo: ${
        analysisData.meta?.tempo || "Não informado"
      }.`,
      question: questions[1],
    },
    {
      tag: "IA",
      title: "Síntese do parecer da IA",
      content:
        analysisData.aiResponse ||
        dados.justificativa ||
        "A IA não retornou uma síntese textual.",
      question: questions[2],
    },
  ];
}

function WorkspacePage({
  selectedArea,
  projectTitle,
  projectDescription,
  modes,
  activeMode,
  onChangeMode,
  insights,
  onBack,
  onRestart,
  analysisData,
}) {
  const cards = useMemo(() => {
    const realInsights = buildRealInsights(analysisData, activeMode);
    return realInsights.length > 0 ? realInsights : insights;
  }, [analysisData, activeMode, insights]);

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
            <span>{projectTitle || "Projeto informado"}</span>
            <p>{projectDescription}</p>
          </div>
        </div>

        {!analysisData ? (
          <div className={styles.cards}>
            <article className={styles.card}>
              <span className={styles.cardTag}>Workspace</span>
              <h4>Aguardando análise real</h4>
              <p>
                Primeiro gere a leitura inicial na etapa 3. Assim que a API
                responder, este workspace passará a usar os dados reais da IA.
              </p>

              <div className={styles.questionBox}>
                Volte uma etapa, envie a ideia para a API e depois retorne para
                continuar a exploração.
              </div>
            </article>
          </div>
        ) : (
          <div className={styles.cards}>
            {cards.map((item) => (
              <article key={item.title} className={styles.card}>
                <span className={styles.cardTag}>{item.tag}</span>
                <h4>{item.title}</h4>
                <p>{item.content}</p>

                <div className={styles.questionBox}>{item.question}</div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default WorkspacePage;
