// Shared UI primitives — brand-accurate to Figma designs.
const { useState, useEffect } = React;

const Icon = ({ name, size = 18, className = "", style = {} }) => (
  <i data-lucide={name} style={{ width: size, height: size, ...style }} className={className} />
);
const useLucide = () => { useEffect(() => { if (window.lucide) window.lucide.createIcons(); }); };

/* Brand mark — official symbol (imported from Figma) */
const BrandMark = ({ size = 32 }) => (
  <img src="assets/symbol.svg" alt="Revisionary Online" style={{ width: size, height: size, display: "block" }} />
);

/* Brand lockup — full combination mark (symbol + wordmark together) */
const BrandLockup = ({ size = 32 }) => (
  <img src="assets/combination.svg" alt="Revisionary Online" style={{ height: size * 0.9, width: "auto", display: "block" }} />
);

const Button = ({ variant = "primary", size = "md", children, iconLeft, iconRight, onClick, disabled, block }) => {
  useLucide();
  const cls = `btn btn-${variant} btn-${size}${disabled ? " is-disabled" : ""}${block ? " is-block" : ""}`;
  return (
    <button className={cls} onClick={onClick} disabled={disabled}>
      {iconLeft && <Icon name={iconLeft} size={16} />}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} size={16} />}
    </button>
  );
};

const StatusChip = ({ status = "open" }) => {
  const labels = { open: "Open", scheduled: "Scheduled", closed: "Closed", graded: "Graded" };
  return <span className={`status-chip ${status}`}>{labels[status]}</span>;
};

const SubjectIcon = ({ color = "teal", icon = "pie-chart", size = 36, radius = 8 }) => {
  useLucide();
  return (
    <div className={`subj-ic ${color}`} style={{ width: size, height: size, borderRadius: radius }}>
      <Icon name={icon} size={size * 0.55} />
    </div>
  );
};

Object.assign(window, { Icon, useLucide, Button, BrandMark, BrandLockup, StatusChip, SubjectIcon });
