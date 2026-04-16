import { useMemo, useState } from "react";
import styles from "./App.module.css";

import LoginPage from "./pages/LoginPage/LoginPage";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import AreasPage from "./pages/AreasPage/AreasPage";
import ProjectPage from "./pages/ProjectPage/ProjectPage";

const AREAS = [
  {
    id: "offshore",
    title: "Offshore",
    subtitle: "Operações, ativos marítimos e suporte técnico",
    icon: "🌊",
    accent: "#5aa9ff",
  },
  {
    id: "orcamento",
    title: "Orçamento",
    subtitle: "Custos, cenários financeiros e viabilidade",
    icon: "📊",
    accent: "#ff7b72",
  },
  {
    id: "logistica",
    title: "Logística de transporte",
    subtitle: "Fluxos, distribuição e otimização operacional",
    icon: "🚛",
    accent: "#ffb347",
  },
  {
    id: "energia",
    title: "Energia renovável",
    subtitle: "Soluções limpas, eficiência e inovação",
    icon: "🌱",
    accent: "#4dd4a0",
  },
  {
    id: "onshore",
    title: "Onshore",
    subtitle: "Produção em terra, segurança e manutenção",
    icon: "🛢️",
    accent: "#9f8cff",
  },
  {
    id: "itens",
    title: "Itens que a empresa precisa",
    subtitle: "Recursos, materiais, suprimentos e prioridades",
    icon: "📦",
    accent: "#4ec5ff",
  },
];

const STEPS = ["Início", "Área", "Projeto"];

function includesAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function uniqueLimited(items, limit = 4) {
  return [...new Set(items)].slice(0, limit);
}

