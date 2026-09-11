/* ============================================================
   MULTIBIZ · App principal (auth + router + vistas)
   ============================================================ */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const el = (tag, attrs = {}, ...children) => {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') n.className = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v !== false && v != null) n.setAttribute(k, v);
  });
  children.flat().forEach((c) => {
    if (c == null || c === false) return;
    n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return n;
};
const icon = (name, size = 18, sw = 1.9) => {
  const paths = ICONS[name] || ICONS.circle;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="${sw}" width="${size}" height="${size}">${paths}</svg>`;
};

const ICONS = {
  grid: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4A2 2 0 0 0 9.6 16H20a2 2 0 0 0 2-1.6l1.4-8.4H6"/>',
  box:  '<path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05"/><path d="M12 22.08V12"/>',
  alert:'<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  chart:'<path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 5-6"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  close:'<path d="M18 6 6 18M6 6l12 12"/>',
  check:'<polyline points="20 6 9 17 4 12"/>',
  chevron:'<polyline points="9 18 15 12 9 6"/>',
  wa:   '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/>',
  dollar:'<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  trash:'<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  circle:'<circle cx="12" cy="12" r="9"/>',
  building:'<path d="M3 21V7l9-4 9 4v14"/><path d="M9 21v-6h6v6"/>',
};

/* ============================================================
   TOASTS
   ============================================================ */
function toast(msg, type = 'ok') {
  const root = $('#toast');
  const t = el('div', { class: 'toast ' + type }, icon(type === 'err' ? 'alert' : 'check', 16, 2.4), msg);
  root.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(20px)'; t.style.transition = '.25s'; }, 2400);
  setTimeout(() => t.remove(), 2800);
}

/* ============================================================
   MODAL
   ============================================================ */
function openModal({ title, body, footer, onClose }) {
  const root = $('#modal');
  root.hidden = false;
  root.innerHTML = '';
  const modal = el('div', { class: 'modal' });
  const head = el('div', { class: 'modal-head' },
    el('h3', {}, title),
    el('button', { onclick: closeModal, 'aria-label': 'Cerrar' }, el('span', { html: icon('close', 18) }))
  );
  const bodyEl = el('div', { class: 'modal-body' });
  if (typeof body === 'string') bodyEl.innerHTML = body;
  else bodyEl.appendChild(body);
  const foot = el('div', { class: 'modal-foot' });
  if (footer) footer.forEach((b) => foot.appendChild(b));
  modal.append(head, bodyEl, foot);
  root.appendChild(modal);
  root.onclick = (e) => { if (e.target === root) closeModal(); };
  function closeModal() {
    root.hidden = true;
    root.innerHTML = '';
    if (onClose) onClose();
  }
  return { close: closeModal, bodyEl, footEl: foot };
}

/* ============================================================
   ROUTER
   ============================================================ */
const routes = {
  '': () => Store.currentUser() ? navigate('dashboard') : renderAuth(),
  login: renderAuth,
  register: renderRegister,
  dashboard: renderDashboard,
  sales: renderSales,
  products: renderProducts,
  inventory: renderInventory,
  customers: renderCustomers,
  reports: renderReports,
  settings: renderSettings,
};
function navigate(path) {
  if (location.hash.slice(2) === path) { render(); return; }
  location.hash = '#/' + path;
}
function currentRoute() {
  return (location.hash.replace(/^#\/?/, '') || '').split('?')[0];
}

function render() {
  const user = Store.currentUser();
  const route = currentRoute();

  if (!user && !['login', 'register', ''].includes(route)) {
    navigate('login'); return;
  }
  if (user && ['login', 'register', ''].includes(route)) {
    navigate('dashboard'); return;
  }
  if (!user) {
    (route === 'register' ? routes.register : routes.login)();
  } else {
    (routes[route] || routes.dashboard)();
  }
}

/* ============================================================
   AUTH VIEWS
   ============================================================ */
function renderAuth() {
  const app = $('#app');
  app.className = 'app-root';
  app.innerHTML = '';
  const wrap = el('div', { class: 'auth-wrap' });

  // Hero
  const hero = el('div', { class: 'auth-hero' },
    el('div', { class: 'auth-brand' },
      el('div', { class: 'mark' }, 'M'),
      el('div', {},
        el('div', { class: 'auth-brand-name' }, 'Multibiz'),
        el('div', { class: 'auth-brand-sub' }, 'Panel multi-negocio')
      )
    ),
    el('div', { class: 'auth-hero-body' },
      el('h2', {}, 'Un solo panel. Todos tus negocios.'),
      el('p', {}, 'Gestiona ventas, inventario y clientes de múltiples negocios desde un solo lugar. Diseñado para equipos que crecen.'),
      el('div', { class: 'auth-hero-feats' },
        el('div', { class: 'feat' }, el('i', {}, icon('check', 14, 2.6)), 'Dashboard por negocio'),
        el('div', { class: 'feat' }, el('i', {}, icon('check', 14, 2.6)), 'Ventas e inventario en tiempo real'),
        el('div', { class: 'feat' }, el('i', {}, icon('check', 14, 2.6)), 'Multi-usuario y roles'),
      )
    ),
    el('div', { class: 'auth-hero-foot' }, '© 2026 Multibiz · Todos los derechos reservados')
  );

  // Panel
  const form = el('form', {
    onsubmit: (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      try {
        Store.login(fd.get('email'), fd.get('password'));
        toast('Bienvenido de nuevo');
        navigate('dashboard');
      } catch (err) { toast(err.message, 'err'); }
    }
  },
    el('h1', {}, 'Iniciar sesión'),
    el('div', { class: 'sub' }, 'Accede a tu panel multi-negocio.'),
    el('div', { class: 'field' }, el('label', {}, 'Correo electrónico'),
      el('input', { type: 'email', name: 'email', required: true, placeholder: 'tu@negocio.pe', autocomplete: 'email' })),
    el('div', { class: 'field' }, el('label', {}, 'Contraseña'),
      el('input', { type: 'password', name: 'password', required: true, placeholder: '••••••••', autocomplete: 'current-password' })),
    el('button', { class: 'btn btn-primary btn-block', type: 'submit' }, 'Entrar'),
    el('div', { class: 'auth-switch' },
      '¿No tienes cuenta? ',
      el('a', { onclick: () => navigate('register') }, 'Registra tu negocio')
    ),
    el('div', { class: 'demo-creds', html:
      '<strong>Cuentas de demostración</strong><br>' +
      'Admin: <code>admin@multibiz.pe</code> · <code>admin123</code><br>' +
      'Urbano: <code>maria@urbano.pe</code> · <code>urbano123</code><br>' +
      'Café: <code>carlos@cafe.pe</code> · <code>cafe123</code>'
    })
  );

  const panel = el('div', { class: 'auth-panel' }, el('div', { class: 'auth-card' }, form));
  wrap.append(hero, panel);
  app.appendChild(wrap);
}

function renderRegister() {
  const app = $('#app');
  app.className = 'app-root';
  app.innerHTML = '';
  const wrap = el('div', { class: 'auth-wrap' });

  const hero = el('div', { class: 'auth-hero' },
    el('div', { class: 'auth-brand' },
      el('div', { class: 'mark' }, 'M'),
      el('div', {},
        el('div', { class: 'auth-brand-name' }, 'Multibiz'),
        el('div', { class: 'auth-brand-sub' }, 'Panel multi-negocio')
      )
    ),
    el('div', { class: 'auth-hero-body' },
      el('h2', {}, 'Empieza gratis en menos de un minuto.'),
      el('p', {}, 'Crea tu cuenta y tu primer negocio. Agrega más negocios y usuarios cuando quieras.')
    ),
    el('div', { class: 'auth-hero-foot' }, '© 2026 Multibiz')
  );

  const form = el('form', {
    onsubmit: (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      try {
        Store.register({
          businessName: fd.get('businessName'),
          userName: fd.get('userName'),
          email: fd.get('email'),
          password: fd.get('password'),
        });
        toast('¡Bienvenido a Multibiz!');
        navigate('dashboard');
      } catch (err) { toast(err.message, 'err'); }
    }
  },
    el('h1', {}, 'Crear cuenta'),
    el('div', { class: 'sub' }, 'Registra tu negocio y empieza a gestionar.'),
    el('div', { class: 'field' }, el('label', {}, 'Nombre del negocio'),
      el('input', { name: 'businessName', required: true, placeholder: 'Ej. Moda Urbana' })),
    el('div', { class: 'field' }, el('label', {}, 'Tu nombre'),
      el('input', { name: 'userName', required: true, placeholder: 'Ej. María Ríos' })),
    el('div', { class: 'field' }, el('label', {}, 'Correo electrónico'),
      el('input', { type: 'email', name: 'email', required: true, placeholder: 'tu@negocio.pe' })),
    el('div', { class: 'field' }, el('label', {}, 'Contraseña'),
      el('input', { type: 'password', name: 'password', required: true, minlength: 6, placeholder: 'Mínimo 6 caracteres' })),
    el('button', { class: 'btn btn-primary btn-block', type: 'submit' }, 'Crear cuenta'),
    el('div', { class: 'auth-switch' },
      '¿Ya tienes cuenta? ',
      el('a', { onclick: () => navigate('login') }, 'Inicia sesión')
    )
  );

  const panel = el('div', { class: 'auth-panel' }, el('div', { class: 'auth-card' }, form));
  wrap.append(hero, panel);
  app.appendChild(wrap);
}

/* ============================================================
   APP SHELL (sidebar + topbar + content)
   ============================================================ */
const NAV = [
  { group: 'Principal', items: [
    { key: 'dashboard', label: 'Dashboard',  icon: 'grid', permission: 'dashboard:read' },
    { key: 'sales',     label: 'Ventas',     icon: 'cart', permission: 'sales:read' },
    { key: 'products',  label: 'Productos',  icon: 'box', permission: 'products:read' },
    { key: 'inventory', label: 'Inventario', icon: 'alert', badgeKey: 'lowStock', permission: 'inventory:read' },
    { key: 'customers', label: 'Clientes',   icon: 'users', permission: 'customers:read' },
  ]},
  { group: 'Análisis', items: [
    { key: 'reports',   label: 'Reportes',   icon: 'chart', permission: 'reports:read' },
    { key: 'settings',  label: 'Configuración', icon: 'gear', permission: 'settings:read' },
  ]},
];

function shell({ title, subtitle, actions, content }) {
  const app = $('#app');
  app.className = 'app';
  app.innerHTML = '';

  const user = Store.currentUser();
  const biz = Store.activeBusiness();
  const kpis = Store.kpis();
  const active = currentRoute();

  /* ----- SIDEBAR ----- */
  const sidebar = el('aside', { class: 'sidebar' });

  const bizSwitch = el('div', { class: 'biz-switch', onclick: openBizSelector },
    el('div', { class: 'biz-avatar', style: `background:${biz.color}` }, initials(biz.name)),
    el('div', { class: 'biz-meta' },
      el('div', { class: 'biz-name' }, biz.name),
      el('div', { class: 'biz-role' }, biz.plan + ' · ' + (user.role === 'superadmin' ? 'Superadmin' : Store.roleLabel(Store.currentRole() ?? 'owner')))
    ),
    el('span', { html: icon('chevron', 14, 2.4) })
  );
  sidebar.appendChild(bizSwitch);

  const nav = el('nav', { class: 'nav' });
  NAV.forEach((g) => {
    nav.appendChild(el('div', { class: 'nav-label' }, g.group));
    g.items.forEach((it) => {
      const canAccess = it.permission ? (Store.can ? Store.can(it.permission) : true) : true;
      if (!canAccess) return; // ocultar módulos según permiso
      const badge = it.badgeKey && kpis[it.badgeKey] > 0 ? el('span', { class: 'nav-badge' }, String(kpis[it.badgeKey])) : null;
      const item = el('a', {
        class: 'nav-item' + (active === it.key ? ' active' : ''),
        onclick: () => navigate(it.key),
      },
        el('span', { html: icon(it.icon) }),
        el('span', {}, it.label),
        badge
      );
      nav.appendChild(item);
    });
  });
  sidebar.appendChild(nav);

  const foot = el('div', { class: 'user-foot' },
    el('div', { class: 'user-av' }, initials(user.name)),
    el('div', {},
      el('div', { class: 'user-name' }, user.name),
      el('div', { class: 'user-role' }, Store.roleLabel(Store.currentRole() ?? user.role ?? 'owner'))
    ),
    el('button', {
      title: 'Cerrar sesión',
      onclick: () => { if (confirm('¿Cerrar sesión?')) { Store.logout(); navigate('login'); } }
    }, el('span', { html: icon('logout', 16, 2) }))
  );
  sidebar.appendChild(foot);
  app.appendChild(sidebar);

  /* ----- MAIN ----- */
  const main = el('main', { class: 'main' });

  const topbar = el('header', { class: 'topbar' },
    el('div', {},
      el('div', { class: 'page-title' }, title),
      el('div', { class: 'page-sub' },
        el('span', { class: 'live-dot' }), subtitle || biz.address || biz.name
      )
    ),
    el('div', { class: 'topbar-right' },
      el('label', { class: 'search' },
        el('span', { html: icon('search', 15, 2) }),
        el('input', { placeholder: 'Buscar…' })
      ),
      ...(actions || [])
    )
  );
  main.appendChild(topbar);

  const contentEl = el('div', { class: 'content' });
  if (typeof content === 'string') contentEl.innerHTML = content;
  else contentEl.appendChild(content);
  main.appendChild(contentEl);

  app.appendChild(main);
}

function openBizSelector() {
  const user = Store.currentUser();
  const bizs = Store.userBusinesses();
  const active = Store.activeBusiness();

  const list = el('div', { class: 'biz-list' });
  bizs.forEach((b) => {
    list.appendChild(el('div', {
      class: 'biz-item' + (b.id === active.id ? ' active' : ''),
      onclick: () => { Store.setActiveBusiness(b.id); close(); navigate('dashboard'); toast('Negocio: ' + b.name); }
    },
      el('div', { class: 'biz-avatar', style: `background:${b.color}` }, initials(b.name)),
      el('div', { style: 'flex:1;min-width:0' },
        el('div', { style: 'font-weight:600;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis' }, b.name),
        el('div', { style: 'font-size:11.5px;color:var(--text3)' }, (b.address || 'Sin dirección') + ' · ' + b.plan)
      ),
      b.id === active.id ? el('span', { html: icon('check', 18, 2.4), style: 'color:var(--greenD)' }) : null
    ));
  });

  list.appendChild(el('button', {
    class: 'btn btn-ghost', style: 'margin-top:8px;width:100%',
    onclick: () => { close(); openCreateBizModal(); }
  }, el('span', { html: icon('plus', 15, 2.4) }), 'Agregar nuevo negocio'));
}

function openCreateBizModal() {
  const form = el('form', {
    onsubmit: (e) => {
      e.preventDefault();
      const name = new FormData(form).get('name');
      try {
        Store.createBusinessForCurrentUser({ name });
        close();
        toast('Negocio creado');
        navigate('dashboard');
      } catch (err) { toast(err.message, 'err'); }
    }
  },
    el('div', { class: 'field' }, el('label', {}, 'Nombre del negocio'),
      el('input', { name: 'name', required: true, placeholder: 'Ej. Boutique Norte' }))
  );
  const cancelBtn = el('button', { class: 'btn btn-ghost', type: 'button', onclick: () => close() }, 'Cancelar');
  const submitBtn = el('button', { class: 'btn btn-primary', type: 'submit', form: 'x' }, 'Crear negocio');
  const { close, footEl } = openModal({ title: 'Nuevo negocio', body: form });
  footEl.append(cancelBtn, submitBtn);
}

/* ============================================================
   VIEW: DASHBOARD
   ============================================================ */
function renderDashboard() {
  const k = Store.kpis();
  const biz = Store.activeBusiness();
  const content = el('div', { style: 'display:flex;flex-direction:column;gap:18px' });
  const kpiGrid = el('div', { class: 'kpi-grid' },
    kpiCard('dollar', 'green', 'Ingresos hoy', money(k.revenueToday, biz.currency), '▲ ' + k.salesTodayCount + ' ventas', 'up', 'Hoy'),
    kpiCard('box', 'blue', 'Productos activos', String(k.activeProducts), '+0', 'up', 'Este mes'),
    kpiCard('alert', 'amber', 'Stock bajo', String(k.lowStock), k.lowStock > 0 ? 'Requiere atención' : 'Todo ok', k.lowStock > 0 ? 'warn' : 'up'),
    kpiCard('wa', 'green', 'Ventas WhatsApp', k.waPct + '%', k.waCount + ' de ' + k.salesTodayCount, 'up', 'ventas hoy')
  );
  content.appendChild(kpiGrid);
  content.appendChild(chartCard());
  const grid = el('div', { class: 'grid-2' });
  grid.appendChild(stockAlertsCard());
  grid.appendChild(recentSalesCard());
  content.appendChild(grid);
  shell({
    title: 'Dashboard',
    subtitle: biz.address || biz.name,
    actions: [Store.can('sales:write') ? el('button', { class: 'btn btn-dark btn-sm', onclick: openNewSaleModal },
      el('span', { html: icon('plus', 15, 2.4) }), 'Nueva venta') : null].filter(Boolean),
    content
  });
}

function kpiCard(iconName, color, label, value, deltaTxt, deltaType, note) {
  const deltaCls = deltaType === 'down' ? 'down' : deltaType === 'warn' ? 'warn' : 'up';
  return el('div', { class: 'kpi' },
    el('div', { class: 'kpi-top' },
      el('div', { class: 'kpi-icon ' + color }, el('span', { html: icon(iconName, 17, 2.2) }))
    ),
    el('div', { class: 'kpi-label' }, label),
    el('div', { class: 'kpi-value' }, value),
    el('div', { class: 'kpi-foot' },
      deltaTxt ? el('span', { class: 'delta ' + deltaCls }, deltaTxt) : null,
      note ? el('span', {}, note) : null
    )
  );
}

function chartCard() {
  const data = Store.chartData(7);
  const biz = Store.activeBusiness();
  const total = data.reduce((s, d) => s + d.value, 0);
  const max = Math.max(...data.map((d) => d.value), 500);
  const chartMax = Math.ceil(max / 500) * 500;
  const steps = [chartMax, chartMax * .75, chartMax * .5, chartMax * .25, 0].map((v) => Math.round(v));
  const card = el('div', { class: 'card' });
  card.appendChild(el('div', { class: 'card-head' },
    el('div', {},
      el('div', { class: 'card-title' }, 'Ventas — Últimos 7 días'),
      el('div', { class: 'card-sub' }, biz.name)
    ),
    el('div', { class: 'card-actions' }, el('div', { class: 'chips' },
      el('button', { class: 'chip active' }, '7D'),
      el('button', { class: 'chip' }, '30D')
    ))
  ));
  card.appendChild(el('div', { style: 'padding:10px 20px 0;display:flex;align-items:baseline;gap:8px' },
    el('strong', { style: 'font-size:22px;font-weight:700;letter-spacing:-.02em' }, money(total, biz.currency)),
    el('span', { class: 'delta up' }, '▲ 8.2%')
  ));

  const chartWrap = el('div', { class: 'chart-wrap' });
  const chart = el('div', { class: 'chart' });
  const yAxis = el('div', { class: 'chart-y' });
  steps.forEach((v) => {
    const top = (1 - v / chartMax) * 100;
    yAxis.appendChild(el('span', { style: `top:${top}%` }, v === 0 ? '0' : (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : String(v))));
  });
  chart.appendChild(yAxis);

  const main = el('div', { class: 'chart-main' });
  const plot = el('div', { class: 'chart-plot' });
  const gridEl = el('div', { class: 'chart-grid' });
  steps.forEach((v) => gridEl.appendChild(el('span', { style: `top:${(1 - v / chartMax) * 100}%` })));
  plot.appendChild(gridEl);

  const bars = el('div', { class: 'chart-bars' });
  const maxVal = Math.max(...data.map((d) => d.value));
  data.forEach((d, i) => {
    const pct = (d.value / chartMax) * 100;
    const isMax = d.value === maxVal && d.value > 0;
    const col = el('div', { class: 'bar-col' });
    col.appendChild(el('div', {
      class: 'bar' + (isMax ? ' hot' : ''),
      style: `--h:${pct}%;animation-delay:${i * 55}ms`
    }, el('div', { class: 'tip' }, money(d.value, biz.currency))));
    bars.appendChild(col);
  });
  plot.appendChild(bars);
  main.appendChild(plot);
  const xAxis = el('div', { class: 'chart-x' });
  data.forEach((d) => xAxis.appendChild(el('span', { class: d.today ? 'today' : '' }, d.label)));
  main.appendChild(xAxis);
  chart.appendChild(main);
  chartWrap.appendChild(chart);
  card.appendChild(chartWrap);
  return card;
}

function stockAlertsCard() {
  const low = Store.products().filter((p) => p.stock <= p.minStock).slice(0, 5);
  const card = el('div', { class: 'card' });
  card.appendChild(el('div', { class: 'card-head' },
    el('div', {},
      el('div', { class: 'card-title' }, 'Alertas de stock'),
      el('div', { class: 'card-sub' }, low.length + ' productos por reponer')
    ),
    el('div', { class: 'card-actions' }, el('a', { class: 'chip', onclick: () => navigate('inventory') }, 'Ver todo'))
  ));
  const list = el('div', { class: 'stock-list' });
  if (!low.length) {
    list.appendChild(el('div', { class: 'empty' }, 'Sin alertas de stock'));
  } else {
    low.forEach((p) => {
      const pct = Math.min(100, (p.stock / p.minStock) * 100);
      const isOut = p.stock === 0;
      const barColor = isOut ? 'var(--red)' : pct < 70 ? 'var(--amber)' : 'var(--green)';
      list.appendChild(el('div', { class: 'stock-item' },
        el('div', { class: 'thumb', style: `background:${p.color}` }, initials(p.name)),
        el('div', { class: 'stock-info' },
          el('div', { class: 'stock-name' }, p.name),
          el('div', { class: 'stock-meta' }, p.sku + ' · mín. ' + p.minStock + ' u.')
        ),
        el('div', { class: 'stock-bar' }, el('i', { style: `width:${pct}%;background:${barColor}` })),
        el('div', { class: 'stock-right' },
          el('span', { class: 'badge ' + (isOut ? 'out' : 'low') }, isOut ? 'Agotado' : 'Bajo'),
          el('div', { style: 'font-size:11.5px;color:var(--text2);font-weight:600' }, p.stock + '/' + p.minStock)
        )
      ));
    });
  }
  card.appendChild(list);
  return card;
}

function recentSalesCard() {
  const sales = Store.sales().slice(0, 5);
  const biz = Store.activeBusiness();
  const card = el('div', { class: 'card' });
  card.appendChild(el('div', { class: 'card-head' },
    el('div', {},
      el('div', { class: 'card-title' }, 'Ventas recientes'),
      el('div', { class: 'card-sub' }, 'Últimas ' + sales.length + ' transacciones')
    ),
    el('div', { class: 'card-actions' }, el('a', { class: 'chip', onclick: () => navigate('sales') }, 'Ver todo'))
  ));
  const wrap = el('div', { class: 'table-wrap' });
  if (!sales.length) {
    wrap.appendChild(el('div', { class: 'empty' }, 'Sin ventas aún'));
  } else {
    const table = el('table');
    table.innerHTML = `<thead><tr><th>Pedido</th><th>Cliente</th><th>Canal</th><th>Productos</th><th>Total</th><th>Estado</th><th>Fecha</th></tr></thead>`;
    const tbody = el('tbody');
    const chMap = { wa: { lbl: 'WhatsApp', ic: 'wa', cls: 'wa' }, pos: { lbl: 'POS', ic: 'card', cls: 'pos' }, web: { lbl: 'Web', ic: 'globe', cls: 'web' } };
    const stMap = { ok: { lbl: 'Entregado', cls: 'ok' }, conf: { lbl: 'Confirmado', cls: 'conf' }, pend: { lbl: 'Pendiente', cls: 'pend' } };
    sales.forEach((s) => {
      const ch = chMap[s.channel];
      const st = stMap[s.status];
      const count = s.items.reduce((n, it) => n + it.qty, 0);
      const tr = el('tr');
      tr.innerHTML = `
        <td class="order-id">#${s.orderId}</td>
        <td><div class="cust"><div class="cust-av" style="background:linear-gradient(135deg,#6366F1,#8B5CF6)">${initials(s.customerName)}</div><div class="cust-name">${s.customerName}</div></div></td>
        <td><span class="chan ${ch.cls}">${icon(ch.ic, 12, 2.2)}${ch.lbl}</span></td>
        <td style="color:var(--text2)">${count} ${count === 1 ? 'artículo' : 'artículos'}</td>
        <td class="amount">${money(s.total, biz.currency)}</td>
        <td><span class="status ${st.cls}"><i></i>${st.lbl}</span></td>
        <td class="date">${fmtDate(s.date)}</td>`;
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
  }
  card.appendChild(wrap);
  return card;
}

/* ============================================================
   VIEW: VENTAS
   ============================================================ */
function renderSales() {
  const biz = Store.activeBusiness();
  const all = Store.sales();
  let filter = 'all';
  const content = el('div');
  const card = el('div', { class: 'card' });
  card.appendChild(el('div', { class: 'card-head', style: 'flex-wrap:wrap;gap:10px' },
    el('div', {},
      el('div', { class: 'card-title' }, 'Todas las ventas'),
      el('div', { class: 'card-sub' }, all.length + ' transacciones')
    ),
    el('div', { class: 'card-actions' },
      el('div', { class: 'chips', id: 'sales-chips' },
        chip('all', 'Todos', true), chip('wa', 'WhatsApp'), chip('pos', 'POS'), chip('web', 'Web'), chip('pend', 'Pendientes')
      )
    )
  ));
  const wrap = el('div', { class: 'table-wrap', id: 'sales-table-wrap' });
  card.appendChild(wrap);
  content.appendChild(card);

  function paint() {
    let rows = all;
    if (filter === 'pend') rows = all.filter((s) => s.status === 'pend');
    else if (filter !== 'all') rows = all.filter((s) => s.channel === filter);
    wrap.innerHTML = '';
    if (!rows.length) { wrap.appendChild(el('div', { class: 'empty' }, 'Sin ventas para este filtro')); return; }
    const table = el('table');
    table.innerHTML = `<thead><tr><th>Pedido</th><th>Cliente</th><th>Canal</th><th>Productos</th><th>Total</th><th>Estado</th><th>Fecha</th><th></th></tr></thead>`;
    const tbody = el('tbody');
    const chMap = { wa: { lbl: 'WhatsApp', ic: 'wa', cls: 'wa' }, pos: { lbl: 'POS', ic: 'card', cls: 'pos' }, web: { lbl: 'Web', ic: 'globe', cls: 'web' } };
    const stMap = { ok: { lbl: 'Entregado', cls: 'ok' }, conf: { lbl: 'Confirmado', cls: 'conf' }, pend: { lbl: 'Pendiente', cls: 'pend' } };
    rows.forEach((s) => {
      const ch = chMap[s.channel];
      const st = stMap[s.status];
      const count = s.items.reduce((n, it) => n + it.qty, 0);
      const tr = el('tr');
      tr.innerHTML = `
        <td class="order-id">#${s.orderId}</td>
        <td><div class="cust"><div class="cust-av" style="background:linear-gradient(135deg,#6366F1,#8B5CF6)">${initials(s.customerName)}</div><div class="cust-name">${s.customerName}</div></div></td>
        <td><span class="chan ${ch.cls}">${icon(ch.ic, 12, 2.2)}${ch.lbl}</span></td>
        <td style="color:var(--text2);max-width:200px;overflow:hidden;text-overflow:ellipsis">${s.items.map((it) => it.qty + '× ' + it.name).join(', ')}</td>
        <td class="amount">${money(s.total, biz.currency)}</td>
        <td><span class="status ${st.cls}"><i></i>${st.lbl}</span></td>
        <td class="date">${fmtDate(s.date)}</td>
        <td><button class="btn btn-ghost btn-sm" data-id="${s.id}">Estado</button></td>`;
      tr.querySelector('button').addEventListener('click', () => changeStatus(s));
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
  }

  function changeStatus(s) {
    const opts = [['ok', 'Entregado'], ['conf', 'Confirmado'], ['pend', 'Pendiente']];
    const list = el('div', { class: 'biz-list' });
    opts.forEach(([k, lbl]) => {
      list.appendChild(el('div', {
        class: 'biz-item' + (s.status === k ? ' active' : ''),
        onclick: () => { Store.updateSaleStatus(s.id, k); close(); toast('Estado actualizado'); paint(); }
      }, el('span', { style: 'font-weight:600' }, lbl)));
    });
    const { close } = openModal({ title: 'Cambiar estado · #' + s.orderId, body: list });
  }

  setTimeout(() => {
    $$('#sales-chips .chip').forEach((c) => {
      c.addEventListener('click', () => {
        $$('#sales-chips .chip').forEach((x) => x.classList.remove('active'));
        c.classList.add('active');
        filter = c.dataset.filter;
        paint();
      });
    });
  });
  paint();

  shell({
    title: 'Ventas',
    subtitle: all.length + ' transacciones',
    actions: [Store.can('sales:write') ? el('button', { class: 'btn btn-dark btn-sm', onclick: openNewSaleModal },
      el('span', { html: icon('plus', 15, 2.4) }), 'Nueva venta') : null].filter(Boolean),
    content
  });
}

function chip(filter, label, active = false) {
  return el('button', { class: 'chip' + (active ? ' active' : ''), 'data-filter': filter }, label);
}

/* ============================================================
   MODAL: Nueva venta
   ============================================================ */
function openNewSaleModal() {
  const biz = Store.activeBusiness();
  const products = Store.products();
  const customers = Store.customers();
  if (!products.length) { toast('Primero crea productos', 'err'); return; }
  let items = [];
  const wrap = el('div');
  wrap.appendChild(el('div', { class: 'field' }, el('label', {}, 'Cliente'),
    el('select', { id: 'ns-cust' },
      el('option', { value: '' }, '— Venta sin cliente —'),
      customers.map((c) => el('option', { value: c.id }, c.name + ' · ' + c.phone))
    )
  ));
  wrap.appendChild(el('div', { class: 'field' }, el('label', {}, 'Canal'),
    el('select', { id: 'ns-chan' },
      el('option', { value: 'wa' }, 'WhatsApp'),
      el('option', { value: 'pos' }, 'POS (tienda)'),
      el('option', { value: 'web' }, 'Web')
    )
  ));
  wrap.appendChild(el('div', { class: 'field' }, el('label', {}, 'Producto'),
    el('select', { id: 'ns-prod' },
      products.map((p) => el('option', { value: p.id }, p.name + ' · ' + money(p.price, biz.currency) + ' · stock ' + p.stock))
    )
  ));
  wrap.appendChild(el('div', { class: 'field-row' },
    el('div', { class: 'field' }, el('label', {}, 'Cantidad'),
      el('input', { id: 'ns-qty', type: 'number', min: 1, value: 1 })),
    el('div', { class: 'field', style: 'display:flex;align-items:flex-end' },
      el('button', { class: 'btn btn-ghost', id: 'ns-add', type: 'button', style: 'width:100%' },
        el('span', { html: icon('plus', 15, 2.4) }), 'Agregar'))
  ));
  const list = el('div', { id: 'ns-list', style: 'margin-top:8px;border-top:1px solid var(--border);padding-top:10px' });
  wrap.appendChild(list);
  const totalRow = el('div', { style: 'display:flex;justify-content:space-between;font-weight:700;font-size:15px;margin-top:14px;padding-top:12px;border-top:1px solid var(--border)' },
    el('span', {}, 'Total'),
    el('span', { id: 'ns-total' }, money(0, biz.currency))
  );
  wrap.appendChild(totalRow);

  function paint() {
    list.innerHTML = '';
    if (!items.length) {
      list.appendChild(el('div', { style: 'color:var(--text3);font-size:12.5px;text-align:center;padding:8px' }, 'Sin productos agregados'));
    } else {
      items.forEach((it, idx) => {
        list.appendChild(el('div', { style: 'display:flex;align-items:center;justify-content:space-between;padding:6px 0;font-size:13px' },
          el('span', {}, it.qty + '× ' + it.name),
          el('span', { style: 'display:flex;align-items:center;gap:10px' },
            el('strong', {}, money(it.price * it.qty, biz.currency)),
            el('button', { class: 'btn btn-ghost btn-sm', onclick: () => { items.splice(idx, 1); paint(); } },
              el('span', { html: icon('close', 12, 2.4) }))
          )
        ));
      });
    }
    const total = items.reduce((s, it) => s + it.price * it.qty, 0);
    $('#ns-total').textContent = money(total, biz.currency);
  }
  function add() {
    const pid = $('#ns-prod').value;
    const qty = +$('#ns-qty').value;
    const p = products.find((x) => x.id === pid);
    if (!p || qty < 1) return;
    if (qty > p.stock) { toast('Stock insuficiente (' + p.stock + ')', 'err'); return; }
    items.push({ productId: p.id, name: p.name, qty, price: p.price });
    paint();
  }
  const { close, footEl } = openModal({ title: 'Nueva venta', body: wrap });
  const cancel = el('button', { class: 'btn btn-ghost', onclick: () => close() }, 'Cancelar');
  const save = el('button', { class: 'btn btn-primary', onclick: () => {
    if (!items.length) { toast('Agrega al menos un producto', 'err'); return; }
    const custId = $('#ns-cust').value;
    const cust = customers.find((c) => c.id === custId);
    Store.createSale({
      customerId: custId || null,
      customerName: cust ? cust.name : 'Cliente mostrador',
      channel: $('#ns-chan').value,
      items,
    });
    close();
    toast('Venta registrada');
    render();
  }}, 'Registrar venta');
  footEl.append(cancel, save);
  setTimeout(() => {
    $('#ns-add').addEventListener('click', add);
    paint();
  });
}

/* ============================================================
   VIEW: PRODUCTOS
   ============================================================ */
function renderProducts() {
  const biz = Store.activeBusiness();
  const products = Store.products();
  const content = el('div');
  const card = el('div', { class: 'card' });
  card.appendChild(el('div', { class: 'card-head' },
    el('div', {},
      el('div', { class: 'card-title' }, 'Catálogo de productos'),
      el('div', { class: 'card-sub' }, products.length + ' productos')
    )
  ));
  const wrap = el('div', { class: 'table-wrap' });
  if (!products.length) {
    wrap.appendChild(el('div', { class: 'empty' }, 'Aún no hay productos. Crea el primero.'));
  } else {
    const table = el('table');
    table.innerHTML = `<thead><tr><th>Producto</th><th>SKU</th><th>Categoría</th><th>Precio</th><th>Costo</th><th>Stock</th><th></th></tr></thead>`;
    const tbody = el('tbody');
    products.forEach((p) => {
      const low = p.stock <= p.minStock;
      const tr = el('tr');
      tr.innerHTML = `
        <td><div class="cust"><div class="cust-av" style="background:${p.color}">${initials(p.name)}</div><div class="cust-name">${p.name}</div><div class="cust-phone">mín. ${p.minStock} u.</div></div></td>
        <td style="color:var(--text2);font-family:ui-monospace,monospace;font-size:12px">${p.sku}</td>
        <td><span class="chan" style="background:#F1F5F9;color:var(--text2)">${p.category}</span></td>
        <td class="amount">${money(p.price, biz.currency)}</td>
        <td style="color:var(--text2)">${money(p.cost, biz.currency)}</td>
        <td><span class="status ${low ? 'pend' : 'ok'}"><i></i>${p.stock}</span></td>
        <td><button class="btn btn-ghost btn-sm" data-act="edit">${icon('edit', 12, 2.2)}</button><button class="btn btn-ghost btn-sm" data-act="del" style="color:var(--red)">${icon('trash', 12, 2.2)}</button></td>`;
      tr.querySelector('[data-act="edit"]').addEventListener('click', () => openProductModal(p));
      tr.querySelector('[data-act="del"]').addEventListener('click', () => {
        if (confirm('¿Eliminar "' + p.name + '"?')) { Store.deleteProduct(p.id); toast('Producto eliminado'); render(); }
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
  }
  card.appendChild(wrap);
  content.appendChild(card);
  shell({
    title: 'Productos',
    subtitle: products.length + ' en catálogo',
    actions: [Store.can('products:write') ? el('button', { class: 'btn btn-dark btn-sm', onclick: () => openProductModal() },
      el('span', { html: icon('plus', 15, 2.4) }), 'Nuevo producto') : null].filter(Boolean),
    content
  });
}

function openProductModal(p) {
  const isEdit = !!p;
  const form = el('form', {
    onsubmit: (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      try {
        if (isEdit) Store.updateProduct(p.id, data);
        else Store.createProduct(data);
        close();
        toast(isEdit ? 'Producto actualizado' : 'Producto creado');
        render();
      } catch (err) { toast(err.message, 'err'); }
    }
  });
  form.innerHTML = `
    <div class="field"><label>Nombre</label><input name="name" required value="${isEdit ? p.name : ''}" placeholder="Ej. Polo Oversize Negro"></div>
    <div class="field-row"><div class="field"><label>SKU</label><input name="sku" required value="${isEdit ? p.sku : ''}" placeholder="POL-001"></div><div class="field"><label>Categoría</label><input name="category" value="${isEdit ? p.category : ''}" placeholder="Ropa"></div></div>
    <div class="field-row"><div class="field"><label>Precio venta</label><input name="price" type="number" step="0.01" required value="${isEdit ? p.price : ''}" placeholder="0"></div><div class="field"><label>Costo</label><input name="cost" type="number" step="0.01" value="${isEdit ? p.cost : ''}" placeholder="0"></div></div>
    <div class="field-row"><div class="field"><label>Stock actual</label><input name="stock" type="number" required value="${isEdit ? p.stock : '0'}"></div><div class="field"><label>Stock mínimo</label><input name="minStock" type="number" required value="${isEdit ? p.minStock : '5'}"></div></div>
  `;
  const { close, footEl } = openModal({ title: isEdit ? 'Editar producto' : 'Nuevo producto', body: form });
  const cancel = el('button', { class: 'btn btn-ghost', type: 'button', onclick: () => close() }, 'Cancelar');
  const save = el('button', { class: 'btn btn-primary', type: 'submit', onclick: () => form.requestSubmit() }, isEdit ? 'Guardar' : 'Crear');
  footEl.append(cancel, save);
}

/* ============================================================
   VIEW: INVENTARIO
   ============================================================ */
function renderInventory() {
  const biz = Store.activeBusiness();
  const products = Store.products();
  const low = products.filter((p) => p.stock <= p.minStock);
  const out = products.filter((p) => p.stock === 0);
  const totalValue = products.reduce((s, p) => s + p.stock * p.cost, 0);
  const content = el('div', { style: 'display:flex;flex-direction:column;gap:18px' });
  content.appendChild(el('div', { class: 'kpi-grid', style: 'grid-template-columns:repeat(4,1fr)' },
    kpiCard('box', 'blue', 'SKUs totales', String(products.length), '', 'up', ''),
    kpiCard('alert', 'amber', 'Stock bajo', String(low.length), low.length ? 'Reponer' : 'Ok', low.length ? 'warn' : 'up'),
    kpiCard('alert', 'red', 'Agotados', String(out.length), out.length ? 'Urgente' : 'Ok', out.length ? 'down' : 'up'),
    kpiCard('dollar', 'green', 'Valor inventario', money(totalValue, biz.currency), '', 'up', 'a costo')
  ));
  const card = el('div', { class: 'card' });
  card.appendChild(el('div', { class: 'card-head' },
    el('div', {},
      el('div', { class: 'card-title' }, 'Ajuste de inventario'),
      el('div', { class: 'card-sub' }, 'Modifica stock rápidamente con +/–')
    )
  ));
  const wrap = el('div', { class: 'table-wrap' });
  const table = el('table');
  table.innerHTML = `<thead><tr><th>Producto</th><th>SKU</th><th>Actual</th><th>Mínimo</th><th>Estado</th><th style="text-align:right">Ajustar</th></tr></thead>`;
  const tbody = el('tbody');
  products.forEach((p) => {
    const isOut = p.stock === 0;
    const isLow = p.stock <= p.minStock;
    const tr = el('tr');
    tr.innerHTML = `
      <td><div class="cust"><div class="cust-av" style="background:${p.color}">${initials(p.name)}</div><div class="cust-name">${p.name}</div></div></td>
      <td style="color:var(--text2);font-family:ui-monospace,monospace;font-size:12px">${p.sku}</td>
      <td><strong style="font-size:15px">${p.stock}</strong></td>
      <td style="color:var(--text2)">${p.minStock}</td>
      <td><span class="badge ${isOut ? 'out' : isLow ? 'low' : 'ok'}">${isOut ? 'Agotado' : isLow ? 'Bajo' : 'OK'}</span></td>
      <td style="text-align:right;white-space:nowrap">
        <button class="btn btn-ghost btn-sm" data-op="-1">−</button>
        <button class="btn btn-ghost btn-sm" data-op="1">+</button>
        <button class="btn btn-ghost btn-sm" data-op="set">=</button>
      </td>`;
    tr.querySelectorAll('[data-op]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const op = btn.dataset.op;
        if (op === 'set') {
          const v = prompt('Nuevo stock para ' + p.name, p.stock);
          if (v != null) Store.updateProduct(p.id, { stock: Math.max(0, +v || 0) });
        } else {
          Store.updateProduct(p.id, { stock: Math.max(0, p.stock + +op) });
        }
        render();
      });
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  card.appendChild(wrap);
  content.appendChild(card);
  shell({ title: 'Inventario', subtitle: 'Gestión de stock', content });
}

/* ============================================================
   VIEW: CLIENTES
   ============================================================ */
function renderCustomers() {
  const biz = Store.activeBusiness();
  const customers = Store.customers();
  const sales = Store.sales();
  const content = el('div');
  const card = el('div', { class: 'card' });
  card.appendChild(el('div', { class: 'card-head' },
    el('div', {},
      el('div', { class: 'card-title' }, 'Clientes'),
      el('div', { class: 'card-sub' }, customers.length + ' registrados')
    )
  ));
  const wrap = el('div', { class: 'table-wrap' });
  if (!customers.length) {
    wrap.appendChild(el('div', { class: 'empty' }, 'Sin clientes registrados'));
  } else {
    const table = el('table');
    table.innerHTML = `<thead><tr><th>Cliente</th><th>Teléfono</th><th>Email</th><th>Compras</th><th>Total gastado</th></tr></thead>`;
    const tbody = el('tbody');
    customers.forEach((c) => {
      const cSales = sales.filter((s) => s.customerId === c.id);
      const total = cSales.reduce((sum, s) => sum + s.total, 0);
      const tr = el('tr');
      tr.innerHTML = `
        <td><div class="cust"><div class="cust-av" style="background:linear-gradient(135deg,#6366F1,#8B5CF6)">${initials(c.name)}</div><div class="cust-name">${c.name}</div></div></td>
        <td style="color:var(--text2)">${c.phone || '—'}</td>
        <td style="color:var(--text2)">${c.email || '—'}</td>
        <td><strong>${cSales.length}</strong></td>
        <td class="amount">${money(total, biz.currency)}</td>`;
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
  }
  card.appendChild(wrap);
  content.appendChild(card);
  shell({
    title: 'Clientes',
    subtitle: customers.length + ' registrados',
    actions: [Store.can('customers:write') ? el('button', { class: 'btn btn-dark btn-sm', onclick: openNewCustomerModal },
      el('span', { html: icon('plus', 15, 2.4) }), 'Nuevo cliente') : null].filter(Boolean),
    content
  });
}

function openNewCustomerModal() {
  const form = el('form', {
    onsubmit: (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      Store.createCustomer(data);
      close();
      toast('Cliente creado');
      render();
    }
  });
  form.innerHTML = `
    <div class="field"><label>Nombre</label><input name="name" required placeholder="Ej. María González"></div>
    <div class="field"><label>Teléfono</label><input name="phone" placeholder="+51 987 654 321"></div>
    <div class="field"><label>Email</label><input name="email" type="email" placeholder="cliente@mail.com"></div>
  `;
  const { close, footEl } = openModal({ title: 'Nuevo cliente', body: form });
  footEl.append(
    el('button', { class: 'btn btn-ghost', onclick: () => close() }, 'Cancelar'),
    el('button', { class: 'btn btn-primary', onclick: () => form.requestSubmit() }, 'Crear')
  );
}

/* ============================================================
   VIEW: REPORTES
   ============================================================ */
function renderReports() {
  const biz = Store.activeBusiness();
  const sales = Store.sales();
  const byChannel = { wa: 0, pos: 0, web: 0 };
  sales.forEach((s) => { byChannel[s.channel] = (byChannel[s.channel] || 0) + s.total; });
  const totalByChannel = Object.values(byChannel).reduce((a, b) => a + b, 0) || 1;
  const prodCount = {};
  sales.forEach((s) => s.items.forEach((it) => { prodCount[it.name] = (prodCount[it.name] || 0) + it.qty * it.price; }));
  const topProds = Object.entries(prodCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxProd = topProds[0]?.[1] || 1;
  const content = el('div', { style: 'display:flex;flex-direction:column;gap:18px' });
  const total7 = Store.totalRevenue(7);
  content.appendChild(el('div', { class: 'kpi-grid', style: 'grid-template-columns:repeat(3,1fr)' },
    kpiCard('dollar', 'green', 'Ingresos 7 días', money(total7, biz.currency), '', 'up'),
    kpiCard('cart', 'blue', 'Ventas totales', String(sales.length), '', 'up'),
    kpiCard('dollar', 'amber', 'Ticket promedio', money(sales.length ? total7 / Math.min(sales.length, 7) : 0, biz.currency), '', 'up')
  ));
  const chCard = el('div', { class: 'card' });
  chCard.appendChild(el('div', { class: 'card-head' },
    el('div', {}, el('div', { class: 'card-title' }, 'Ventas por canal'), el('div', { class: 'card-sub' }, 'Distribución de ingresos'))
  ));
  const chBody = el('div', { style: 'padding:18px 20px' });
  const CH = { wa: { lbl: 'WhatsApp', color: 'var(--green)' }, pos: { lbl: 'POS', color: 'var(--violet)' }, web: { lbl: 'Web', color: 'var(--blue)' } };
  Object.entries(byChannel).forEach(([k, v]) => {
    const pct = Math.round((v / totalByChannel) * 100);
    chBody.appendChild(el('div', { style: 'margin-bottom:14px' },
      el('div', { style: 'display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px' },
        el('span', { style: 'font-weight:600' }, CH[k].lbl),
        el('span', { style: 'color:var(--text2)' }, money(v, biz.currency) + ' · ' + pct + '%')
      ),
      el('div', { style: 'height:8px;background:#EEF2F6;border-radius:99px;overflow:hidden' },
        el('div', { style: `height:100%;width:${pct}%;background:${CH[k].color};border-radius:99px` })
      )
    ));
  });
  chCard.appendChild(chBody);
  content.appendChild(chCard);
  const topCard = el('div', { class: 'card' });
  topCard.appendChild(el('div', { class: 'card-head' },
    el('div', {}, el('div', { class: 'card-title' }, 'Top productos'), el('div', { class: 'card-sub' }, 'Por ingresos generados'))
  ));
  const topBody = el('div', { style: 'padding:18px 20px' });
  if (!topProds.length) topBody.appendChild(el('div', { class: 'empty' }, 'Sin ventas aún'));
  else topProds.forEach(([name, val], i) => {
    const pct = Math.round((val / maxProd) * 100);
    topBody.appendChild(el('div', { style: 'margin-bottom:14px' },
      el('div', { style: 'display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px' },
        el('span', { style: 'font-weight:600' }, (i + 1) + '. ' + name),
        el('span', { style: 'color:var(--text2)' }, money(val, biz.currency))
      ),
      el('div', { style: 'height:8px;background:#EEF2F6;border-radius:99px;overflow:hidden' },
        el('div', { style: `height:100%;width:${pct}%;background:var(--green);border-radius:99px` })
      )
    ));
  });
  topCard.appendChild(topBody);
  content.appendChild(topCard);
  shell({ title: 'Reportes', subtitle: 'Análisis de rendimiento', content });
}

/* ============================================================
   VIEW: CONFIGURACIÓN
   ============================================================ */
function renderSettings() {
  const biz = Store.activeBusiness();
  const user = Store.currentUser();
  const content = el('div', { style: 'display:grid;gap:18px;grid-template-columns:1fr 1fr' });
  const bizForm = el('form', {
    class: 'card', style: 'padding:22px',
    onsubmit: (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(bizForm).entries());
      Store.updateBusiness(biz.id, data);
      toast('Negocio actualizado');
      render();
    }
  });
  bizForm.innerHTML = `
    <div class="card-title" style="margin-bottom:4px">Datos del negocio</div>
    <div class="card-sub" style="margin-bottom:16px">Esta información aparece en el panel.</div>
    <div class="field"><label>Nombre</label><input name="name" value="${biz.name}" required></div>
    <div class="field"><label>Dirección</label><input name="address" value="${biz.address || ''}"></div>
    <div class="field-row"><div class="field"><label>Teléfono</label><input name="phone" value="${biz.phone || ''}"></div><div class="field"><label>Moneda</label><select name="currency"><option value="PEN"${biz.currency === 'PEN' ? ' selected' : ''}>Soles (PEN)</option><option value="USD"${biz.currency === 'USD' ? ' selected' : ''}>Dólares (USD)</option></select></div></div>
    <button class="btn btn-primary" type="submit" style="margin-top:6px">Guardar cambios</button>
  `;
  content.appendChild(bizForm);
  const accCard = el('div', { class: 'card', style: 'padding:22px' });
  accCard.innerHTML = `
    <div class="card-title" style="margin-bottom:4px">Tu cuenta</div>
    <div class="card-sub" style="margin-bottom:16px">Información del usuario actual.</div>
    <div class="field"><label>Nombre</label><input value="${user.name}" disabled></div>
    <div class="field"><label>Email</label><input value="${user.email}" disabled></div>
    <div class="field"><label>Rol</label><input value="${Store.roleLabel(Store.currentRole() ?? user.role ?? 'owner')}" disabled style="text-transform:capitalize"></div>
    <div class="field"><label>Negocios accesibles</label><input value="${user.businessIds.length}" disabled></div>
  `;
  content.appendChild(accCard);
  const danger = el('div', { class: 'card', style: 'padding:22px;grid-column:1/-1;border-color:var(--redBg)' });
  danger.innerHTML = '<div class="card-title" style="color:var(--red);margin-bottom:4px">Zona peligrosa</div><div class="card-sub" style="margin-bottom:16px">Estas acciones no se pueden deshacer.</div>';
  danger.appendChild(el('button', { class: 'btn btn-danger', onclick: () => { if (confirm('¿Reiniciar TODOS los datos de demostración?')) { Store.reset(); toast('Datos reiniciados'); navigate('login'); } } }, 'Reiniciar datos de demo'));
  danger.appendChild(el('button', { class: 'btn btn-ghost', style: 'margin-left:10px', onclick: () => { const data = JSON.stringify(Store.state, null, 2); const blob = new Blob([data], { type: 'application/json' }); const a = el('a', { href: URL.createObjectURL(blob), download: 'multibiz-export.json' }); document.body.appendChild(a); a.click(); a.remove(); toast('Backup exportado'); } }, 'Exportar backup'));
  content.appendChild(danger);
  shell({ title: 'Configuración', subtitle: 'Ajustes de tu negocio y cuenta', content });
}

/* ============================================================
   BOOTSTRAP
   ============================================================ */
Store.init();
window.addEventListener('hashchange', render);
window.addEventListener('load', () => {
  if (!location.hash) location.hash = '#/';
  render();
});