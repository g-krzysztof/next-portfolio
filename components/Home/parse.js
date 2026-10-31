// Strapi trzyma treści jako markdown z własnymi tagami <primary>/<secondary>.
// Tu rozkładamy go na struktury, które layout potrafi złożyć po swojemu.

const stripTags = (text = '') =>
  text
    .replace(/<\/?(primary|secondary)>/g, '')
    .replace(/\*\*/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();

export const pickPage = (data, slug) => {
  const entry = data?.data?.find(({ attributes }) => attributes.slug === slug);
  return entry ? entry.attributes : null;
};

// "## 2021 do obecnie\n\n<primary>…</primary>…" → [{ period, body }]
export const parseResume = (content = '') => {
  const [intro, ...chunks] = content.split(/\n(?=## )/);
  const entries = chunks.map((chunk) => {
    const [heading, ...rest] = chunk.split('\n');
    const body = rest.join('\n').trim();
    const roleMatch = body.match(/<primary>(.*?)<\/primary>/);
    return {
      period: stripTags(heading.replace(/^##\s*/, '')),
      role: roleMatch ? stripTags(roleMatch[1]) : null,
      body: roleMatch ? body.replace(roleMatch[0], '').trim() : body,
    };
  });
  return { intro: stripTags(intro.replace(/^#+\s*/gm, '')), entries };
};

// "#### Nagłówek\n\n- a\n- b" → [{ title, items }]
export const parseSkills = (content = '') =>
  content
    .split(/\n?(?=#### )/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [heading, ...rest] = chunk.split('\n');
      return {
        title: stripTags(heading.replace(/^#+\s*/, '')),
        items: rest
          .filter((line) => line.trim().startsWith('- '))
          .map((line) => line.trim().slice(2).trim()),
      };
    });

export const plainSkill = (item) => stripTags(item).replace(/\s+/g, ' ');

// Opinia: data, akapity (###), a po separatorze "## &nbsp;" podpis (####).
export const parseRecommendation = ({ id, attributes }) => {
  const lines = attributes.text.split('\n').map((line) => line.trim());
  const separator = lines.findIndex((line) => /^##\s/.test(line));
  const head = separator === -1 ? lines : lines.slice(0, separator);
  const signature = separator === -1 ? [] : lines.slice(separator + 1);

  const dateLine = head.find((line) => line.startsWith('#### '));
  const paragraphs = head
    .filter((line) => line.startsWith('### '))
    .map((line) => stripTags(line.slice(4)));
  const meta = signature
    .filter((line) => line.startsWith('#### '))
    .map((line) => stripTags(line.slice(5)))
    .filter(Boolean);

  return {
    id,
    date: dateLine ? stripTags(dateLine.slice(5)) : '',
    paragraphs,
    author: meta[0] || attributes.name,
    roles: meta.slice(1),
  };
};

export const parseRecommendations = (data) =>
  (data?.data || []).map(parseRecommendation);
