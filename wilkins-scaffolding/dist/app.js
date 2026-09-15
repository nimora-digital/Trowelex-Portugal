const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
function closeMenu() { mobileMenu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); mobileMenu.hidden = !open; });
mobileMenu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileMenu.hidden) { closeMenu(); menuButton.focus(); } });
document.querySelectorAll('[data-year]').forEach(element => { element.textContent = new Date().getFullYear(); });

const form = document.querySelector('#quote-form');
const dateField = document.querySelector('#desired-date');
const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
dateField.min = today.toISOString().slice(0, 10);
const submitButton = form.querySelector('[type="submit"]');
const status = document.querySelector('#submit-status');
const quoteReview = document.querySelector('#quote-review');
const inputs = [...form.querySelectorAll('input[type="file"]')];
const uploadError = document.querySelector('#upload-error');
let imageURLs = [];
let currentEmail = '';

if (window.WILKINS_LOCAL_PREVIEW) {
  document.querySelector('#local-form-note').hidden = false;
  document.querySelector('#submit-label').textContent = 'Prepare quote email';
}
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
function checkPhotos() {
  const files = inputs.flatMap(input => [...input.files]);
  const invalid = files.some(file => !allowedTypes.has(file.type) || !/\.(jpe?g|png|webp)$/i.test(file.name));
  const oversize = files.reduce((sum, file) => sum + file.size, 0) > 7_000_000;
  const message = invalid ? 'Please choose JPG, PNG or WebP photographs.' : oversize ? 'Please choose smaller photographs. The combined limit is 7 MB.' : '';
  uploadError.textContent = message; uploadError.hidden = !message;
  inputs.forEach(input => input.setCustomValidity(message));
  return !message;
}
function renderPhotoPreviews() {
  imageURLs.forEach(url => URL.revokeObjectURL(url)); imageURLs = [];
  const previews = document.querySelector('#photo-previews'); previews.replaceChildren();
  inputs.forEach((input, index) => {
    const file = input.files[0];
    input.closest('label').hidden = index > 0 && !inputs[index - 1].files.length && !file;
    if (!file) return;
    const wrapper = document.createElement('div'); wrapper.className = 'photo-preview';
    const caption = document.createElement('span'); caption.textContent = `${file.name} · ${(file.size / 1_000_000).toFixed(1)} MB`;
    if (allowedTypes.has(file.type)) { const image = document.createElement('img'); const url = URL.createObjectURL(file); imageURLs.push(url); image.src = url; image.alt = `Selected photograph: ${file.name}`; wrapper.append(image); }
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = '×'; remove.setAttribute('aria-label', `Remove ${file.name}`);
    remove.addEventListener('click', () => { input.value = ''; checkPhotos(); renderPhotoPreviews(); input.focus(); });
    wrapper.append(caption, remove); previews.append(wrapper);
  });
}
inputs.forEach(input => input.addEventListener('change', () => { checkPhotos(); renderPhotoPreviews(); }));
renderPhotoPreviews();

