import { useEffect, useMemo, useState } from "react";
import styles from "./ProjectPage.module.css";

const API_URL = import.meta.env.VITE_EVALUATE_API_URL || "http://127.0.0.1:8000/evaluate";

function ProjectPage({
  selectedArea,
  projectTitle,
  projectDescription,
  onChangeTitle,
  onChangeDescription,
  onBack,
  analysis,
  onAnalysisReady,
  onRestart,
}) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [analysisData, setAnalysisData] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("Iniciando motor LlamaCPP...");

  const isTitleValid = projectTitle.trim().length >= 3;
  const isDescriptionValid = projectDescription.trim().length >= 20;
  const isValid = isTitleValid && isDescriptionValid;

  // Loader com mensagens estratégicas para o Hackathon
  useEffect(() => {
    let interval;
    if (loading) {
      const steps = [
        "Iniciando motor LlamaCPP off-grid...",
        "Cruzando dados com o Plano Estratégico da Petrobras...",
        "Analisando metas Net Zero 2050...",
        "Avaliando viabilidade financeira (CAPEX/OPEX)...",
        "Calculando impacto de mitigação de CO₂...",
        "Estruturando parecer técnico final..."
      ];
      let stepIndex = 0;
      setLoadingMessage(steps[0]);
      interval = setInterval(() => {
        stepIndex++;
        if (stepIndex < steps.length) setLoadingMessage(steps[stepIndex]);
      }, 15000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // --- FUNÇÕES DE TRATAMENTO DE DADOS (DADOS IMPORTADOS E MANTIDOS) ---

  function getMaturityLabel(score100) {
    if (score100 >= 80) return "ALTA ADERÊNCIA • Aprovado para Portfólio";
    if (score100 >= 60) return "BOA ADERÊNCIA • Em Análise Técnica";
    if (score100 >= 40) return "POTENCIAL MODERADO • Requer Revisão";
    return "REPROVADA • Inviabilidade Técnica ou Lógica"; // Rigor para ideias absurdas
  }

  function normalizeText(value, fallback = "Não informado") {
    if (value === null || value === undefined) return fallback;
    const text = String(value).trim();
    return text ? text : fallback;
  }

  function capitalize(value, fallback = "Não informado") {
    const normalized = normalizeText(value, fallback);
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }

  function buildHighlightsFromApi(data, areaTitle) {
    const highlights = [];
    if (areaTitle) highlights.push(`Área: ${areaTitle}`);
    if (data?.potencial_economia) highlights.push(`Economia: US$ ${data.potencial_economia}M`);
    if (data?.viabilidade_tecnica) highlights.push(`Viabilidade: ${data.viabilidade_tecnica}/10`);
    if (data?.impacto_co2) highlights.push(`Impacto CO₂: ${data.impacto_co2}/10`);
    return highlights.length > 0 ? highlights : ["Análise inicial concluída"];
  }

  function buildAttentionPointsFromApi(data) {
    const points = [];
    if (data?.risco) points.push(`Risco Detectado: ${capitalize(data.risco)}`);
    if (data?.custo) points.push(`Complexidade Financeira: ${capitalize(data.custo)}`);
    if (data?.tempo_implementacao) points.push(`Prazo Estimado: ${capitalize(data.tempo_implementacao)}`);
    return points.length > 0 ? points : ["Detalhamento de riscos pendente"];
  }

  function adaptApiResponseToUi(apiResponse, areaTitle) {
    const source = apiResponse?.resumo ?? apiResponse?.dados ?? apiResponse ?? {};
    const rawScore = Number(apiResponse?.score_final ?? source?.score_final ?? 0);
    const score100 = Math.round(rawScore * 10);

    return {
      score: score100,
      maturity: getMaturityLabel(score100),
      highlights: buildHighlightsFromApi(source, areaTitle),
      attentionPoints: buildAttentionPointsFromApi(source),
      aiResponse: normalizeText(source?.justificativa),
      // Novos dados para resposta completa
      netZero: normalizeText(source?.impacto_net_zero, "Análise de impacto climático em processamento."),
      financeiro: normalizeText(source?.viabilidade_financeira, "Análise de viabilidade econômica e ROI em processamento."),
      aplicacao: normalizeText(source?.plano_aplicacao, "Plano estratégico de implementação em processamento."),
      meta: source
    };
  }

  // --- HANDLERS ---

  async function handleGenerateAnalysis() {
    if (!isValid || loading) return;
    try {
      setLoading(true);
      setErrorMessage("");
      setShowAnalysis(true);

      const payload = {
        ideia: `Aja como um Consultor Técnico da Petrobras. Analise rigorosamente:
        TÍTULO: ${projectTitle}
        ÁREA: ${selectedArea?.title}
        DESCRIÇÃO: ${projectDescription}
        
        Sua resposta deve ser detalhada e incluir obrigatoriamente:
        1. justificativa (Técnica e profunda)
        2. impacto_net_zero (Alinhamento com 2050)
        3. viabilidade_financeira (CAPEX/OPEX e Sistema Financeiro)
        4. plano_aplicacao (Passo a passo)
        Se a ideia for impossível (ex: algas fora d'água), dê nota final zero.`
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro na comunicação com a IA.");
      const data = await response.json();
      setAnalysisData(adaptApiResponseToUi(data, selectedArea?.title));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        {/* Coluna de Input */}
        <div className={styles.leftColumn}>
          <h2 className={styles.title}>Descreva sua Ideia</h2>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Nome do Projeto</label>
            <input className={styles.textInput} value={projectTitle} onChange={(e) => onChangeTitle(e.target.value)} />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Descrição Técnica</label>
            <textarea className={styles.textarea} value={projectDescription} onChange={(e) => onChangeDescription(e.target.value)} />
          </div>
          <div className={styles.actions}>
            <button className={styles.secondaryButton} onClick={onBack}>Voltar</button>
            <button className={styles.primaryButton} onClick={handleGenerateAnalysis} disabled={!isValid || loading}>
              {loading ? "Processando..." : "Gerar Parecer Completo"}
            </button>
          </div>
        </div>

        {/* Coluna de Resultados */}
        <div className={styles.rightColumn}>
          {!showAnalysis ? (
            <div className={styles.emptyState}>
              <h3>Painel de Análise Estratégica</h3>
              <p>Aguardando submissão para cruzamento de dados.</p>
            </div>
          ) : loading ? (
            <div className={styles.analysisPanel}>
              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Processamento Local Ativo</h3>
                <div className={styles.responseBox}>
                  <strong style={{ color: "#4ade80" }}>{loadingMessage}</strong>
                </div>
              </div>
            </div>
          ) : analysisData ? (
            <div className={styles.analysisPanel}>
              <div className={styles.scoreCard}>
                <span className={styles.scoreLabel}>Score de Viabilidade</span>
                <strong className={styles.scoreValue}>{analysisData.score}/100</strong>
                <p className={styles.scoreMeta}>{analysisData.maturity}</p>
              </div>

              {/* Seção Principal de Resposta */}
              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Parecer Técnico Detalhado</h3>
                <div className={styles.responseBox}>{analysisData.aiResponse}</div>
              </div>

              {/* NOVO: Alinhamento Net Zero */}
              <div className={styles.sectionCard} style={{ borderLeft: "4px solid #4ade80" }}>
                <h3 className={styles.sectionTitle}>🌍 Impacto Net Zero 2050</h3>
                <div className={styles.responseBox}>{analysisData.netZero}</div>
              </div>

              {/* NOVO: Viabilidade Financeira */}
              <div className={styles.sectionCard} style={{ borderLeft: "4px solid #3b82f6" }}>
                <h3 className={styles.sectionTitle}>💰 Sistema Financeiro & Viabilidade</h3>
                <div className={styles.responseBox}>{analysisData.financeiro}</div>
              </div>

              {/* NOVO: Plano de Aplicação */}
              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>🚀 Plano de Aplicação</h3>
                <div className={styles.responseBox}>{analysisData.aplicacao}</div>
              </div>

              <button className={styles.printButton} onClick={() => window.print()}>
                Exportar Relatório PDF
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default ProjectPage;