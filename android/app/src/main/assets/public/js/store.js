/* ============================================================
   MULTIBIZ · Capa de datos
   Actualmente usa localStorage. Para producción, reemplaza
   cada método por una llamada fetch() a tu API o Supabase.
   ============================================================ */

const LS_KEY = 'multibiz_v1';

const uid = (p = 'id') => p + '_' + Math.random().toString(36).slice(2, 10);
const nowISO = () => new Date().toISOString();

/* Demo-only hash. ¡Reemplazar por bcrypt en backend real! */
function hash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) + str.charCodeAt(i);
  return 'h' + (h >>> 0).toString(36);
}

/* ---------------- SEED ---------------- */
function seed() {
  const bizA = {
    id: 'bz_urbano',
    name: 'Urbano Moda & Calzado',
    slug: 'urbano',
    address: 'Av. Larco 1240, Miraflores, Lima',
    phone: '+51 987 654 321',
    currency: 'PEN',
    color: '#10B981',
    plan: 'pro',
    createdAt: nowISO(),
  };
  const bizB = {
    id: 'bz_cafe',
    name: 'Café Andino',
    slug: 'cafe-andino',
    address: 'Jr. de la Unión 456, Cercado de Lima',
    phone: '+51 912 345 678',
    currency: 'PEN',
    color: '#D97706',
    plan: 'basic',
    createdAt: nowISO(),
  };

  const users = [
    { id: 'u_admin', name: 'Sofía Reyes',  email: 'admin@multibiz.pe',  pass: hash('admin123'),  businessIds: ['bz_urbano', 'bz_cafe'], role: 'superadmin' },
    { id: 'u_maria', name: 'María Ríos',   email: 'maria@urbano.pe',   pass: hash('urbano123'), businessIds: ['bz_urbano'],            role: 'owner' },
    { id: 'u_carlos',name: 'Carlos Vargas',email: 'carlos@cafe.pe',    pass: hash('cafe123'),   businessIds: ['bz_cafe'],              role: 'owner' },
  ];

  const products = [
    // Urbano
    { id: uid('p'), businessId: bizA.id, name: 'Cartera Crossbody Mini', sku: 'CAR-014', category: 'Accesorios', price: 189, cost: 95,  stock: 3, minStock: 5, color: '#F59E0B' },
    { id: uid('p'), businessId: bizA.id, name: 'Zapatillas Urban Low',   sku: 'ZAP-088', category: 'Calzado',    price: 249, cost: 130, stock: 4, minStock: 5, color: '#EF4444' },
    { id: uid('p'), businessId: bizA.id, name: 'Polo Oversize Negro',    sku: 'POL-102', category: 'Ropa',       price: 89,  cost: 42,  stock: 18,minStock: 5, color: '#0F172A' },
    { id: uid('p'), businessId: bizA.id, name: 'Jeans Mom Fit',          sku: 'JEA-045', category: 'Ropa',       price: 159, cost: 78,  stock: 12,minStock: 5, color: '#3B82F6' },
    { id: uid('p'), businessId: bizA.id, name: 'Canguro Beige',          sku: 'CAN-019', category: 'Ropa',       price: 199, cost: 98,  stock: 8, minStock: 5, color: '#A16207' },
    { id: uid('p'), businessId: bizA.id, name: 'Gafas Retro',            sku: 'GAF-007', category: 'Accesorios', price: 129, cost: 55,  stock: 22,minStock: 5, color: '#7C3AED' },
    // Café Andino
    { id: uid('p'), businessId: bizB.id, name: 'Café de especialidad 250g', sku: 'CAF-250', category: 'Café', price: 42, cost: 18, stock: 40, minStock: 10, color: '#78350F' },
    { id: uid('p'), businessId: bizB.id, name: 'Prensa francesa',          sku: 'PRE-001', category: 'Equipos', price: 120, cost: 68, stock: 6, minStock: 3, color: '#0EA5E9' },
    { id: uid('p'), businessId: bizB.id, name: 'Taza cerámica artesanal',   sku: 'TAZ-005', category: 'Merch', price: 55, cost: 22, stock: 2, minStock: 5, color: '#DC2626' },
  ];

  const customers = [
    { id: uid('c'), businessId: bizA.id, name: 'María González', phone: '+51 987 654 321', email: 'maria.g@mail.com' },
    { id: uid('c'), businessId: bizA.id, name: 'Carlos Ruiz',    phone: '+51 912 345 678', email: 'carlos.r@mail.com' },
    { id: uid('c'), businessId: bizA.id, name: 'Ana Torres',     phone: '+51 998 112 233', email: 'ana.t@mail.com' },
    { id: uid('c'), businessId: bizA.id, name: 'Luis Mendoza',   phone: '+51 945 667 889', email: 'luis.m@mail.com' },
    { id: uid('c'), businessId: bizB.id, name: 'Rosa Quispe',    phone: '+51 933 221 100', email: 'rosa.q@mail.com' },
    { id: uid('c'), businessId: bizB.id, name: 'Pedro Salas',    phone: '+51 977 334 220', email: 'pedro.s@mail.com' },
  ];

  const chans = ['wa', 'pos', 'web'];
  const stats = ['ok', 'conf', 'pend'];
  const sales = [];
  // Generar 30 ventas de los últimos 7 días por negocio
  for (let day = 6; day >= 0; day--) {
    const bizsForDay = [bizA, bizB];
    bizsForDay.forEach((biz) => {
      const count = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const bizProducts = products.filter((p) => p.businessId === biz.id);
        const bizCustomers = customers.filter((c) => c.businessId === biz.id);
        const cust = bizCustomers[Math.floor(Math.random() * bizCustomers.length)];
        const prod = bizProducts[Math.floor(Math.random() * bizProducts.length)];
        const qty = 1 + Math.floor(Math.random() * 2);
        const d = new Date();
        d.setDate(d.getDate() - day);
        d.setHours(9 + Math.floor(Math.random() * 11), Math.floor(Math.random() * 60));
        sales.push({
          id: uid('s'),
          businessId: biz.id,
          orderId: 'V-' + String(1000 + sales.length),
          customerId: cust.id,
          customerName: cust.name,
          channel: chans[Math.floor(Math.random() * chans.length)],
          items: [{ productId: prod.id, name: prod.name, qty, price: prod.price }],
          total: prod.price * qty,
          status: stats[Math.floor(Math.random() * stats.length)],
          date: d.toISOString(),
        });
      }
    });
  }

  return { businesses: [bizA, bizB], users, products, customers, sales, session: null };
}

