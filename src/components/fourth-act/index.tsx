import * as React from 'react';

/* Fourth Act — portfolio components (from the design system). Class prefix `fa-`; styles in ./fourth-act.css; values from src/styles/tokens.css. */

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ');
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

/* ------------------------------------------------------------------ Star */

export type StarTone = 'flare' | 'crimson' | 'violet' | 'chrome' | 'current';
export interface StarProps {
  /** Box size in px; keep to multiples of 4. */
  size?: number;
  /** `flare` is the one star per view; the other tones are for patterns and loaders. */
  tone?: StarTone;
  /** A soft halo in the star's own colour, with a slow twinkle. Only for the one flare star. */
  glow?: boolean;
  /** Accessible name. Omit for decoration (the default). */
  title?: string;
  className?: string;
}

/** The four-point spark: four concave arcs between the points of a square. */
const STAR_PATH = 'M12 0A16 16 0 0 0 24 12A16 16 0 0 0 12 24A16 16 0 0 0 0 12A16 16 0 0 0 12 0Z';

export function Star({ size = 16, tone = 'flare', glow = false, title, className }: StarProps) {
  return (
    <svg
      className={cx('fa-star', 'fa-star--' + tone, glow && 'fa-star--glow', className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d={STAR_PATH} />
    </svg>
  );
}

/* ------------------------------------------------------------------ Icon */

const ICONS = {
  'arrow-right': (<><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>),
  'arrow-up-right': (<><path d="M7 7h10v10" /><path d="M7 17 17 7" /></>),
  'arrow-down': (<><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></>),
  mail: (<><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>),
  github: (<><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></>),
  linkedin: (<><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></>),
  menu: (<><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></>),
  close: (<><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>),
  moon: (<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />),
  sun: (<><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></>),
  code: (<><path d="m16 18 6-6-6-6" /><path d="m8 6-6 6 6 6" /></>),
  globe: (<><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></>),
  atom: (<><circle cx="12" cy="12" r="1" /><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" /><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" /></>),
  wind: (<><path d="M12.8 19.6A2 2 0 1 0 14 16H2" /><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" /><path d="M9.8 4.4A2 2 0 1 1 11 8H2" /></>),
  database: (<><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5V19A9 3 0 0 0 21 19V5" /><path d="M3 12A9 3 0 0 0 21 12" /></>),
  'git-branch': (<><path d="M6 3v12" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></>),
};

export type IconName = keyof typeof ICONS;
export interface IconProps {
  /** One of the lucide names this set mirrors. In the app, import the same name from lucide-react. */
  name: IconName;
  size?: number;
  strokeWidth?: number;
  title?: string;
  className?: string;
}

export function Icon({ name, size = 20, strokeWidth = 1.5, title, className }: IconProps) {
  return (
    <svg
      className={cx('fa-icon', className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {ICONS[name]}
    </svg>
  );
}

/* ------------------------------------------------------------------ Button */

interface ButtonOwnProps {
  /** primary = crimson, once per view · ghost = outlined (default) · quiet = text link with an underline draw. */
  variant?: 'primary' | 'ghost' | 'quiet';
  size?: 'md' | 'lg';
  /** Leading icon (20px; 16px for quiet). */
  icon?: React.ReactNode;
  /** Trailing icon; an arrow nudges up-right on hover. */
  iconEnd?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}
type AnchorRest = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & { href: string };
type ButtonRest = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { href?: undefined };
export type ButtonProps = ButtonOwnProps & (AnchorRest | ButtonRest);

export function Button(props: ButtonProps) {
  const { variant = 'ghost', size = 'md', icon, iconEnd, children, className, ...rest } = props;
  const cls = cx('fa-btn', 'fa-btn--' + variant, 'fa-btn--' + size, className);
  const inner = (
    <>
      {icon ? <span className="fa-btn__icon">{icon}</span> : null}
      <span className="fa-btn__label">{children}</span>
      {iconEnd ? <span className="fa-btn__icon fa-btn__icon--end">{iconEnd}</span> : null}
    </>
  );
  if (typeof rest.href === 'string') {
    return <a {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)} className={cls}>{inner}</a>;
  }
  return <button type="button" {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)} className={cls}>{inner}</button>;
}

/* ------------------------------------------------------------------ IconButton */

interface IconButtonOwnProps {
  /** Required accessible name ("Visit GitHub profile", "Switch to light mode"). */
  label: string;
  /** The icon. */
  children: React.ReactNode;
  size?: 'md' | 'sm';
  className?: string;
}
type IBAnchor = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & { href: string };
type IBButton = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { href?: undefined };
export type IconButtonProps = IconButtonOwnProps & (IBAnchor | IBButton);

export function IconButton(props: IconButtonProps) {
  const { label, children, size = 'md', className, ...rest } = props;
  const cls = cx('fa-icon-btn', 'fa-icon-btn--' + size, className);
  if (typeof rest.href === 'string') {
    return <a {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)} className={cls} aria-label={label} title={label}>{children}</a>;
  }
  return <button type="button" {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)} className={cls} aria-label={label} title={label}>{children}</button>;
}

/* ------------------------------------------------------------------ Badge */

export interface BadgeProps {
  /** live = pulsing crimson dot (availability) · violet = featured · crimson = urgent/new · neutral = status. */
  tone?: 'neutral' | 'live' | 'violet' | 'crimson';
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ tone = 'neutral', icon, children, className }: BadgeProps) {
  return (
    <span className={cx('fa-badge', 'fa-badge--' + tone, className)}>
      {tone === 'live' ? <span className="fa-badge__dot" aria-hidden="true" /> : null}
      {icon}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ Tag */

export interface TagProps {
  children: React.ReactNode;
  /** Highlight one tag (e.g. the stack you are filtering by). */
  selected?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function Tag({ children, selected = false, icon, className }: TagProps) {
  return <span className={cx('fa-tag', selected && 'fa-tag--selected', className)}>{icon}{children}</span>;
}

/* ------------------------------------------------------------------ ActHeading */

export interface ActHeadingProps {
  /** Roman numeral of the act ("I"…"IV"). Omit for the Prologue. */
  act?: string;
  /** The act's theatrical name, set in the eyebrow ("The Masterpieces"). */
  eyebrow: string;
  /** The display line. Wrap one word in <em> for the crimson italic accent. */
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: 'start' | 'center';
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  className?: string;
}

export function ActHeading({ act, eyebrow, title, lead, align = 'start', as = 'h2', id, className }: ActHeadingProps) {
  const H = as;
  return (
    <header className={cx('fa-act', align === 'center' && 'fa-act--center', className)}>
      <p className="fa-act__eyebrow">
        {act ? <span className="fa-act__num">Act {act}</span> : null}
        {act ? <span className="fa-act__rule" aria-hidden="true" /> : null}
        <span>{eyebrow}</span>
      </p>
      <H className="fa-act__title" id={id}>{title}</H>
      {lead ? <p className="fa-act__lead">{lead}</p> : null}
    </header>
  );
}

/* ------------------------------------------------------------------ NavBar */

export interface NavItem {
  id: string;
  label: string;
  /** Real address for the link (routed sites). Defaults to the `#id` anchor. */
  href?: string;
}
export interface NavBarProps {
  brand: string;
  /** Real address for the brand link (routed sites). Defaults to `#prologue`. */
  brandHref?: string;
  /** One letter in the rotated chrome diamond. Defaults to the brand's first letter. */
  monogram?: string;
  /** Up to four items; each gets its act numeral (I–IV). */
  items: NavItem[];
  /** id of the section in view. */
  active?: string;
  /** Called with an item id; when given, the default anchor jump is prevented. */
  onNavigate?: (id: string) => void;
  /** Right-side controls, e.g. the theme IconButton. */
  actions?: React.ReactNode;
  /** True once the page has scrolled: frosted stage background and a hairline. */
  scrolled?: boolean;
  menuOpen?: boolean;
  onMenuToggle?: () => void;
  className?: string;
}

export function NavBar({ brand, brandHref, monogram, items, active, onNavigate, actions, scrolled = false, menuOpen = false, onMenuToggle, className }: NavBarProps) {
  const go = (id: string) => (e: React.MouseEvent) => {
    // Leave modified clicks (new tab, new window) to the browser
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (onNavigate) { e.preventDefault(); onNavigate(id); }
  };
  return (
    <nav className={cx('fa-nav', scrolled && 'fa-nav--scrolled', menuOpen && 'fa-nav--open', className)} aria-label="Main">
      <a className="fa-nav__brand" href={brandHref ?? '#prologue'} onClick={go('prologue')}>
        <span className="fa-nav__mono" aria-hidden="true"><span>{monogram ?? brand.charAt(0)}</span></span>
        <span className="fa-nav__name">{brand}</span>
      </a>
      <ul className="fa-nav__links">
        {items.map((it, i) => (
          <li key={it.id}>
            <a
              href={it.href ?? '#' + it.id}
              className={cx('fa-nav__link', active === it.id && 'is-active')}
              aria-current={active === it.id ? 'location' : undefined}
              onClick={go(it.id)}
            >
              <span className="fa-nav__idx" aria-hidden="true">{ROMAN[i]}</span>
              {it.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="fa-nav__actions">
        {actions}
        <IconButton className="fa-nav__menu" label={menuOpen ? 'Close menu' : 'Open menu'} onClick={onMenuToggle} aria-expanded={menuOpen}>
          <Icon name={menuOpen ? 'close' : 'menu'} />
        </IconButton>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ StatCard */

export interface StatCardProps {
  /** The number, as text ("4", "12+", "03"). */
  value: string;
  label: string;
  /** Small index above the value ("01"). */
  index?: string;
  className?: string;
}

export function StatCard({ value, label, index, className }: StatCardProps) {
  return (
    <div className={cx('fa-stat', className)}>
      {index ? <span className="fa-stat__idx">{index}</span> : null}
      <span className="fa-stat__value">{value}</span>
      <span className="fa-stat__label">{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ SkillCard */

const LEVELS = ['', 'Learning', 'Working', 'Proficient', 'Fluent'];

export interface SkillCardProps {
  name: string;
  icon?: React.ReactNode;
  /** 1–4 notches: Learning · Working · Proficient · Fluent. */
  level?: 1 | 2 | 3 | 4;
  /** Override the level word. */
  levelLabel?: string;
  /** One line on how you use it. */
  note?: string;
  className?: string;
}

export function SkillCard({ name, icon, level = 3, levelLabel, note, className }: SkillCardProps) {
  const word = levelLabel ?? LEVELS[level];
  return (
    <div className={cx('fa-skill', className)}>
      <span className="fa-skill__icon" aria-hidden="true">{icon}</span>
      <span className="fa-skill__level" role="img" aria-label={`${word}, level ${level} of 4`}>
        <span className="fa-skill__notches" aria-hidden="true">
          {[1, 2, 3, 4].map((n) => <span key={n} className={cx('fa-skill__notch', n <= level && 'is-on')} />)}
        </span>
        <span className="fa-skill__word" aria-hidden="true">{word}</span>
      </span>
      <h3 className="fa-skill__name">{name}</h3>
      {note ? <p className="fa-skill__note">{note}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ ProjectCard */

export interface ProjectCardProps {
  title: string;
  description: string;
  tags?: string[];
  /** Screenshot URL (16:10). Omit for a project still in rehearsal: the empty stage shows instead. */
  image?: string;
  imageAlt?: string;
  /** "01", "02"… */
  index?: string;
  /** Wide two-column layout plus the Featured badge. One per page. */
  featured?: boolean;
  /** Status word for unfinished work ("In rehearsal"). */
  status?: string;
  href?: string;
  repo?: string;
  className?: string;
}

export function ProjectCard({ title, description, tags, image, imageAlt, index, featured = false, status, href, repo, className }: ProjectCardProps) {
  return (
    <article className={cx('fa-project', featured && 'fa-project--featured', !image && 'fa-project--draft', className)}>
      <div className="fa-project__media">
        {image
          ? <img src={image} alt={imageAlt ?? ''} loading="lazy" decoding="async" />
          : <div className="fa-project__empty" aria-hidden="true"><Star size={24} tone="chrome" /></div>}
      </div>
      <div className="fa-project__body">
        <div className="fa-project__meta">
          {index ? <span className="fa-project__idx">{index}</span> : null}
          {featured ? <Badge tone="violet">Featured</Badge> : null}
          {status ? <Badge>{status}</Badge> : null}
        </div>
        <h3 className="fa-project__title">{title}</h3>
        <p className="fa-project__desc">{description}</p>
        {tags && tags.length ? (
          <ul className="fa-project__tags">{tags.map((t) => <li key={t}><Tag>{t}</Tag></li>)}</ul>
        ) : null}
        {href || repo ? (
          <div className="fa-project__links">
            {href ? <Button variant="quiet" href={href} target="_blank" rel="noopener noreferrer" iconEnd={<Icon name="arrow-up-right" size={16} />}>Live demo</Button> : null}
            {repo ? <Button variant="quiet" href={repo} target="_blank" rel="noopener noreferrer" icon={<Icon name="github" size={16} />}>Source</Button> : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ ContactLink */

export interface ContactLinkProps {
  icon: React.ReactNode;
  /** Uppercase mono label ("Email"). */
  label: string;
  /** What the visitor sees ("smartchampmarwan@gmail.com"). */
  value: string;
  href: string;
  /** Opens in a new tab (social profiles). */
  external?: boolean;
  className?: string;
}

export function ContactLink({ icon, label, value, href, external = false, className }: ContactLinkProps) {
  return (
    <a
      className={cx('fa-contact', className)}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      <span className="fa-contact__icon" aria-hidden="true">{icon}</span>
      <span className="fa-contact__text">
        <span className="fa-contact__label">{label}</span>
        <span className="fa-contact__value">{value}</span>
      </span>
      <Icon name="arrow-up-right" className="fa-contact__arrow" />
    </a>
  );
}

/* ------------------------------------------------------------------ Quote */

export interface QuoteProps {
  children: React.ReactNode;
  cite?: string;
  /** Show the lotus above the quote (default true). */
  lotus?: boolean;
  className?: string;
}

export function Quote({ children, cite, lotus = true, className }: QuoteProps) {
  return (
    <figure className={cx('fa-quote', className)}>
      {lotus ? (
        <svg className="fa-quote__lotus" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 20 C50 20, 45 35, 45 50 C45 65, 50 80, 50 80 C50 80, 55 65, 55 50 C55 35, 50 20, 50 20 Z" opacity="0.8" />
          <path d="M50 30 C50 30, 30 35, 25 50 C20 65, 35 75, 50 75 C65 75, 80 65, 75 50 C70 35, 50 30, 50 30 Z" opacity="0.6" />
          <path d="M50 35 C50 35, 35 40, 32 52 C29 64, 40 70, 50 70 C60 70, 71 64, 68 52 C65 40, 50 35, 50 35 Z" opacity="0.4" />
          <ellipse cx="50" cy="75" rx="8" ry="4" opacity="0.3" />
        </svg>
      ) : null}
      <blockquote className="fa-quote__text">{children}</blockquote>
      {cite ? <figcaption className="fa-quote__cite">{cite}</figcaption> : null}
    </figure>
  );
}

/* ------------------------------------------------------------------ Loader */

export interface LoaderProps {
  /** Visible and announced text. */
  label?: string;
  className?: string;
}

export function Loader({ label = 'The curtain rises', className }: LoaderProps) {
  return (
    <div className={cx('fa-loader', className)} role="status">
      <span className="fa-loader__stars" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => <Star key={i} size={12} tone="current" />)}
      </span>
      <span className="fa-loader__label">{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ Footer */

export interface FooterProps {
  name: string;
  /** One line under the name. */
  note?: string;
  /** Fine print at the bottom ("© 2026 · React · Vite"). */
  fine?: string;
  /** Social IconButtons. */
  children?: React.ReactNode;
  className?: string;
}

export function Footer({ name, note, fine, children, className }: FooterProps) {
  return (
    <footer className={cx('fa-footer', className)}>
      <div className="fa-footer__id">
        <p className="fa-footer__name"><Star size={12} tone="chrome" />{name}</p>
        {note ? <p className="fa-footer__note">{note}</p> : null}
      </div>
      {children ? <div className="fa-footer__social">{children}</div> : null}
      {fine ? <p className="fa-footer__fine">{fine}</p> : null}
    </footer>
  );
}
