(() => {
  const wrapTitleRuns = (heading) => {
    const text = heading.textContent;

    const pattern = /（[^）]*）|\([^)]*\)|\d{4}\.[A-Za-z]{3,9}\.|[A-Za-z][A-Za-z0-9'’.-]*(?:\s+[A-Za-z][A-Za-z0-9'’.-]*)*|[ぁ-ゖァ-ヺー]+/gu;
    const fragment = document.createDocumentFragment();
    let offset = 0;

    for (const match of text.matchAll(pattern)) {
      const start = match.index;
      if (start > offset) fragment.append(document.createTextNode(text.slice(offset, start)));

      const value = match[0];
      const parenthesized = value.match(/^([（(])([\s\S]*)([）)])$/u);
      if (parenthesized) {
        const [, opening, inside, closing] = parenthesized;
        const parenthetical = document.createElement("span");
        parenthetical.className = "title-parenthetical";
        const open = document.createElement("span");
        open.className = "title-paren";
        open.textContent = opening;
        parenthetical.append(open);

        const hasKana = /[ぁ-ゖァ-ヺー]/u.test(inside);
        const hasLatin = /[A-Za-z]/u.test(inside);
        if (hasKana || hasLatin) {
          const titlePart = document.createElement("span");
          titlePart.className = hasKana ? "title-ja" : "title-en";
          titlePart.textContent = inside;
          parenthetical.append(titlePart);
        } else {
          parenthetical.append(document.createTextNode(inside));
        }

        const close = document.createElement("span");
        close.className = "title-paren";
        close.textContent = closing;
        parenthetical.append(close);
        fragment.append(parenthetical);
      } else if (/^\d{4}\.[A-Za-z]{3,9}\.$/u.test(value)) {
        const date = document.createElement("span");
        date.className = "title-date";

        const year = document.createElement("span");
        year.className = "title-year";
        year.textContent = value.slice(0, 4);

        const separator = document.createElement("span");
        separator.className = "title-date-separator";
        separator.textContent = ".";

        const month = document.createElement("span");
        month.className = "title-month";
        month.textContent = value.slice(5);

        date.append(year, separator, month);
        fragment.append(date);
      } else {
        const hasKana = /[ぁ-ゖァ-ヺー]/u.test(value);
        const hasLatin = /[A-Za-z]/u.test(value);
        if (hasKana || hasLatin) {
          const span = document.createElement("span");
          span.className = hasKana ? "title-ja" : "title-en";
          span.textContent = value;
          fragment.append(span);
        } else {
          fragment.append(document.createTextNode(value));
        }
      }

      offset = start + value.length;
    }

    if (offset < text.length) fragment.append(document.createTextNode(text.slice(offset)));
    heading.replaceChildren(fragment);
  };

  document.querySelectorAll("h1.n").forEach(wrapTitleRuns);
  document.querySelectorAll("a.btn").forEach((link) => {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
})();
