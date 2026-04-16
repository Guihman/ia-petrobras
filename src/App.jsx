import { useMemo, useState } from "react";
import styles from "./App.module.css";

import WelcomePage from "./pages/WelcomePage/WelcomePage";
import AreasPage from "./pages/AreasPage/AreasPage";
import ProjectPage from "./pages/ProjectPage/ProjectPage";
import WorkspacePage from "./pages/WorkspacePage/WorkspacePage";

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

const MODES = [
  {
    id: "assistente",
    label: "chat estilo assistente",
    description: "respostas mais guiadas e explicativas",
  },
  {
    id: "final",
    label: "chat estilo projeto final",
    description: "foco em proposta mais objetiva e pronta",
  },
  {
    id: "colaborativo",
    label: "pensa junto com você",
    description: "modo mais colaborativo e estratégico",
  },
];

const STEPS = ["Início", "Área", "Projeto", "Análise"];

function truncateText(text, max = 180) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trim()}...` : text;
}

function calculateChance(text) {
  const size = text.trim().length;

  if (size >= 240) return 89;
  if (size >= 180) return 83;
  if (size >= 120) return 78;
  if (size >= 70) return 72;
  return 66;
}

function buildInsights(areaTitle, description, activeMode) {
  const shortDescription = truncateText(description, 160);
  const chance = calculateChance(description);

  const introByMode = {
    assistente:
      "Organizei a conversa de forma clara para te ajudar a estruturar melhor a ideia antes de decidir o próximo passo.",
    final:
      "Transformei sua ideia em blocos mais objetivos, pensando em uma apresentação mais madura e pronta para proposta.",
    colaborativo:
      "Aqui eu penso junto com você, levantando caminhos, dúvidas importantes e pontos que podem fortalecer o projeto.",
  };

  const focusByMode = {
    assistente: "clareza e orientação",
    final: "estrutura final e viabilidade",
    colaborativo: "co-criação e refinamento",
  };

  return [
    {
      tag: "Leitura inicial",
      title: `Entendimento do projeto em ${areaTitle}`,
      content:
        shortDescription ||
        "Descreva sua ideia para que eu consiga organizar uma análise mais precisa.",
      question: "Qual problema principal esse projeto resolve na empresa?",
    },
    {
      tag: "Direção",
      title: "Explicando a ideia central",
      content: introByMode[activeMode],
      question: "Em que essa ideia deve ajudar a empresa na prática?",
    },
    {
      tag: "Valor",
      title: "Explicando as vantagens",
      content: `O foco atual está em ${focusByMode[activeMode]}. Vale mostrar ganho operacional, redução de risco, economia de tempo ou impacto financeiro.`,
      question: "Quais benefícios concretos a empresa perceberia primeiro?",
    },
    {
      tag: "Atenção",
      title: "Explicando as desvantagens",
      content:
        "Todo projeto tem barreiras. Aqui entram custo inicial, adesão da equipe, integração com processos atuais e necessidade de dados.",
      question: "O que pode dificultar a implantação desse projeto?",
    },
    {
      tag: "Investimento",
      title: "Orçamento",
      content:
        "Podemos separar em desenvolvimento, infraestrutura, testes, operação e treinamento. Isso ajuda a deixar a proposta mais profissional.",
      question: "A empresa já teria verba, equipe ou tecnologia para começar?",
    },
    {
      tag: "Viabilidade",
      title: "Riscos",
      content: `As chances iniciais deste projeto dar certo estão em torno de ${chance}%, considerando o nível atual de detalhamento.`,
      question: "Qual seria o primeiro passo mais seguro para validar a ideia?",
    },
  ];
}

function App() {
  const [step, setStep] = useState(0);
  const [selectedArea, setSelectedArea] = useState(AREAS[0]);
  const [projectDescription, setProjectDescription] = useState("");
  const [activeMode, setActiveMode] = useState(MODES[0].id);

  const insights = useMemo(() => {
    return buildInsights(
      selectedArea?.title || "sua área",
      projectDescription,
      activeMode
    );
  }, [selectedArea, projectDescription, activeMode]);

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
          {step === 0 && <WelcomePage onStart={() => setStep(1)} />}

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
              onContinue={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <WorkspacePage
              selectedArea={selectedArea}
              projectDescription={projectDescription}
              modes={MODES}
              activeMode={activeMode}
              onChangeMode={setActiveMode}
              insights={insights}
              onBack={() => setStep(2)}
              onRestart={() => {
                setStep(0);
                setProjectDescription("");
                setSelectedArea(AREAS[0]);
                setActiveMode(MODES[0].id);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;