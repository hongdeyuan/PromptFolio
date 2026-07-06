import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import * as THREE from 'three';
import { ArrowUpRight, BadgeCheck, BookOpenText, BrainCircuit, Check, Clipboard, Gem, Globe2, Layers3, MousePointer2, Orbit, Sparkles, WandSparkles } from 'lucide-react';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

const lithosPrompt = `Build a full-screen, dark-themed hero section for a geology brand called Lithos, using React 18 + TypeScript + Vite + Tailwind CSS and lucide-react for icons. The signature feature is a cursor-following spotlight that reveals a second image through a soft circular mask on top of a base image. Match every detail below exactly.

Fonts: Inter for UI text and Playfair Display italic for the display/wordmark accent.

Assets: use the exact base and reveal image URLs provided, with a RevealLayer component that applies a radial-gradient canvas mask to reveal the second image under the cursor.

Layout: full-screen black hero, fixed nav, centered two-line heading, bottom-left editorial copy, bottom-right explanation and Start Digging CTA.

Motion: premium load animations, staggered blur-rise title lines, fade-up supporting text, and a slow Ken Burns zoom-out on the base image.

Responsiveness: 100dvh section, scaled headings, hidden desktop navigation under md, mobile hamburger, and mobile-friendly bottom content.`;

const navItems = [
  { href: '#overview', key: 'nav.overview', page: 'overview' },
  { href: '#cases', key: 'nav.cases', page: 'cases' },
  { href: '#method', key: 'nav.method', page: 'method' },
  { href: '#library', key: 'nav.library', page: 'library' },
] as const;
const metrics = [
  { value: '8.9', labelKey: 'metrics.detailDensity' },
  { value: '96%', labelKey: 'metrics.implementationClarity' },
  { value: '12', labelKey: 'metrics.reusableConstraints' },
] as const;
const showcaseCases = [
  { id: 'dogBrain', icon: BrainCircuit, promptKey: 'showcase.dogBrain.prompt' },
  { id: 'aurora', icon: WandSparkles, promptKey: 'showcase.aurora.prompt' },
  { id: 'orbit', icon: Orbit, promptKey: 'showcase.orbit.prompt' },
  { id: 'glass', icon: Gem, promptKey: 'showcase.glass.prompt' },
] as const;
const libraryCaseKeys = ['cases.commerce', 'cases.saas', 'cases.dashboard', 'cases.brand'] as const;
const methodPrinciples = [
  { icon: Layers3, titleKey: 'methodPage.principles.structure', textKey: 'methodPage.principles.structureText' },
  { icon: MousePointer2, titleKey: 'methodPage.principles.mechanic', textKey: 'methodPage.principles.mechanicText' },
  { icon: BadgeCheck, titleKey: 'methodPage.principles.acceptance', textKey: 'methodPage.principles.acceptanceText' },
] as const;
const orbitFeatures = [
  { label: 'Plan', title: 'Brief Builder', body: 'Turn scattered goals into a clear implementation brief.' },
  { label: 'Write', title: 'Prompt Studio', body: 'Compose constraints, states, and acceptance criteria together.' },
  { label: 'Ship', title: 'Launch Check', body: 'Validate behavior, accessibility, and responsive polish.' },
  { label: 'Learn', title: 'Case Memory', body: 'Extract reusable patterns from the result after launch.' },
] as const;

type ShowcaseCaseId = (typeof showcaseCases)[number]['id'];
type Page = 'overview' | 'cases' | 'method' | 'library' | 'not-found';

type ShellProps = {
  activePage: Exclude<Page, 'not-found'>;
  children: React.ReactNode;
  language: string;
  switchLanguage: () => void;
  t: TFunction;
};

type CopyPrompt = (caseId: string, prompt: string) => void;

