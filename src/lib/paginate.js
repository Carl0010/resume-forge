// Paginate actual rendered DOM. The resulting pages are used unchanged in preview and print.
// Columns flow independently; choose Simple layout for an explicit single reading order.
export function paginateResume(source, host) {
  host.replaceChildren();
  const pages = [];
  const layout = source.dataset.layout;
  const streams =
    layout === 'sidebar'
      ? ['.rs-main', '.rs-side']
      : layout === 'twocol'
        ? ['.rs-main', '.rs-aside']
        : ['.rs-flow'];
  const makePage = (index) => {
    if (pages[index]) return pages[index];
    const page = source.cloneNode(true);
    page.classList.add('rs-page');
    page.dataset.continuation = String(index > 0);
    page.querySelectorAll('.rs-sec').forEach((n) => n.remove());
    if (index > 0)
      page.querySelectorAll('.rs-header, .rs-side > .rs-photo').forEach((n) => n.remove());
    host.append(page);
    pages.push(page);
    return page;
  };
  makePage(0);
  for (const selector of streams) {
    const original = source.querySelector(selector);
    if (!original) continue;
    let index = 0;
    let used =
      !!pages[0].querySelector(`${selector} .rs-header, ${selector} > .rs-photo`) ||
      layout === 'twocol';
    const bottom = () => {
      const page = makePage(index);
      return (
        page.getBoundingClientRect().bottom -
        (parseFloat(getComputedStyle(source).getPropertyValue('--pad')) * 96) / 25.4 -
        1
      );
    };
    const fits = (node, reserve = 0) => node.getBoundingClientRect().bottom + reserve <= bottom();
    for (const originalSection of original.querySelectorAll(':scope > .rs-sec')) {
      let section, body;
      let wrappers = new Map();
      const ensureSection = () => {
        if (section?.isConnected) return;
        section = originalSection.cloneNode(false);
        const heading = originalSection.querySelector(':scope > .rs-st');
        if (heading) section.append(heading.cloneNode(true));
        const originalBody = originalSection.querySelector(':scope > .rs-body');
        body = originalBody ? originalBody.cloneNode(false) : document.createElement('div');
        section.append(body);
        makePage(index).querySelector(selector).append(section);
      };
      const nextPage = () => {
        if (section && !body.textContent.trim() && !body.querySelector('img')) section.remove();
        if (index >= 199)
          throw new Error('This resume exceeds 200 pages. Shorten the content before exporting.');
        index += 1;
        makePage(index);
        section = null;
        wrappers = new Map();
        used = false;
      };
      const targetFor = (path) => {
        ensureSection();
        let target = body;
        for (const originalNode of path) {
          if (!wrappers.has(originalNode)) {
            const clone = originalNode.cloneNode(false);
            target.append(clone);
            wrappers.set(originalNode, clone);
          }
          target = wrappers.get(originalNode);
        }
        return target;
      };
      const fitsFreshPage = (node, path) => {
        const probe = source.cloneNode(true);
        probe.classList.add('rs-page');
        probe.dataset.continuation = 'true';
        probe
          .querySelectorAll('.rs-sec, .rs-header, .rs-side > .rs-photo')
          .forEach((n) => n.remove());
        const probeSection = originalSection.cloneNode(false);
        const heading = originalSection.querySelector(':scope > .rs-st');
        if (heading) probeSection.append(heading.cloneNode(true));
        const probeBody = document.createElement('div');
        probeBody.className = 'rs-body';
        probeSection.append(probeBody);
        probe.querySelector(selector).append(probeSection);
        let target = probeBody;
        for (const wrapper of path) {
          const child = wrapper.cloneNode(false);
          target.append(child);
          target = child;
        }
        target.append(node.cloneNode(true));
        host.append(probe);
        const limit =
          probe.getBoundingClientRect().bottom -
          (parseFloat(getComputedStyle(source).getPropertyValue('--pad')) * 96) / 25.4 -
          1;
        const fits = probeSection.getBoundingClientRect().bottom <= limit;
        probe.remove();
        return fits;
      };
      const place = (node, path = []) => {
        let target = targetFor(path);
        let clone = node.cloneNode(true);
        target.append(clone);
        const reserve = node.classList?.contains('rs-row') && path.length ? 28 : 0;
        if (fits(section, reserve)) {
          used = true;
          return;
        }
        clone.remove();
        if (used && fitsFreshPage(node, path)) {
          nextPage();
          target = targetFor(path);
          clone = node.cloneNode(true);
          target.append(clone);
          if (fits(section)) {
            used = true;
            return;
          }
          clone.remove();
        }
        // An entry larger than one page can split at paragraphs, bullets, then words.
        if (node.nodeType === Node.ELEMENT_NODE && node.children.length) {
          for (const child of node.childNodes) place(child, [...path, node]);
          return;
        }
        const words = (node.textContent || '').match(/\S+\s*/g) || [];
        if (!words.length) return;
        while (words.length) {
          target = targetFor(path);
          const part = node.cloneNode(false);
          target.append(part);
          let low = 0,
            high = words.length;
          while (low < high) {
            const mid = Math.ceil((low + high) / 2);
            part.textContent = words.slice(0, mid).join('');
            if (fits(section)) low = mid;
            else high = mid - 1;
          }
          if (!low) {
            part.remove();
            if (used) {
              nextPage();
              continue;
            }
            throw new Error(
              'This text cannot fit on a page. Reduce the font size or reset the template style.',
            );
          }
          part.textContent = words.splice(0, low).join('');
          used = true;
          if (words.length) nextPage();
        }
      };
      // Avoid moving a whole multi-entry section; keep its heading with its first entry.
      const originalBody = originalSection.querySelector(':scope > .rs-body');
      const blocks = originalBody
        ? [...originalBody.children]
        : [...originalSection.children].filter((n) => !n.classList.contains('rs-st'));
      for (const block of blocks) place(block);
    }
  }
  pages.forEach((page, index) => {
    const footer = document.createElement('div');
    footer.className = 'rs-page-footer';
    footer.textContent = `${index + 1} / ${pages.length}`;
    page.append(footer);
  });
  return { html: host.innerHTML, count: pages.length };
}
