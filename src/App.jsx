import { useEffect, useMemo, useState } from "react";
import styles from "./App.module.css";

import LoginPage from "./pages/LoginPage/LoginPage";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import AreasPage from "./pages/AreasPage/AreasPage";
import ProjectPage from "./pages/ProjectPage/ProjectPage";
import IdeasSidebar from "./components/IdeasSidebar/IdeasSidebar";

const IDEAS_STORAGE_KEY = "nci_saved_ideas_v1";

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

function loadIdeasFromStorage() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(IDEAS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveIdeasToStorage(ideas) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(IDEAS_STORAGE_KEY, JSON.stringify(ideas));
  } catch {
    // ignora erro de storage
  }
}

function createIdeaId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `idea-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function buildIdeaTitle(projectTitle, description) {
  const manualTitle = (projectTitle || "").trim();
  if (manualTitle) return manualTitle;

  const normalizedDescription = (description || "").trim();
  if (!normalizedDescription) return "Nova ideia";

  const firstLine = normalizedDescription
    .split(/\r?\n/)
    .find((line) => line.trim());

  if (!firstLine) return "Nova ideia";

  return firstLine.length > 42
    ? `${firstLine.slice(0, 42).trim()}...`
    : firstLine;
}

function sortIdeasByRecency(ideas) {
  return [...ideas].sort((a, b) => {
    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return bTime - aTime;
  });
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("Usuário");

  const [step, setStep] = useState(0);
  const [selectedArea, setSelectedArea] = useState(AREAS[0]);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [analysisData, setAnalysisData] = useState(null);

  const [ideasHistory, setIdeasHistory] = useState(() =>
    sortIdeasByRecency(loadIdeasFromStorage())
  );
  const [activeIdeaId, setActiveIdeaId] = useState(null);

  useEffect(() => {
    saveIdeasToStorage(ideasHistory);
  }, [ideasHistory]);

  const topIdeas = useMemo(() => {
    return [...ideasHistory]
      .filter((item) => Number.isFinite(Number(item.score)))
      .sort((a, b) => {
        const scoreDiff = Number(b.score || 0) - Number(a.score || 0);
        if (scoreDiff !== 0) return scoreDiff;

        const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return bTime - aTime;
      })
      .slice(0, 3);
  }, [ideasHistory]);

  function handleFakeLogin({ email }) {
    const baseName = email.split("@")[0]?.trim();

    const normalizedName =
      baseName && baseName.length > 0
        ? baseName.charAt(0).toUpperCase() + baseName.slice(1)
        : "Usuário";

    setUserName(normalizedName);
    setIsAuthenticated(true);
  }

  function handleSelectArea(area) {
    setSelectedArea(area);
    setAnalysisData(null);
  }

  function handleChangeTitle(value) {
    setProjectTitle(value);
    setAnalysisData(null);
  }

  function handleChangeDescription(value) {
    setProjectDescription(value);
    setAnalysisData(null);
  }

  function handleAnalysisReady(result) {
    const normalizedTitle = buildIdeaTitle(projectTitle, projectDescription);
    const ideaId = activeIdeaId || createIdeaId();
    const now = new Date().toISOString();

    setProjectTitle(normalizedTitle);
    setAnalysisData(result);
    setActiveIdeaId(ideaId);

    setIdeasHistory((prev) => {
      const existing = prev.find((item) => item.id === ideaId);

      const nextIdea = {
        id: ideaId,
        title: normalizedTitle,
        description: projectDescription.trim(),
        areaId: selectedArea?.id || AREAS[0].id,
        areaTitle: selectedArea?.title || "Área não informada",
        score: Number(result?.score || 0),
        maturity: result?.maturity || "",
        analysisData: result,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
      };

      const nextIdeas = existing
        ? prev.map((item) => (item.id === ideaId ? nextIdea : item))
        : [nextIdea, ...prev];

      return sortIdeasByRecency(nextIdeas);
    });
  }

  function handleOpenIdea(ideaId) {
    const idea = ideasHistory.find((item) => item.id === ideaId);
    if (!idea) return;

    const matchedArea =
      AREAS.find((area) => area.id === idea.areaId) || AREAS[0];

    setActiveIdeaId(idea.id);
    setSelectedArea(matchedArea);
    setProjectTitle(idea.title || "");
    setProjectDescription(idea.description || "");
    setAnalysisData(idea.analysisData || null);
    setStep(2);
  }

  function handleCreateNewIdea() {
    setActiveIdeaId(null);
    setSelectedArea(AREAS[0]);
    setProjectTitle("");
    setProjectDescription("");
    setAnalysisData(null);
    setStep(1);
  }

  function handleDeleteIdea(ideaId) {
    setIdeasHistory((prev) => prev.filter((item) => item.id !== ideaId));

    if (activeIdeaId === ideaId) {
      setActiveIdeaId(null);
      setProjectTitle("");
      setProjectDescription("");
      setAnalysisData(null);
      setSelectedArea(AREAS[0]);
      setStep(1);
    }
  }

  function handleRestart() {
    setActiveIdeaId(null);
    setSelectedArea(AREAS[0]);
    setProjectTitle("");
    setProjectDescription("");
    setAnalysisData(null);
    setStep(0);
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleFakeLogin} />;
  }

  return (
    <div className={styles.app}>
      <div className={styles.noise} />

      <div className={styles.layout}>
        <aside className={styles.sidebarColumn}>
          <IdeasSidebar
            userName={userName}
            ideas={ideasHistory}
            topIdeas={topIdeas}
            activeIdeaId={activeIdeaId}
            onNewIdea={handleCreateNewIdea}
            onOpenIdea={handleOpenIdea}
            onDeleteIdea={handleDeleteIdea}
          />
        </aside>

        <div className={styles.mainColumn}>
          <div className={styles.frame}>
            <div className={styles.glowTop} />
            <div className={styles.glowBottom} />

            <header className={styles.topbar}>
              <div className={styles.brand}>
                <div className={styles.brandDot} />
                <span>PetroAlly</span>
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
                  onSelectArea={handleSelectArea}
                  onBack={() => setStep(0)}
                  onContinue={() => setStep(2)}
                />
              )}

              {step === 2 && (
                <ProjectPage
                  selectedArea={selectedArea}
                  projectTitle={projectTitle}
                  projectDescription={projectDescription}
                  onChangeTitle={handleChangeTitle}
                  onChangeDescription={handleChangeDescription}
                  onBack={() => setStep(1)}
                  analysis={analysisData}
                  onAnalysisReady={handleAnalysisReady}
                  onRestart={handleRestart}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;