function App() {
  const { i18n, t } = useTranslation();
  const [copiedCase, setCopiedCase] = useState<string | null>(null);
  const [hash, setHash] = useState(() => window.location.hash || '#overview');
  const language = i18n.resolvedLanguage === 'en' ? 'en' : 'zh';
  const nextLanguage = language === 'zh' ? 'en' : 'zh';
  const detailCaseId = hash.startsWith('#case/') ? hash.replace('#case/', '') : null;
  const detailCase = showcaseCases.find((item) => item.id === detailCaseId);
  const page = getPage(hash);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash || '#overview');
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  const switchLanguage = () => {
    void i18n.changeLanguage(nextLanguage);
  };

  const copyPrompt: CopyPrompt = (caseId, prompt) => {
    void navigator.clipboard.writeText(prompt).then(() => {
      setCopiedCase(caseId);
      window.setTimeout(() => setCopiedCase(null), 1600);
    });
  };

  if (detailCaseId) {
    return (
      <Shell activePage="cases" language={language} switchLanguage={switchLanguage} t={t}>
        {detailCase ? (
          <CaseDetailPage copiedCase={copiedCase} copyPrompt={copyPrompt} caseId={detailCase.id} icon={detailCase.icon} prompt={t(detailCase.promptKey)} t={t} />
        ) : (
          <NotFoundPage t={t} />
        )}
      </Shell>
    );
  }

  return (
    <Shell activePage={page === 'not-found' ? 'overview' : page} language={language} switchLanguage={switchLanguage} t={t}>
      {page === 'overview' && <OverviewPage t={t} />}
      {page === 'cases' && <CasesPage copiedCase={copiedCase} copyPrompt={copyPrompt} t={t} />}
      {page === 'method' && <MethodPage t={t} />}
      {page === 'library' && <LibraryPage t={t} />}
      {page === 'not-found' && <NotFoundPage t={t} />}
    </Shell>
  );
}

function getPage(hash: string): Page {
  if (!hash || hash === '#overview' || hash === '#') return 'overview';
  if (hash === '#cases') return 'cases';
  if (hash === '#method') return 'method';
  if (hash === '#library') return 'library';
  return 'not-found';
}