function enquirySummary() {
  const data = new FormData(form);
  const lines = [
    ['Name', 'name'], ['Phone', 'phone'], ['Email', 'email'], ['Project location', 'project-location'],
    ['Planned work', 'project-type'], ['Height / property type', 'property-details'], ['Desired start date', 'desired-date'], ['Description', 'description']
  ].map(([label, field]) => `${label}: ${String(data.get(field) || '').trim() || 'Not specified'}`);
  const files = inputs.flatMap(input => [...input.files]);
  if (files.length) lines.push(`Photographs to attach: ${files.map(file => file.name).join(', ')}`);
  return `Scaffolding quote enquiry\n\n${lines.join('\n\n')}`;
}
function showEmailReview() {
  currentEmail = enquirySummary();
  document.querySelector('#email-summary').textContent = currentEmail;
  document.querySelector('#quote-email-link').href = `mailto:wilkinsjay05@gmail.com?subject=${encodeURIComponent('Scaffolding quote enquiry')}&body=${encodeURIComponent(currentEmail)}`;
  document.querySelector('#attachment-reminder').hidden = !inputs.some(input => input.files.length);
  document.querySelector('#copy-status').textContent = '';
  quoteReview.showModal();
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  for (const input of form.querySelectorAll('input:not([type="file"]):not([type="checkbox"]), textarea')) input.value = input.value.trim();
  if (!checkPhotos() || !form.reportValidity()) return;
  if (window.WILKINS_LOCAL_PREVIEW) { showEmailReview(); return; }
  status.hidden = false; status.classList.remove('form-error'); status.textContent = 'Sending your enquiry…'; submitButton.disabled = true;
  try {
    const response = await fetch(form.action, { method: 'POST', body: new FormData(form) });
    if (!response.ok) throw new Error('Submission failed');
    window.location.assign('/thank-you.html');
  } catch {
    status.classList.add('form-error');
    status.replaceChildren(document.createTextNode('Your enquiry could not be sent. Please try again, call +44 7949 914442, or '));
    const emailOption = document.createElement('button'); emailOption.type = 'button'; emailOption.className = 'text-link'; emailOption.textContent = 'prepare an email instead'; emailOption.addEventListener('click', showEmailReview); status.append(emailOption);
    submitButton.disabled = false;
  }
});
form.addEventListener('reset', () => { setTimeout(() => { checkPhotos(); renderPhotoPreviews(); }, 0); });
document.querySelector('#copy-enquiry').addEventListener('click', async () => {
  const copyStatus = document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText(currentEmail); copyStatus.textContent = 'Enquiry copied. Paste it into your email to wilkinsjay05@gmail.com.'; }
  catch { copyStatus.textContent = 'Copy the enquiry text above, then email it to wilkinsjay05@gmail.com.'; }
});
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target !== dialog) return; const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close(); });
});

