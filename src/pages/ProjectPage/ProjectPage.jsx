import { useEffect, useMemo, useState } from "react";
import styles from "./ProjectPage.module.css";

const API_URL =
  import.meta.env.VITE_EVALUATE_API_URL || "http://127.0.0.1:8000/evaluate";

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

  const isTitleValid = projectTitle.trim().length >= 3;
  const isDescriptionValid = projectDescription.trim().length >= 20;
  const isValid = isTitleValid && isDescriptionValid;

  useEffect(() => {
    if (!isValid) {
      setShowAnalysis(false);
      setErrorMessage("");
      setAnalysisData(null);
    }
  }, [isValid]);

  useEffect(() => {
    setErrorMessage("");
    setAnalysisData(null);
    setShowAnalysis(false);
  }, [projectTitle, projectDescription, selectedArea?.id]);

  const initialAnalysis = useMemo(() => {
    if (!analysis) return null;
    return analysis;
  }, [analysis]);

  useEffect(() => {
    if (initialAnalysis && !analysisData) {
      setAnalysisData(initialAnalysis);
      setShowAnalysis(true);
    }
  }, [initialAnalysis, analysisData]);

  function getMaturityLabel(score100) {
    if (score100 >= 80) return "Alta aderência inicial";
    if (score100 >= 60) return "Boa aderência com ajustes";
    if (score100 >= 40) return "Potencial moderado";
    return "Ideia ainda precisa amadurecer";
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

    if (areaTitle) {
      highlights.push(`Área: ${areaTitle}`);
    }

    if (data?.viabilidade_tecnica !== undefined) {
      highlights.push(`Viabilidade técnica: ${data.viabilidade_tecnica}/10`);
    }

    if (data?.impacto_co2 !== undefined) {
      highlights.push(`Impacto em CO₂: ${data.impacto_co2}/10`);
    }

    if (data?.custo) {
      highlights.push(`Custo: ${capitalize(data.custo)}`);
    }

    if (data?.risco) {
      highlights.push(`Risco: ${capitalize(data.risco)}`);
    }

    return highlights.length > 0
      ? highlights
      : ["Ideia recebida pela IA", "Análise inicial concluída"];
  }

  function buildAttentionPointsFromApi(data) {
    const attentionPoints = [];

    if (data?.tempo_implementacao) {
      attentionPoints.push(
        `Tempo de implementação: ${capitalize(data.tempo_implementacao)}`
      );
    }

    if (data?.custo) {
      attentionPoints.push(
        `Avaliar orçamento e viabilidade financeira: ${capitalize(data.custo)}`
      );
    }

    if (data?.risco) {
      attentionPoints.push(
        `Monitorar risco de execução: ${capitalize(data.risco)}`
      );
    }

    if (attentionPoints.length === 0) {
      attentionPoints.push("Detalhar melhor escopo, custo e implementação.");
    }

    return attentionPoints;
  }

  function adaptApiResponseToUi(apiResponse, areaTitle) {
    const resumo = apiResponse?.resumo ?? {};
    const dados = apiResponse?.dados ?? {};
    const source = Object.keys(resumo).length > 0 ? resumo : dados;

    const rawScore = Number(apiResponse?.score_final ?? source?.score_final ?? 0);
    const score100 = Number.isFinite(rawScore) ? Math.round(rawScore * 10) : 0;

    const justificativa = normalizeText(
      source?.justificativa,
      "Sem justificativa retornada."
    );
    const comparacao = normalizeText(
      source?.comparacao,
      "Sem comparação retornada."
    );
    const risco = capitalize(source?.risco, "não informado");
    const custo = capitalize(source?.custo, "não informado");
    const tempo = capitalize(source?.tempo_implementacao, "não informado");

    return {
      score: score100,
      maturity: `${getMaturityLabel(score100)} • Risco ${risco}`,
      highlights: buildHighlightsFromApi(source, areaTitle),
      attentionPoints: buildAttentionPointsFromApi(source),
      aiResponse: `${justificativa}\n\nComparação: ${comparacao}`,
      meta: {
        risco,
        custo,
        tempo,
        viabilidadeTecnica:
          source?.viabilidade_tecnica !== undefined
            ? Number(source.viabilidade_tecnica)
            : null,
        impactoCo2:
          source?.impacto_co2 !== undefined ? Number(source.impacto_co2) : null,
      },
      raw: apiResponse,
    };
  }

  async function handleGenerateAnalysis() {
    if (!isValid || loading) return;

    try {
      setLoading(true);
      setErrorMessage("");
      setShowAnalysis(true);

      const ideiaPayload = `Título da ideia: ${projectTitle.trim()}
Área: ${selectedArea?.title || "Não informada"}
Descrição: ${projectDescription.trim()}`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Bypass-Tunnel-Reminder": "true"
        },
        body: JSON.stringify({
          ideia: ideiaPayload,
        }),
      });

      if (!response.ok) {
        let message = "Erro ao gerar análise.";
        try {
          const errorData = await response.json();
          if (errorData?.detail) {
            message = String(errorData.detail);
          }
        } catch {
          // ignora erro ao ler body de erro
        }
        throw new Error(message);
      }

      const data = await response.json();
      const adapted = adaptApiResponseToUi(data, selectedArea?.title);
      setAnalysisData(adapted);
      onAnalysisReady?.(adapted);
    } catch (error) {
      console.error("Erro ao avaliar ideia:", error);
      setAnalysisData(null);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível gerar a análise."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.leftColumn}>
          <span className={styles.badge}>Etapa 3</span>

          <h2 className={styles.title}>Descreva a sua ideia</h2>

          <p className={styles.subtitle}>
            Agora você pode dar um nome para a ideia, salvar o histórico e
            montar um ranking automático com os melhores scores.
          </p>

          <div className={styles.areaBox}>
            <span className={styles.areaLabel}>Área selecionada</span>
            <strong>{selectedArea?.title || "Não informada"}</strong>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="projectTitle">
              Nome da ideia
            </label>
            <input
              id="projectTitle"
              type="text"
              className={styles.textInput}
              placeholder="Ex.: Redução de emissões em operações offshore"
              value={projectTitle}
              onChange={(event) => onChangeTitle(event.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="projectDescription">
              Descrição da ideia
            </label>
            <textarea
              id="projectDescription"
              className={styles.textarea}
              placeholder="Exemplo: queremos reduzir atrasos operacionais, melhorar previsibilidade, medir impacto financeiro e criar uma solução integrada com dados da operação..."
              value={projectDescription}
              onChange={(event) => onChangeDescription(event.target.value)}
            />
          </div>

          <div className={styles.helperRow}>
            <span>Título mínimo: 3 caracteres</span>
            <span>Descrição mínima: 20 caracteres</span>
          </div>

          <div className={styles.counterRow}>
            <span>{projectTitle.trim().length} caracteres no título</span>
            <span>{projectDescription.trim().length} caracteres na descrição</span>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onBack}
              disabled={loading}
            >
              Voltar
            </button>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleGenerateAnalysis}
              disabled={!isValid || loading}
            >
              {loading ? "Gerando análise..." : "Gerar leitura inicial"}
            </button>

            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onRestart}
              disabled={loading}
            >
              Reiniciar
            </button>
          </div>

          {errorMessage ? (
            <p className={styles.integrationHint} role="alert">
              {errorMessage}
            </p>
          ) : (
            <p className={styles.integrationHint}>
              A análise salva automaticamente a ideia na barra lateral.
            </p>
          )}
        </div>

        <div className={styles.rightColumn}>
          {!showAnalysis ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyStateBadge}>Painel da etapa 3</span>
              <h3>Score, pontos da ideia e resposta da IA</h3>
              <p>
                Dê um nome à ideia, escreva a descrição e clique em{" "}
                <strong>Gerar leitura inicial</strong>. O resultado aparecerá
                aqui e também entrará no ranking.
              </p>
            </div>
          ) : loading ? (
            <div className={styles.analysisPanel}>
              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Analisando sua ideia</h3>
                <div className={styles.responseBox}>
                  A IA local está processando a descrição enviada...
                </div>
              </div>
            </div>
          ) : analysisData ? (
            <div className={styles.analysisPanel}>
              <div className={styles.scoreCard}>
                <span className={styles.scoreLabel}>Score da ideia</span>
                <strong className={styles.scoreValue}>
                  {analysisData.score}
                  <small>/100</small>
                </strong>
                <p className={styles.scoreMeta}>{analysisData.maturity}</p>
              </div>

              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Pontos principais</h3>
                <div className={styles.pillList}>
                  {analysisData.highlights.map((item) => (
                    <span key={item} className={styles.pill}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Pontos de atenção</h3>
                <ul className={styles.pointList}>
                  {analysisData.attentionPoints.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Resposta da IA</h3>
                <div className={styles.responseBox}>{analysisData.aiResponse}</div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyStateBadge}>Painel da etapa 3</span>
              <h3>Não foi possível montar a análise</h3>
              <p>Tente novamente após ajustar o texto da ideia.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProjectPage;