const ICONS: Record<string, string> = {
  terminal:             "\uEB8E",
  work:                 "\uE8F9",
  cloud:                "\uE2BD",
  chevron_right:        "\uE409",
  person:               "\uE7FD",
  settings:             "\uE8B8",
  power_settings_new:   "\uE8AC",
  account_tree:         "\uE97A",
  database:             "\uF20E",
  lan:                  "\uEB2F",
  security:             "\uE32A",
  close:                "\uE14C",
  menu:                 "\uE5D2",
};

interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  return (
    <span className={`material-symbols-outlined${className ? ` ${className}` : ""}`} aria-hidden="true">
      {ICONS[name] ?? name}
    </span>
  );
}