function Shell({ activePage, children, language, switchLanguage, t }: ShellProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f3efe6] text-[#191611] selection:bg-[#f97316] selection:text-white" lang={language}>
      <div className="grain fixed inset-0 opacity-[0.12]" />
      <div className="pointer-events-none fixed -left-40 top-20 h-96 w-96 rounded-full bg-[#c34b24]/25 blur-3xl" />
      <div className="pointer-events-none fixed right-[-14rem] top-[-10rem] h-[34rem] w-[34rem] rounded-full bg-[#244838]/20 blur-3xl" />
      <header className="relative z-30 px-5 py-5 sm:px-8 lg:px-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-[#191611]/10 bg-[#fffaf0]/80 px-4 py-3 shadow-[0_20px_70px_rgba(25,22,17,0.08)] backdrop-blur-xl">
          <a className="flex items-center gap-3" href="#overview">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#191611] text-[#f3efe6]">
              <Sparkles size={18} />
            </div>
            <span className="font-display text-2xl font-semibold tracking-[-0.04em]">PromptFolio</span>
          </a>
          <div className="hidden items-center gap-1 rounded-full bg-[#191611]/5 p-1 md:flex">
            {navItems.map((item) => {
              const isActive = activePage === item.page;

              return (
                <a
                  aria-current={isActive ? 'page' : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-[#191611] text-white shadow-sm' : 'text-[#191611]/70 hover:bg-white/70 hover:text-[#191611]'}`}
                  href={item.href}
                  key={item.key}
                >
                  {t(item.key)}
                </a>
              );
            })}
          </div>
          <button aria-label={t('ariaSwitch')} className="inline-flex items-center gap-2 rounded-full border border-[#191611]/10 bg-white/70 px-4 py-2.5 text-sm font-semibold text-[#191611] transition hover:bg-white" onClick={switchLanguage} type="button">
            <Globe2 size={16} />
            {t('nextLanguage')}
          </button>
        </nav>
      </header>
      <div className="relative z-10 px-5 pb-20 sm:px-8 lg:px-10">{children}</div>
    </main>
  );
}

function OverviewPage({ t }: { t: TFunction }) {
  return (
    <div className="mx-auto max-w-7xl py-12 sm:py-20">
      <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#191611]/10 bg-white/60 px-3 py-2 text-sm font-semibold text-[#244838] shadow-sm backdrop-blur">
            <Gem size={16} />
            {t('overview.pill')}
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#e4632b]">{t('overview.kicker')}</p>
          <h1 className="mt-5 max-w-4xl font-display text-6xl font-semibold leading-[0.9] tracking-[-0.075em] text-[#191611] sm:text-7xl lg:text-8xl">{t('overview.title')}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#191611]/70 sm:text-xl">{t('overview.body')}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#191611] px-7 py-4 font-semibold text-white shadow-2xl shadow-[#191611]/20 transition hover:-translate-y-1" href="#cases">
              {t('overview.primary')}
              <ArrowUpRight className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={18} />
            </a>
            <a className="inline-flex items-center justify-center gap-2 rounded-full border border-[#191611]/15 bg-white/60 px-7 py-4 font-semibold text-[#191611] backdrop-blur transition hover:-translate-y-1 hover:bg-white" href="#method">
              {t('overview.secondary')}
            </a>
          </div>
        </div>
        <FeaturedLithosCard t={t} />
      </section>

      <section className="mt-20 grid gap-5 md:grid-cols-3">
        {[
          ['04', 'overview.stats.cases'],
          ['05', 'overview.stats.criteria'],
          ['100%', 'overview.stats.copyReady'],
        ].map(([value, label]) => (
          <div className="rounded-[1.75rem] border border-[#191611]/10 bg-[#fffaf0]/80 p-6 shadow-sm" key={label}>
            <p className="font-display text-5xl tracking-[-0.05em]">{value}</p>
            <p className="mt-3 font-semibold text-[#191611]/65">{t(label)}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        <a className="group rounded-[2rem] bg-[#191611] p-8 text-white shadow-2xl shadow-[#191611]/15 transition hover:-translate-y-1" href="#cases">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#f0b37e]">{t('nav.cases')}</p>
          <h2 className="mt-8 font-display text-5xl leading-none tracking-[-0.06em]">{t('homeSections.casesTitle')}</h2>
          <p className="mt-5 leading-7 text-white/62">{t('homeSections.casesBody')}</p>
          <ArrowUpRight className="mt-8 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
        </a>
        <a className="group rounded-[2rem] border border-[#191611]/10 bg-[#fffaf0] p-8 shadow-xl shadow-[#191611]/5 transition hover:-translate-y-1" href="#method">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#e4632b]">{t('nav.method')}</p>
          <h2 className="mt-8 font-display text-5xl leading-none tracking-[-0.06em]">{t('homeSections.methodTitle')}</h2>
          <p className="mt-5 leading-7 text-[#191611]/62">{t('homeSections.methodBody')}</p>
          <ArrowUpRight className="mt-8 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
        </a>
      </section>
    </div>
  );
}

function FeaturedLithosCard({ t }: { t: TFunction }) {
  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-[#191611] p-4 text-white shadow-[0_30px_100px_rgba(25,22,17,0.28)]">
      <div className="relative min-h-[520px] overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_30%_20%,#9c6a42,transparent_34%),linear-gradient(135deg,#2b261f,#0f0d0a)] p-6">
        <div className="absolute right-[-4rem] top-[-4rem] h-64 w-64 rounded-full bg-[#e8702a]/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="relative z-10 flex items-center justify-between">
          <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white/80 backdrop-blur">{t('featured')}</span>
          <Clipboard size={18} />
        </div>
        <div className="relative z-10 mt-24">
          <p className="font-display text-5xl italic leading-none tracking-[-0.06em] sm:text-6xl">Lithos</p>
          <h2 className="mt-4 max-w-md text-4xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-5xl">{t('cardTitle')}</h2>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/72">{t('cardBody')}</p>
        </div>
        <div className="relative z-10 mt-16 grid grid-cols-3 gap-3">
          {metrics.map((metric) => (
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur" key={metric.labelKey}>
              <p className="text-2xl font-semibold tracking-[-0.05em]">{metric.value}</p>
              <p className="mt-1 text-xs leading-4 text-white/60">{t(metric.labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function CasesPage({ copiedCase, copyPrompt, t }: { copiedCase: string | null; copyPrompt: CopyPrompt; t: TFunction }) {
  return (
    <section className="mx-auto max-w-7xl py-12 sm:py-20">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#e4632b]">{t('casesPage.kicker')}</p>
        <h1 className="mt-4 font-display text-6xl font-semibold leading-none tracking-[-0.06em] text-[#191611] sm:text-7xl">{t('casesPage.title')}</h1>
        <p className="mt-6 text-lg leading-8 text-[#191611]/65">{t('casesPage.body')}</p>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {showcaseCases.map((item) => (
          <CaseCard copiedCase={copiedCase} copyPrompt={copyPrompt} item={item} key={item.id} t={t} />
        ))}
      </div>
    </section>
  );
}

function CaseCard({ copiedCase, copyPrompt, item, t }: { copiedCase: string | null; copyPrompt: CopyPrompt; item: (typeof showcaseCases)[number]; t: TFunction }) {
  const Icon = item.icon;
  const prompt = t(item.promptKey);
  const isCopied = copiedCase === item.id;

  return (
    <article className="overflow-hidden rounded-[2rem] border border-[#191611]/10 bg-[#f3efe6] shadow-[0_28px_80px_rgba(25,22,17,0.12)]">
      <div className={`relative min-h-[320px] overflow-hidden p-6 ${item.id === 'orbit' ? 'bg-[#e8dcc8]' : item.id === 'dogBrain' ? 'bg-[#0b1610]' : 'bg-[#080914]'}`}>
        <CasePreview caseId={item.id} />
      </div>
      <div className="p-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#191611]/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#244838]">
          <Icon size={14} />
          {t(`showcase.${item.id}.tag`)}
        </div>
        <h2 className="mt-4 text-3xl font-extrabold leading-none tracking-[-0.055em] text-[#191611]">{t(`showcase.${item.id}.title`)}</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#191611]/62">{t(`showcase.${item.id}.body`)}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e4632b] px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#c84f1e]" href={`#case/${item.id}`}>
            {t('viewDetail')}
            <ArrowUpRight size={16} />
          </a>
          <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#191611] px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#2b261f]" onClick={() => copyPrompt(item.id, prompt)} type="button">
            {isCopied ? <Check size={16} /> : <Clipboard size={16} />}
            {isCopied ? t('copied') : t('copy')}
          </button>
        </div>
        <pre className="mt-5 max-h-36 overflow-auto rounded-2xl border border-[#191611]/10 bg-white/70 p-4 text-xs leading-6 text-[#191611]/70"><code>{prompt}</code></pre>
      </div>
    </article>
  );
}

function MethodPage({ t }: { t: TFunction }) {
  return (
    <section className="mx-auto max-w-7xl py-12 sm:py-20">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#e4632b]">{t('methodPage.kicker')}</p>
        <h1 className="mt-4 font-display text-6xl font-semibold leading-none tracking-[-0.06em] text-[#191611] sm:text-7xl">{t('methodPage.title')}</h1>
        <p className="mt-6 text-lg leading-8 text-[#191611]/65">{t('methodPage.body')}</p>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {methodPrinciples.map((item) => (
          <div className="rounded-[1.75rem] border border-[#191611]/10 bg-[#fffaf0] p-6 shadow-xl shadow-[#191611]/5" key={item.titleKey}>
            <item.icon className="text-[#e4632b]" size={30} />
            <h2 className="mt-10 text-2xl font-extrabold tracking-[-0.04em]">{t(item.titleKey)}</h2>
            <p className="mt-4 text-sm leading-6 text-[#191611]/62">{t(item.textKey)}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-[2rem] border border-[#191611]/10 bg-[#191611] p-6 text-white shadow-2xl shadow-[#191611]/15 lg:p-8">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-[#f0b37e]">
          <BookOpenText size={18} />
          {t('promptExcerpt')}
        </div>
        <pre className="mt-5 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-2xl bg-white/10 p-5 text-sm leading-7 text-white/72"><code>{lithosPrompt}</code></pre>
      </div>
    </section>
  );
}

function LibraryPage({ t }: { t: TFunction }) {
  return (
    <section className="mx-auto max-w-7xl py-12 sm:py-20">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#e4632b]">{t('libraryKicker')}</p>
          <h1 className="mt-4 max-w-2xl font-display text-6xl font-semibold leading-none tracking-[-0.06em] sm:text-7xl">{t('libraryTitle')}</h1>
        </div>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-4">
        {libraryCaseKeys.map((caseKey, index) => (
          <div className="group min-h-52 rounded-[1.75rem] border border-[#191611]/10 bg-[#fffaf0] p-5 shadow-sm transition hover:-translate-y-2 hover:shadow-xl" key={caseKey}>
            <span className="text-sm text-[#e4632b]">0{index + 1}</span>
            <h2 className="mt-14 text-2xl font-semibold leading-tight tracking-[-0.045em]">{t(caseKey)}</h2>
            <ArrowUpRight className="mt-6 opacity-50 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </section>
  );
}


function DogBrainPreview({ large = false }: { large?: boolean }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.35, 8.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const keyLight = new THREE.PointLight(0xf7c07a, 2.8, 18);
    keyLight.position.set(3.6, 4.2, 5.2);
    const rimLight = new THREE.PointLight(0x65f2bc, 2.1, 16);
    rimLight.position.set(-3.8, 1.2, 3.6);
    scene.add(keyLight, rimLight, new THREE.AmbientLight(0x92d6b3, 1));

    const brain = new THREE.Group();
    scene.add(brain);

    const cortexMaterial = new THREE.MeshPhysicalMaterial({ color: 0xf28b67, roughness: 0.5, metalness: 0.02, clearcoat: 0.35, transmission: 0.04, emissive: 0x2a0804, emissiveIntensity: 0.2 });
    const frontalMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffb26f, roughness: 0.44, clearcoat: 0.3, emissive: 0x331305, emissiveIntensity: 0.22 });
    const olfactoryMaterial = new THREE.MeshPhysicalMaterial({ color: 0x6ee7a7, roughness: 0.32, clearcoat: 0.42, emissive: 0x06391f, emissiveIntensity: 0.42 });
    const hippocampusMaterial = new THREE.MeshPhysicalMaterial({ color: 0x8fd3ff, roughness: 0.38, clearcoat: 0.25, emissive: 0x06243b, emissiveIntensity: 0.34 });
    const cerebellumMaterial = new THREE.MeshPhysicalMaterial({ color: 0xf7d977, roughness: 0.56, clearcoat: 0.18, emissive: 0x342204, emissiveIntensity: 0.24 });
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0xb88c66, roughness: 0.52, emissive: 0x241105, emissiveIntensity: 0.2 });
    const signalMaterial = new THREE.MeshStandardMaterial({ color: 0xb8ffe2, roughness: 0.18, emissive: 0x35e69a, emissiveIntensity: 0.95 });
    const grooveMaterial = new THREE.MeshBasicMaterial({ color: 0x2f120b, transparent: true, opacity: 0.72 });
    const connectionMaterial = new THREE.MeshBasicMaterial({ color: 0x7cf7c6, transparent: true, opacity: 0.28 });

    const makeLobe = (x: number, y: number, z: number, sx: number, sy: number, sz: number, material: THREE.Material) => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 42), material);
      mesh.position.set(x, y, z);
      mesh.scale.set(sx, sy, sz);
      brain.add(mesh);
      return mesh;
    };

    makeLobe(-0.72, 0.22, 0, 1.26, 0.82, 1.08, cortexMaterial);
    makeLobe(0.72, 0.22, 0, 1.26, 0.82, 1.08, cortexMaterial);
    makeLobe(-0.52, 0.78, -0.18, 0.88, 0.45, 0.74, frontalMaterial);
    makeLobe(0.52, 0.78, -0.18, 0.88, 0.45, 0.74, frontalMaterial);
    makeLobe(-1.78, 0.1, 0.28, 0.58, 0.38, 0.6, olfactoryMaterial);
    makeLobe(1.78, 0.1, 0.28, 0.58, 0.38, 0.6, olfactoryMaterial);
    makeLobe(-0.62, -0.28, 0.88, 0.5, 0.2, 0.34, hippocampusMaterial);
    makeLobe(0.62, -0.28, 0.88, 0.5, 0.2, 0.34, hippocampusMaterial);
    makeLobe(0, -0.82, -0.48, 1.04, 0.48, 0.72, cerebellumMaterial);

    const brainStem = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.95, 8, 24), stemMaterial);
    brainStem.position.set(0, -1.35, -0.28);
    brainStem.rotation.z = 0.08;
    brain.add(brainStem);

    const addTube = (points: THREE.Vector3[], radius: number, material: THREE.Material, parent: THREE.Object3D = brain) => {
      const curve = new THREE.CatmullRomCurve3(points);
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 44, radius, 8, false), material);
      parent.add(tube);
      return tube;
    };

    for (let side = -1; side <= 1; side += 2) {
      for (let row = 0; row < 5; row += 1) {
        for (let index = 0; index < 7; index += 1) {
          const baseX = side * (0.18 + index * 0.22);
          const baseY = 0.82 - row * 0.33;
          const wave = Math.sin(index * 1.7 + row) * 0.12;
          addTube([
            new THREE.Vector3(baseX, baseY, 0.82),
            new THREE.Vector3(baseX + side * 0.13, baseY - 0.12, 1.08 + wave),
            new THREE.Vector3(baseX + side * 0.04, baseY - 0.28, 0.92),
          ], 0.009 + row * 0.001, grooveMaterial);
        }
      }
    }

    for (let index = 0; index < 14; index += 1) {
      const y = -0.62 - index * 0.035;
      addTube([
        new THREE.Vector3(-0.78 + index * 0.025, y, 0.24),
        new THREE.Vector3(0, y - 0.08, 0.58),
        new THREE.Vector3(0.78 - index * 0.025, y, 0.24),
      ], 0.007, grooveMaterial);
    }

    const signalPoints: THREE.Vector3[] = [];
    const signals: THREE.Mesh[] = [];
    for (let index = 0; index < 44; index += 1) {
      const side = index % 2 === 0 ? -1 : 1;
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.04, 18, 14), signalMaterial);
      node.position.set(side * (0.18 + Math.random() * 1.55), -0.48 + Math.random() * 1.45, 0.46 + Math.random() * 0.82);
      brain.add(node);
      signals.push(node);
      signalPoints.push(node.position.clone());
    }

    for (let index = 0; index < signalPoints.length - 1; index += 3) {
      addTube([signalPoints[index], signalPoints[index + 1], signalPoints[Math.min(index + 2, signalPoints.length - 1)]], 0.004, connectionMaterial);
    }

    const olfactoryTractMaterial = new THREE.MeshBasicMaterial({ color: 0x9fffe0, transparent: true, opacity: 0.46 });
    addTube([new THREE.Vector3(-1.82, 0.12, 0.48), new THREE.Vector3(-1.28, 0.0, 0.82), new THREE.Vector3(-0.48, -0.12, 0.82)], 0.018, olfactoryTractMaterial);
    addTube([new THREE.Vector3(1.82, 0.12, 0.48), new THREE.Vector3(1.28, 0.0, 0.82), new THREE.Vector3(0.48, -0.12, 0.82)], 0.018, olfactoryTractMaterial);

    const skullMaterial = new THREE.MeshBasicMaterial({ color: 0xc7f9df, transparent: true, opacity: 0.38 });
    addTube([
      new THREE.Vector3(-2.95, -1.2, -0.62),
      new THREE.Vector3(-2.56, 0.52, -0.74),
      new THREE.Vector3(-1.38, 1.72, -0.9),
      new THREE.Vector3(0, 1.95, -0.96),
      new THREE.Vector3(1.38, 1.72, -0.9),
      new THREE.Vector3(2.56, 0.52, -0.74),
      new THREE.Vector3(2.95, -1.2, -0.62),
    ], 0.015, skullMaterial, scene);
    addTube([
      new THREE.Vector3(-2.55, -0.24, -0.48),
      new THREE.Vector3(-3.14, -0.45, -0.5),
      new THREE.Vector3(-3.38, -0.12, -0.46),
    ], 0.013, skullMaterial, scene);
    addTube([
      new THREE.Vector3(2.55, -0.24, -0.48),
      new THREE.Vector3(3.14, -0.45, -0.5),
      new THREE.Vector3(3.38, -0.12, -0.46),
    ], 0.013, skullMaterial, scene);

    const resize = () => {
      const width = mount.clientWidth || 640;
      const height = mount.clientHeight || 420;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    let frameId = 0;
    const animate = () => {
      const time = performance.now() * 0.001;
      brain.rotation.y = Math.sin(time * 0.36) * 0.32;
      brain.rotation.x = Math.sin(time * 0.24) * 0.08;
      brain.position.y = Math.sin(time * 0.8) * 0.035;
      signals.forEach((node, index) => {
        const pulse = 1 + Math.sin(time * 2.8 + index * 0.74) * 0.42;
        node.scale.setScalar(pulse);
      });
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
    };
  }, []);

  return (
    <div className={`${large ? 'min-h-[520px]' : 'min-h-[320px]'} dog-brain-stage relative overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_18%_20%,rgba(103,211,145,0.24),transparent_28%),radial-gradient(circle_at_76%_72%,rgba(242,161,95,0.26),transparent_30%),linear-gradient(135deg,#07130e,#12231a_48%,#060908)]`}>
      <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-5 top-5 flex items-center justify-between text-white/80">
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] backdrop-blur">Canine Neural Atlas</span>
        <span className="rounded-full bg-[#67d391]/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#b7ffd8]">44 nodes</span>
      </div>
      <div className="pointer-events-none absolute left-5 top-16 hidden max-w-[11rem] space-y-2 text-white/82 sm:block">
        {['Frontal cortex', 'Olfactory bulb', 'Hippocampus', 'Cerebellum'].map((label) => (
          <div className="rounded-full border border-white/12 bg-black/22 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] backdrop-blur-md" key={label}>{label}</div>
        ))}
      </div>
    </div>
  );
}

function CasePreview({ caseId, large = false }: { caseId: ShowcaseCaseId; large?: boolean }) {
  const [pointer, setPointer] = useState({ x: 50, y: 42, rx: 0, ry: 0 });
  const [activeOrbit, setActiveOrbit] = useState(0);
  const glassStyle = {
    '--glass-x': `${pointer.x}%`,
    '--glass-y': `${pointer.y}%`,
    '--glass-rx': `${pointer.rx}deg`,
    '--glass-ry': `${pointer.ry}deg`,
  } as CSSProperties;

  const handleGlassPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setPointer({
      x,
      y,
      rx: (50 - y) / 8,
      ry: (x - 50) / 8,
    });
  };

  const resetGlassPointer = () => setPointer({ x: 50, y: 42, rx: 0, ry: 0 });

  if (caseId === 'dogBrain') {
    return <DogBrainPreview large={large} />;
  }

  if (caseId === 'aurora') {
    return (
      <div className={`${large ? 'min-h-[420px]' : 'min-h-[268px]'} grid place-items-center rounded-[1.5rem] bg-[radial-gradient(circle_at_50%_10%,rgba(116,232,255,0.28),transparent_34%),radial-gradient(circle_at_20%_90%,rgba(255,112,180,0.25),transparent_36%),#0b0f1d]`}>
        <button className="aurora-button group relative rounded-full p-[2px] text-white shadow-[0_24px_90px_rgba(84,214,255,0.25)]" type="button">
          <span className="relative flex items-center gap-3 overflow-hidden rounded-full bg-[#080914]/90 px-8 py-4 text-sm font-bold uppercase tracking-[0.24em] backdrop-blur-xl">
            <span className="aurora-shine absolute inset-0" />
            <WandSparkles className="relative" size={18} />
            <span className="relative">Aurora CTA</span>
          </span>
        </button>
      </div>
    );
  }

  if (caseId === 'glass') {
    return (
      <div
        className={`${large ? 'min-h-[420px]' : 'min-h-[268px]'} glass-stage group relative grid place-items-center overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_24%_18%,rgba(153,246,228,0.34),transparent_30%),radial-gradient(circle_at_78%_76%,rgba(251,146,60,0.28),transparent_34%),linear-gradient(135deg,#07111f,#141018_48%,#080914)] p-6`}
        onPointerLeave={resetGlassPointer}
        onPointerMove={handleGlassPointerMove}
        style={glassStyle}
      >
        <div className="glass-cursor-glow absolute inset-0" />
        <div className="glass-orb glass-orb-a absolute h-44 w-44 rounded-full bg-[#67e8f9]/25 blur-2xl" />
        <div className="glass-orb glass-orb-b absolute h-52 w-52 rounded-full bg-[#fb7185]/20 blur-2xl" />
        <div className="glass-card-float relative w-full max-w-[22rem]">
          <div className="glass-modal-card relative overflow-hidden rounded-[2rem] border border-white/18 bg-white/[0.11] p-5 text-white shadow-[0_28px_100px_rgba(0,0,0,0.38)] backdrop-blur-2xl">
            <div className="glass-refraction absolute inset-0" />
            <div className="glass-sweep absolute inset-0" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-100/70">Glass Modal</p>
                <h3 className="mt-3 text-3xl font-extrabold leading-none tracking-[-0.06em]">Confirm Upgrade</h3>
              </div>
              <span className="glass-icon grid h-11 w-11 place-items-center rounded-2xl border border-white/15 bg-white/12 shadow-inner">
                <Gem size={20} />
              </span>
            </div>
            <p className="relative mt-4 text-sm leading-6 text-white/68">Move the cursor to bend light across frosted depth and luminous edges.</p>
            <div className="relative mt-6 grid grid-cols-3 gap-2">
              {['Tilt', 'Glow', 'Sheen'].map((label) => (
                <span className="glass-chip rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-white/72" key={label}>{label}</span>
              ))}
            </div>
            <div className="relative mt-6 flex gap-3">
              <button className="glass-primary-action flex-1 rounded-full bg-white px-4 py-3 text-sm font-extrabold text-[#10131c] shadow-[0_12px_40px_rgba(255,255,255,0.16)]" type="button">Activate</button>
              <button className="glass-secondary-action rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white/75" type="button">Later</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeFeature = orbitFeatures[activeOrbit];

  return (
    <div className={`${large ? 'min-h-[420px]' : 'min-h-[268px]'} group/orbit relative grid place-items-center rounded-[1.5rem] bg-[radial-gradient(circle_at_center,#fff8e8,transparent_34%),linear-gradient(135deg,#d7c3a0,#f7edda)]`}>
      <div className="orbit-ring absolute h-56 w-56 rounded-full border border-[#244838]/20" />
      {orbitFeatures.map((feature, index) => {
        const isActive = activeOrbit === index;

        return (
          <button
            aria-pressed={isActive}
            className={`orbit-chip orbit-chip-${index + 1} absolute rounded-full px-3 py-2 text-xs font-bold shadow-xl transition ${isActive ? 'bg-[#e4632b] text-white ring-4 ring-white/70' : 'bg-[#244838] text-[#f3efe6] hover:bg-[#315d49]'}`}
            key={feature.label}
            onClick={() => setActiveOrbit(index)}
            onFocus={() => setActiveOrbit(index)}
            onMouseEnter={() => setActiveOrbit(index)}
            onPointerEnter={() => setActiveOrbit(index)}
            type="button"
          >
            {feature.label}
          </button>
        );
      })}
      <div className="relative z-10 w-56 rounded-[1.5rem] border border-white/70 bg-white/75 p-5 text-center shadow-2xl backdrop-blur transition group-hover/orbit:-translate-y-1">
        <Orbit className="mx-auto text-[#e4632b]" size={28} />
        <p className="mt-3 text-lg font-extrabold tracking-[-0.04em] text-[#191611]">{activeFeature.title}</p>
        <p className="mt-2 min-h-10 text-xs leading-5 text-[#191611]/60">{activeFeature.body}</p>
      </div>
    </div>
  );
}

function CaseDetailPage({ caseId, copiedCase, copyPrompt, icon: Icon, prompt, t }: { caseId: ShowcaseCaseId; copiedCase: string | null; copyPrompt: CopyPrompt; icon: typeof WandSparkles; prompt: string; t: TFunction }) {
  const isCopied = copiedCase === caseId;

  return (
    <section className="mx-auto max-w-7xl py-12 sm:py-20">
      <a className="inline-flex items-center gap-2 rounded-full border border-[#191611]/10 bg-white/70 px-4 py-2.5 text-sm font-semibold text-[#191611] transition hover:bg-white" href="#cases">
        <ArrowUpRight className="rotate-[225deg]" size={16} />
        {t('detail.back')}
      </a>
      <div className="mt-10 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#191611]/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#244838]">
            <Icon size={14} />
            {t(`showcase.${caseId}.tag`)}
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-6xl font-semibold leading-none tracking-[-0.07em] text-[#191611] sm:text-7xl">{t(`showcase.${caseId}.title`)}</h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-[#191611]/65">{t(`showcase.${caseId}.body`)}</p>
          <div className="mt-8 grid gap-3">
            {(['bestFor', 'ingredients', 'principle', 'acceptance'] as const).map((key) => (
              <div className="rounded-3xl border border-[#191611]/10 bg-[#fffaf0] p-5 shadow-sm" key={key}>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e4632b]">{t(`detail.${key}`)}</p>
                <p className="mt-2 leading-7 text-[#191611]/70">{t(`showcase.${caseId}.${key}`)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-[2rem] border border-[#191611]/10 bg-[#fffaf0] shadow-[0_28px_80px_rgba(25,22,17,0.12)]">
          <div className={`p-6 ${caseId === 'orbit' ? 'bg-[#e8dcc8]' : caseId === 'dogBrain' ? 'bg-[#0b1610]' : 'bg-[#080914]'}`}>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-white/70 mix-blend-difference">{t('detail.previewLabel')}</p>
            <CasePreview caseId={caseId} large />
          </div>
          <div className="p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e4632b]">{t('detail.promptLabel')}</p>
                <p className="mt-2 text-sm text-[#191611]/60">{t('detail.overview')}</p>
              </div>
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#191611] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#2b261f]" onClick={() => copyPrompt(caseId, prompt)} type="button">
                {isCopied ? <Check size={16} /> : <Clipboard size={16} />}
                {isCopied ? t('copied') : t('detail.copyPrompt')}
              </button>
            </div>
            <pre className="mt-5 max-h-72 overflow-auto rounded-2xl border border-[#191611]/10 bg-white/70 p-5 text-sm leading-7 text-[#191611]/72"><code>{prompt}</code></pre>
          </div>
        </div>
      </div>
    </section>
  );
}

function NotFoundPage({ t }: { t: TFunction }) {
  return (
    <section className="mx-auto grid min-h-[70vh] max-w-3xl place-items-center py-12 text-center">
      <div>
        <h1 className="font-display text-6xl font-semibold tracking-[-0.06em]">{t('notFound.title')}</h1>
        <p className="mt-5 text-lg text-[#191611]/65">{t('notFound.body')}</p>
        <a className="mt-8 inline-flex rounded-full bg-[#191611] px-6 py-3 font-semibold text-white" href="#overview">
          {t('notFound.action')}
        </a>
      </div>
    </section>
  );
}

export default App;