function localAsset(value) { return typeof value === 'string' && value.startsWith('/assets/') && !value.includes('..'); }
async function loadCompanyContent() {
  try {
    const response = await fetch('/company.json'); if (!response.ok) return;
    const company = await response.json();
    if (localAsset(company.logo)) document.querySelectorAll('.wordmark').forEach(wordmark => { const image = document.createElement('img'); image.src = company.logo; image.alt = 'Wilkins Scaffolding Services'; wordmark.replaceChildren(image); });
    if (company.heroImage && localAsset(company.heroImage.src)) { const image = document.createElement('img'); image.className = 'hero-background'; image.src = company.heroImage.src; image.alt = company.heroImage.alt; image.fetchPriority = 'high'; document.querySelector('.hero').prepend(image); document.querySelector('.hero').classList.add('hero-with-image'); }
    if (company.facebookUrl && /^https:\/\/(www\.)?facebook\.com\//.test(company.facebookUrl)) { const facebook = document.createElement('a'); facebook.href = company.facebookUrl; facebook.className = 'facebook-link'; facebook.textContent = 'Wilkins on Facebook'; facebook.target = '_blank'; facebook.rel = 'noopener'; document.querySelector('.footer-top>div').append(facebook); }
    const additionalServices = document.querySelector('#additional-services');
    for (const service of company.additionalServices || []) {
      if (!service.confirmedSource || !service.title || !service.description) continue;
      const section = document.createElement('article'); section.className = 'additional-service';
      const content = document.createElement('div'); const title = document.createElement('h3'); title.textContent = service.title;
      const description = document.createElement('p'); description.textContent = service.description;
      const action = document.createElement('a'); action.className = 'text-link'; action.href = '#quote'; action.textContent = 'Request a Quote ↗'; content.append(title, description, action); section.append(content);
      if (localAsset(service.image)) { const image = document.createElement('img'); image.src = service.image; image.alt = service.imageAlt || service.title; image.loading = 'lazy'; section.append(image); }
      additionalServices.append(section); additionalServices.hidden = false;
    }
    const gallery = document.querySelector('#project-gallery');
    for (const project of company.projects || []) {
      if (!project.confirmedSource || !localAsset(project.image) || !project.title || !project.alt) continue;
      const button = document.createElement('button'); button.type = 'button'; button.className = 'project-card';
      const figure = document.createElement('figure'); const image = document.createElement('img'); image.src = project.image; image.alt = project.alt; image.loading = 'lazy'; image.width = 800; image.height = 600;
      const caption = document.createElement('figcaption'); const title = document.createElement('span'); title.textContent = project.title; const icon = document.createElement('span'); icon.textContent = '↗'; icon.setAttribute('aria-hidden', 'true'); caption.append(title, icon); figure.append(image, caption); button.append(figure);
      button.setAttribute('aria-label', `View photograph: ${project.title}`);
      button.addEventListener('click', () => { const lightbox = document.querySelector('#project-lightbox'); const largeImage = document.querySelector('#lightbox-image'); largeImage.src = project.image; largeImage.alt = project.alt; document.querySelector('#lightbox-title').textContent = project.title; document.querySelector('#lightbox-description').textContent = project.description || ''; lightbox.showModal(); });
      gallery.append(button); gallery.hidden = false;
    }
    const reviewContainer = document.querySelector('#verified-reviews');
    for (const review of company.reviews || []) {
      if (!review.confirmedSource || !review.text || !review.author) continue;
      const quote = document.createElement('blockquote'); quote.className = 'review-item'; const text = document.createElement('p'); text.textContent = review.text; const author = document.createElement('cite'); author.textContent = review.author; quote.append(text, author); reviewContainer.append(quote); reviewContainer.hidden = false;
    }
  } catch { /* Core content and contact details remain available without enhancements. */ }
}
loadCompanyContent();

const sections = document.querySelectorAll('main>section[id]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => { for (const entry of entries) { if (!entry.isIntersecting) continue; document.querySelectorAll('.desktop-nav a').forEach(link => { if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); }); } }, { rootMargin: '-15% 0px -65% 0px' });
  sections.forEach(section => observer.observe(section));
}
window.addEventListener('pagehide', () => { imageURLs.forEach(url => URL.revokeObjectURL(url)); });

// A supported browser can stage an enquiry through the same fields. Submission stays with the visitor.
if (document.modelContext?.registerTool) {
  const lifecycle = new AbortController();
  try {
    Promise.resolve(document.modelContext.registerTool({
      name: 'stage_scaffolding_quote', title: 'Prepare a scaffolding quote enquiry',
      description: 'Fill the visible quote form and scroll to it. Does not submit or email the enquiry. Photographs and contact permission must be added by the visitor.',
      inputSchema: { type: 'object', properties: { name: { type: 'string' }, phone: { type: 'string' }, email: { type: 'string' }, location: { type: 'string' }, projectType: { type: 'string' }, property: { type: 'string' }, description: { type: 'string' }, desiredDate: { type: 'string' } }, additionalProperties: false },
      annotations: { readOnlyHint: false },
      execute(input) {
        const fields = { name: 'name', phone: 'phone', email: 'email', location: 'location', projectType: 'project-type', property: 'property', description: 'description', desiredDate: 'desired-date' };
        if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Provide an object of quote fields.');
        for (const [key, value] of Object.entries(input)) { if (!(key in fields) || typeof value !== 'string' || value.length > document.getElementById(fields[key]).maxLength && document.getElementById(fields[key]).maxLength > 0) throw new Error('Invalid quote field.'); if (key === 'desiredDate' && value && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < dateField.min)) throw new Error('Use an upcoming date in YYYY-MM-DD format.'); }
        for (const [key, value] of Object.entries(input)) document.getElementById(fields[key]).value = value;
        document.querySelector('#quote').scrollIntoView({ behavior: 'auto' });
        return { status: 'staged', submitted: false, fieldsFilled: Object.keys(input), nextStep: 'Review the form, add photographs if needed and confirm contact permission.' };
      }
    }, { signal: lifecycle.signal })).catch(() => {});
    window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
  } catch { /* Optional browser capability; the visible form remains the primary flow. */ }
}
