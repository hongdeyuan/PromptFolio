import { useEffect, useState } from 'react';
import { ArrowUpRight, BadgeCheck, BookOpenText, Check, Clipboard, Gem, Globe2, Layers3, MousePointer2, Orbit, Sparkles, WandSparkles } from 'lucide-react';
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
  { id: 'aurora', icon: WandSparkles, promptKey: 'showcase.aurora.prompt' },
  { id: 'orbit', icon: Orbit, promptKey: 'showcase.orbit.prompt' },
] as const;
const libraryCaseKeys = ['cases.commerce', 'cases.saas', 'cases.dashboard', 'cases.brand'] as const;
const methodPrinciples = [
  { icon: Layers3, titleKey: 'methodPage.principles.structure', textKey: 'methodPage.principles.structureText' },
  { icon: MousePointer2, titleKey: 'methodPage.principles.mechanic', textKey: 'methodPage.principles.mechanicText' },
  { icon: BadgeCheck, titleKey: 'methodPage.principles.acceptance', textKey: 'methodPage.principles.acceptanceText' },
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
            <span className="font-display text-2xl font-semibold tracking-[-0.04em]">Promptfolio</span>
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
          ['02', 'overview.stats.cases'],
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
      <div className={`relative min-h-[320px] overflow-hidden p-6 ${item.id === 'aurora' ? 'bg-[#080914]' : 'bg-[#e8dcc8]'}`}>
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

function CasePreview({ caseId, large = false }: { caseId: ShowcaseCaseId; large?: boolean }) {
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

  return (
    <div className={`${large ? 'min-h-[420px]' : 'min-h-[268px]'} relative grid place-items-center rounded-[1.5rem] bg-[radial-gradient(circle_at_center,#fff8e8,transparent_34%),linear-gradient(135deg,#d7c3a0,#f7edda)]`}>
      <div className="orbit-ring absolute h-56 w-56 rounded-full border border-[#244838]/20" />
      {['Plan', 'Write', 'Ship', 'Learn'].map((label, index) => (
        <span className={`orbit-chip orbit-chip-${index + 1} absolute rounded-full bg-[#244838] px-3 py-2 text-xs font-bold text-[#f3efe6] shadow-xl`} key={label}>
          {label}
        </span>
      ))}
      <div className="relative z-10 w-48 rounded-[1.5rem] border border-white/70 bg-white/70 p-5 text-center shadow-2xl backdrop-blur">
        <Orbit className="mx-auto text-[#e4632b]" size={28} />
        <p className="mt-3 text-lg font-extrabold tracking-[-0.04em] text-[#191611]">Feature Orbit</p>
        <p className="mt-2 text-xs leading-5 text-[#191611]/60">Hover chips, update story, keep motion smooth.</p>
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
            {(['bestFor', 'ingredients', 'acceptance'] as const).map((key) => (
              <div className="rounded-3xl border border-[#191611]/10 bg-[#fffaf0] p-5 shadow-sm" key={key}>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e4632b]">{t(`detail.${key}`)}</p>
                <p className="mt-2 leading-7 text-[#191611]/70">{t(`showcase.${caseId}.${key}`)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-[2rem] border border-[#191611]/10 bg-[#fffaf0] shadow-[0_28px_80px_rgba(25,22,17,0.12)]">
          <div className={`p-6 ${caseId === 'aurora' ? 'bg-[#080914]' : 'bg-[#e8dcc8]'}`}>
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