function buildProjectReview(areaTitle, description) {
  const text = description.trim();

  if (!text) {
    return {
      score: 0,
      maturity: "Preencha a descrição para gerar a leitura inicial.",
      highlights: [],
      attentionPoints: [],
      aiResponse:
        "Quando você descrever a ideia e clicar em “Gerar leitura inicial”, esta área poderá mostrar a resposta da IA local.",
    };
  }

  const normalized = text.toLowerCase();
  let score = 42;
  const highlights = [];
  const attentionPoints = [];

  if (text.length >= 80) score += 10;
  if (text.length >= 140) score += 10;
  if (text.length >= 220) score += 8;

  if (
    includesAny(normalized, [
      "problema",
      "dor",
      "desafio",
      "dificuldade",
      "gargalo",
    ])
  ) {
    score += 6;
    highlights.push("A descrição deixa claro qual problema precisa ser resolvido.");
  }

  if (
    includesAny(normalized, [
      "dados",
      "indicador",
      "indicadores",
      "dashboard",
      "monitoramento",
      "métrica",
      "metricas",
      "métricas",
    ])
  ) {
    score += 7;
    highlights.push("A ideia considera dados e indicadores para apoiar decisões.");
  }

  if (
    includesAny(normalized, [
      "api",
      "integração",
      "integracao",
      "sistema",
      "erp",
      "plataforma",
      "banco",
    ])
  ) {
    score += 6;
    highlights.push("Existe visão de integração com sistemas ou fontes técnicas.");
  }

  if (
    includesAny(normalized, [
      "custo",
      "economia",
      "redução",
      "reducao",
      "retorno",
      "roi",
      "orçamento",
      "orcamento",
    ])
  ) {
    score += 6;
    highlights.push("A proposta já aponta impacto financeiro ou redução de custo.");
  }

  if (
    includesAny(normalized, [
      "segurança",
      "seguranca",
      "risco",
      "confiabilidade",
      "falha",
      "falhas",
    ])
  ) {
    score += 5;
    highlights.push("A ideia considera risco, segurança ou confiabilidade operacional.");
  }

  if (
    includesAny(normalized, [
      "eficiência",
      "eficiencia",
      "produtividade",
      "otimização",
      "otimizacao",
      "agilidade",
      "automat",
    ])
  ) {
    score += 6;
    highlights.push("Há foco em eficiência, agilidade ou automação do processo.");
  }

  if (
    includesAny(normalized, [
      "usuário",
      "usuario",
      "equipe",
      "operador",
      "colaborador",
      "cliente",
    ])
  ) {
    score += 4;
    highlights.push("O texto considera quem vai usar ou ser impactado pela solução.");
  }

  if (
    includesAny(normalized, [
      "piloto",
      "mvp",
      "teste",
      "validar",
      "validação",
      "validacao",
      "poc",
    ])
  ) {
    score += 5;
    highlights.push("Existe abertura para validar a ideia em piloto ou MVP.");
  }

  score = Math.min(97, score);

  if (
    !includesAny(normalized, [
      "dados",
      "indicador",
      "indicadores",
      "dashboard",
      "monitoramento",
      "métrica",
      "metricas",
      "métricas",
    ])
  ) {
    attentionPoints.push(
      "Definir quais dados, indicadores ou evidências vão sustentar a solução."
    );
  }

  if (
    !includesAny(normalized, [
      "usuário",
      "usuario",
      "equipe",
      "operador",
      "colaborador",
      "cliente",
    ])
  ) {
    attentionPoints.push(
      "Especificar melhor quem será o usuário principal e como acontecerá a adoção."
    );
  }

  if (
    !includesAny(normalized, [
      "api",
      "integração",
      "integracao",
      "sistema",
      "erp",
      "plataforma",
      "banco",
    ])
  ) {
    attentionPoints.push(
      "Mapear integrações, origem das informações e dependências técnicas."
    );
  }

  if (
    !includesAny(normalized, [
      "piloto",
      "mvp",
      "teste",
      "validar",
      "validação",
      "validacao",
      "poc",
    ])
  ) {
    attentionPoints.push(
      "Planejar um piloto curto para validar a proposta antes de ampliar o escopo."
    );
  }

  if (
    !includesAny(normalized, [
      "custo",
      "economia",
      "redução",
      "reducao",
      "retorno",
      "roi",
      "orçamento",
      "orcamento",
    ])
  ) {
    attentionPoints.push(
      "Traduzir a ideia em ganho financeiro, economia ou produtividade mensurável."
    );
  }

  const finalHighlights = uniqueLimited(
    highlights.length > 0
      ? highlights
      : [
          `A proposta está alinhada à área de ${areaTitle}.`,
          "A ideia já permite uma leitura inicial do objetivo.",
          "Há potencial para evoluir isso para um MVP.",
        ],
    4
  );

  const finalAttentionPoints = uniqueLimited(
    attentionPoints.length > 0
      ? attentionPoints
      : [
          "Definir um escopo inicial enxuto.",
          "Estabelecer critérios de sucesso para a primeira versão.",
          "Planejar a validação com usuários ou operação.",
        ],
    4
  );

  let maturity = "Ideia promissora, mas ainda pede mais detalhamento.";
  if (score >= 70) {
    maturity = "Boa base para evoluir com escopo, validação e indicadores.";
  }
  if (score >= 85) {
    maturity = "Ideia bem encaminhada para virar proposta ou MVP.";
  }

  const aiResponse = `Leitura inicial simulada: a proposta para ${areaTitle} mostra potencial e já apresenta um bom direcionamento. O score atual é ${score}/100, indicando que a ideia está em um nível ${score >= 85 ? "forte" : score >= 70 ? "intermediário" : "inicial"} de maturidade. Os pontos mais consistentes estão ligados a ${finalHighlights
    .slice(0, 2)
    .map((item) => item.toLowerCase())
    .join(" e ")}. Antes da implementação, eu priorizaria ${finalAttentionPoints[0].toLowerCase()} Depois, recomendaria estruturar um piloto simples, com objetivo claro, métrica de sucesso e retorno esperado. Este bloco já está pronto para você substituir pela resposta real da sua IA local quando integrar o modelo ao projeto.`;

  return {
    score,
    maturity,
    highlights: finalHighlights,
    attentionPoints: finalAttentionPoints,
    aiResponse,
  };
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("Usuário");
  const [step, setStep] = useState(0);
  const [selectedArea, setSelectedArea] = useState(AREAS[0]);
  const [projectDescription, setProjectDescription] = useState("");

  const analysis = useMemo(() => {
    return buildProjectReview(selectedArea?.title || "sua área", projectDescription);
  }, [selectedArea, projectDescription]);

  function handleFakeLogin({ email }) {
    const baseName = email.split("@")[0]?.trim();

    const normalizedName =
      baseName && baseName.length > 0
        ? baseName.charAt(0).toUpperCase() + baseName.slice(1)
        : "Usuário";

    setUserName(normalizedName);
    setIsAuthenticated(true);
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleFakeLogin} />;
  }

  return (
    <div className={styles.app}>
      <div className={styles.noise} />
      <div className={styles.frame}>
        <div className={styles.glowTop} />
        <div className={styles.glowBottom} />

        <header className={styles.topbar}>
          <div className={styles.brand}>
            <div className={styles.brandDot} />
            <span>NCI Project Flow</span>
          </div>

          <div className={styles.progress}>
            {STEPS.map((item, index) => (
              <div
                key={item}
                className={`${styles.progressItem} ${
                  index <= step ? styles.progressItemActive : ""
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </header>

        <main className={styles.content}>
          {step === 0 && (
            <WelcomePage onStart={() => setStep(1)} userName={userName} />
          )}

          {step === 1 && (
            <AreasPage
              areas={AREAS}
              selectedArea={selectedArea}
              onSelectArea={setSelectedArea}
              onBack={() => setStep(0)}
              onContinue={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <ProjectPage
              selectedArea={selectedArea}
              projectDescription={projectDescription}
              onChangeDescription={setProjectDescription}
              onBack={() => setStep(1)}
              analysis={analysis}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;