/* ---------------- STORE ---------------- */
const Store = {
  state: null,
  listeners: new Set(),

  init() {
    const raw = localStorage.getItem(LS_KEY);
    this.state = raw ? JSON.parse(raw) : seed();
    if (!raw) this._save();
    return this;
  },

  _save() { localStorage.setItem(LS_KEY, JSON.stringify(this.state)); },

  subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); },
  _emit() { this.listeners.forEach((fn) => fn(this.state)); },

  reset() { localStorage.removeItem(LS_KEY); this.state = seed(); this._save(); this._emit(); },

  /* -------- Auth -------- */
  login(email, password) {
    const user = this.state.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) throw new Error('Usuario no encontrado');
    if (user.pass !== hash(password)) throw new Error('Contraseña incorrecta');
    const activeBusinessId = user.businessIds[0] || null;
    this.state.session = { userId: user.id, activeBusinessId, loginAt: nowISO() };
    this._save(); this._emit();
    return user;
  },

  register({ businessName, userName, email, password }) {
    if (this.state.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Ese correo ya está registrado');
    }
    const bizId = uid('bz');
    const colors = ['#10B981', '#2563EB', '#7C3AED', '#D97706', '#DC2626', '#0EA5E9'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const biz = {
      id: bizId, name: businessName, slug: businessName.toLowerCase().replace(/\s+/g, '-'),
      address: '', phone: '', currency: 'PEN', color, plan: 'trial', createdAt: nowISO(),
    };
    const user = {
      id: uid('u'), name: userName, email: email.toLowerCase(), pass: hash(password),
      businessIds: [bizId], role: 'owner',
    };
    this.state.businesses.push(biz);
    this.state.users.push(user);
    this.state.session = { userId: user.id, activeBusinessId: bizId, loginAt: nowISO() };
    this._save(); this._emit();
    return user;
  },

  logout() { this.state.session = null; this._save(); this._emit(); },

  currentUser() {
    if (!this.state.session) return null;
    return this.state.users.find((u) => u.id === this.state.session.userId) || null;
  },

  setActiveBusiness(id) {
    if (!this.state.session) return;
    this.state.session.activeBusinessId = id;
    this._save(); this._emit();
  },

  activeBusiness() {
    if (!this.state.session) return null;
    return this.state.businesses.find((b) => b.id === this.state.session.activeBusinessId) || null;
  },

  userBusinesses() {
    const u = this.currentUser();
    if (!u) return [];
    return this.state.businesses.filter((b) => u.businessIds.includes(b.id));
  },

  /* -------- Business -------- */
  updateBusiness(id, patch) {
    const b = this.state.businesses.find((x) => x.id === id);
    if (!b) return;
    Object.assign(b, patch);
    this._save(); this._emit();
  },

  createBusinessForCurrentUser({ name }) {
    const u = this.currentUser();
    if (!u) throw new Error('No autenticado');
    const colors = ['#10B981', '#2563EB', '#7C3AED', '#D97706', '#DC2626', '#0EA5E9'];
    const biz = {
      id: uid('bz'), name, slug: name.toLowerCase().replace(/\s+/g, '-'),
      address: '', phone: '', currency: 'PEN',
      color: colors[Math.floor(Math.random() * colors.length)],
      plan: 'trial', createdAt: nowISO(),
    };
    this.state.businesses.push(biz);
    u.businessIds.push(biz.id);
    this.state.session.activeBusinessId = biz.id;
    this._save(); this._emit();
    return biz;
  },

  /* -------- Products -------- */
  products() {
    const biz = this.activeBusiness(); if (!biz) return [];
    return this.state.products.filter((p) => p.businessId === biz.id);
  },
  createProduct(data) {
    const biz = this.activeBusiness(); if (!biz) throw new Error('Sin negocio activo');
    const colors = ['#0F172A','#2563EB','#7C3AED','#D97706','#DC2626','#0EA5E9','#A16207'];
    const p = {
      id: uid('p'), businessId: biz.id,
      name: data.name, sku: data.sku, category: data.category || 'General',
      price: +data.price || 0, cost: +data.cost || 0,
      stock: +data.stock || 0, minStock: +data.minStock || 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    this.state.products.push(p);
    this._save(); this._emit();
    return p;
  },
  updateProduct(id, patch) {
    const p = this.state.products.find((x) => x.id === id);
    if (!p) return;
    ['name','sku','category','price','cost','stock','minStock'].forEach((k) => {
      if (patch[k] !== undefined) p[k] = (k === 'price' || k === 'cost' || k === 'stock' || k === 'minStock') ? +patch[k] : patch[k];
    });
    this._save(); this._emit();
  },
  deleteProduct(id) {
    this.state.products = this.state.products.filter((p) => p.id !== id);
    this._save(); this._emit();
  },

  /* -------- Customers -------- */
  customers() {
    const biz = this.activeBusiness(); if (!biz) return [];
    return this.state.customers.filter((c) => c.businessId === biz.id);
  },
  createCustomer(data) {
    const biz = this.activeBusiness(); if (!biz) throw new Error('Sin negocio activo');
    const c = { id: uid('c'), businessId: biz.id, name: data.name, phone: data.phone || '', email: data.email || '' };
    this.state.customers.push(c);
    this._save(); this._emit();
    return c;
  },

  /* -------- Sales -------- */
  sales() {
    const biz = this.activeBusiness(); if (!biz) return [];
    return this.state.sales
      .filter((s) => s.businessId === biz.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  createSale({ customerId, customerName, channel, items }) {
    const biz = this.activeBusiness(); if (!biz) throw new Error('Sin negocio activo');
    const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
    const sale = {
      id: uid('s'), businessId: biz.id,
      orderId: 'V-' + String(1000 + this.state.sales.length + 1),
      customerId, customerName, channel, items, total,
      status: 'conf', date: nowISO(),
    };
    this.state.sales.push(sale);
    // Descontar stock
    items.forEach((it) => {
      const p = this.state.products.find((x) => x.id === it.productId);
      if (p) p.stock = Math.max(0, p.stock - it.qty);
    });
    this._save(); this._emit();
    return sale;
  },
  updateSaleStatus(id, status) {
    const s = this.state.sales.find((x) => x.id === id);
    if (s) { s.status = status; this._save(); this._emit(); }
  },

  /* -------- KPIs / Charts -------- */
  kpis() {
    const sales = this.sales();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todaySales = sales.filter((s) => new Date(s.date) >= today);
    const revenueToday = todaySales.reduce((s, x) => s + x.total, 0);
    const waToday = todaySales.filter((s) => s.channel === 'wa').length;
    const lowStock = this.products().filter((p) => p.stock <= p.minStock).length;
    return {
      revenueToday,
      salesTodayCount: todaySales.length,
      activeProducts: this.products().length,
      lowStock,
      waPct: todaySales.length ? Math.round((waToday / todaySales.length) * 100) : 0,
      waCount: waToday,
    };
  },
  chartData(days = 7) {
    const sales = this.sales();
    const out = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
      const d2 = new Date(d); d2.setDate(d2.getDate() + 1);
      const total = sales
        .filter((s) => { const sd = new Date(s.date); return sd >= d && sd < d2; })
        .reduce((s, s2) => s + s2.total, 0);
      out.push({
        label: d.toLocaleDateString('es-PE', { weekday: 'short' }).slice(0, 3),
        value: total,
        today: i === 0,
      });
    }
    return out;
  },
  totalRevenue(days = 7) {
    return this.chartData(days).reduce((s, d) => s + d.value, 0);
  },

  /* -------- Roles y permisos -------- */
  roleMap: {
    superadmin: ['dashboard:read','sales:read','sales:write','products:read','products:write','inventory:read','inventory:write','customers:read','customers:write','reports:read','settings:read','settings:write'],
    owner:      ['dashboard:read','sales:read','sales:write','products:read','products:write','inventory:read','inventory:write','customers:read','customers:write','reports:read','settings:read','settings:write'],
    staff:      ['dashboard:read','sales:read','sales:write','products:read','products:write','inventory:read','inventory:write','customers:read','customers:write','reports:read','settings:read'],
    viewer:     ['dashboard:read','sales:read','products:read','inventory:read','customers:read','reports:read','settings:read'],
  },

  can(permissionId) {
    const user = this.currentUser();
    if (!user) return false;
    const role = user.businessIds.includes(this.activeBusiness()?.id) ? user.role : 'viewer';
    const perms = this.roleMap[role] || this.roleMap.viewer;
    return perms.includes(permissionId);
  },

  currentRole() {
    const user = this.currentUser();
    if (!user) return null;
    return user.role;
  },

  roleLabel(role) {
    const labels = { superadmin: 'Superadmin', owner: 'Propietario', staff: 'Staff', viewer: 'Viewer' };
    return labels[role] || role;
  }
};

/* Helpers globales */
const money = (n, currency = 'PEN') => {
  const sym = currency === 'PEN' ? 'S/' : (currency === 'USD' ? '$' : currency + ' ');
  return sym + ' ' + (+n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
const initials = (n) => (n || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
const fmtDate = (iso) => {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const yest = new Date(now); yest.setDate(yest.getDate() - 1);
  const isYest = d.toDateString() === yest.toDateString();
  const time = d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  if (sameDay) return 'Hoy · ' + time;
  if (isYest) return 'Ayer · ' + time;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }) + ' · ' + time;
};

window.Store = Store;
window.money = money;
window.initials = initials;
window.fmtDate = fmtDate;
window.uid = uid;