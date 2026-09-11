/* ============================================================
   MULTIBIZ · Capa de datos — Supabase
   Reemplaza js/store.js con este archivo tras configurar:
   - SUPABASE_URL  (project URL)
   - SUPABASE_KEY  (anon public key)
   ============================================================ */

const SUPABASE_URL = 'https://uwonjwmfqeqlwgijrjgi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_b21TgqRuSsS0Pm0gf7a3yA_yw1xc6Ne';

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

const uid = (p = 'id') => p + '_' + Math.random().toString(36).slice(2, 10);
const nowISO = () => new Date().toISOString();

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

/* ============================================================
   STORE (adaptado a Supabase)
   ============================================================ */
const Store = {
  state: null,
  listeners: new Set(),

  async init() {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return this;
    const { data: userRow } = await sb.from('app_users').select('*').eq('id', user.id).single();
    if (!userRow) {
      await sb.from('app_users').insert({ id: user.id, name: user.email, role: 'owner' });
    }
    this.state = { user };
    this._emit();
    return this;
  },

  subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); },
  _emit() { this.listeners.forEach((fn) => fn(this.state)); },

  /* -------- Auth -------- */
  async login(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    const { data: userRow } = await sb.from('app_users').select('*').eq('id', data.user.id).single();
    this.state = { user: data.user, userRow };
    this._emit();
    return this.state.userRow;
  },

  async register({ businessName, userName, email, password }) {
    const { data: authData, error: authErr } = await sb.auth.signUp({ email, password });
    if (authErr) throw new Error(authErr.message);
    const bizId = uid('bz');
    const colors = ['#10B981', '#2563EB', '#7C3AED', '#D97706', '#DC2626', '#0EA5E9'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    await sb.from('businesses').insert({ id: bizId, name: businessName, slug: businessName.toLowerCase().replace(/\s+/g, '-'), color, plan: 'trial', currency: 'PEN' });
    await sb.from('app_users').insert({ id: authData.user.id, name: userName, role: 'owner' });
    await sb.from('business_members').insert({ user_id: authData.user.id, business_id: bizId, role: 'owner' });
    this.state = { user: authData.user };
    this._emit();
    return this.state.user;
  },

  async logout() {
    await sb.auth.signOut();
    this.state = null;
    this._emit();
  },

  currentUser() { return this.state?.userRow || null; },

  /* -------- Business -------- */
  async setActiveBusiness(id) {
    if (!this.state) return;
    this.state.session = { activeBusinessId: id };
    this._emit();
  },

  async activeBusiness() {
    const id = this.state?.session?.activeBusinessId;
    if (!id) return null;
    const { data } = await sb.from('businesses').select('*').eq('id', id).single();
    return data;
  },

  async userBusinesses() {
    const user = this.currentUser();
    if (!user) return [];
    const { data: members } = await sb.from('business_members').select('business_id').eq('user_id', user.id);
    const ids = (members || []).map((m) => m.business_id);
    const { data } = await sb.from('businesses').select('*').in('id', ids);
    return data || [];
  },

  async updateBusiness(id, patch) {
    await sb.from('businesses').update(patch).eq('id', id);
  },

  async createBusinessForCurrentUser({ name }) {
    const user = this.currentUser();
    if (!user) throw new Error('No autenticado');
    const colors = ['#10B981', '#2563EB', '#7C3AED', '#D97706', '#DC2626', '#0EA5E9'];
    const biz = {
      id: uid('bz'), name, slug: name.toLowerCase().replace(/\s+/g, '-'),
      color: colors[Math.floor(Math.random() * colors.length)],
      plan: 'trial', currency: 'PEN'
    };
    await sb.from('businesses').insert(biz);
    await sb.from('business_members').insert({ user_id: user.id, business_id: biz.id, role: 'owner' });
    await this.setActiveBusiness(biz.id);
    return biz;
  },

  /* -------- Products -------- */
  async products() {
    const biz = await this.activeBusiness(); if (!biz) return [];
    const { data } = await sb.from('products').select('*').eq('business_id', biz.id);
    return data || [];
  },

  async createProduct(data) {
    const biz = await this.activeBusiness(); if (!biz) throw new Error('Sin negocio activo');
    const p = { ...data, business_id: biz.id };
    const { data: created } = await sb.from('products').insert(p).select().single();
    return created;
  },

  async updateProduct(id, patch) {
    await sb.from('products').update(patch).eq('id', id);
  },

  async deleteProduct(id) {
    await sb.from('products').delete().eq('id', id);
  },

  /* -------- Customers -------- */
  async customers() {
    const biz = await this.activeBusiness(); if (!biz) return [];
    const { data } = await sb.from('customers').select('*').eq('business_id', biz.id);
    return data || [];
  },

  async createCustomer(data) {
    const biz = await this.activeBusiness(); if (!biz) throw new Error('Sin negocio activo');
    const { data: created } = await sb.from('customers').insert({ ...data, business_id: biz.id }).select().single();
    return created;
  },

  /* -------- Sales -------- */
  async sales() {
    const biz = await this.activeBusiness(); if (!biz) return [];
    const { data } = await sb.from('sales').select('*').eq('business_id', biz.id).order('created_at', { ascending: false });
    return data || [];
  },

  async createSale({ customerId, customerName, channel, items }) {
    const biz = await this.activeBusiness(); if (!biz) throw new Error('Sin negocio activo');
    const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
    const orderId = 'V-' + String(1000 + Math.floor(Math.random() * 9000));
    const { data: sale } = await sb.from('sales').insert({
      business_id: biz.id, order_id: orderId,
      customer_id: customerId, customer_name: customerName, channel, items, total, status: 'conf'
    }).select().single();
    items.forEach(async (it) => {
      const p = await sb.from('products').select('stock').eq('id', it.productId).single();
      if (p.data) {
        await sb.from('products').update({ stock: Math.max(0, p.data.stock - it.qty) }).eq('id', it.productId);
      }
    });
    return sale;
  },

  async updateSaleStatus(id, status) {
    await sb.from('sales').update({ status }).eq('id', id);
  },

  /* -------- KPIs / Charts -------- */
  async kpis() {
    const sales = await this.sales();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todaySales = sales.filter((s) => new Date(s.created_at) >= today);
    const revenueToday = todaySales.reduce((s, x) => s + x.total, 0);
    const waToday = todaySales.filter((s) => s.channel === 'wa').length;
    const products = await this.products();
    const lowStock = products.filter((p) => p.stock <= p.min_stock).length;
    return {
      revenueToday,
      salesTodayCount: todaySales.length,
      activeProducts: products.length,
      lowStock,
      waPct: todaySales.length ? Math.round((waToday / todaySales.length) * 100) : 0,
      waCount: waToday,
    };
  },

  async chartData(days = 7) {
    const sales = await this.sales();
    const out = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
      const d2 = new Date(d); d2.setDate(d2.getDate() + 1);
      const total = sales
        .filter((s) => { const sd = new Date(s.created_at); return sd >= d && sd < d2; })
        .reduce((s, x) => s + x.total, 0);
      out.push({ label: d.toLocaleDateString('es-PE', { weekday: 'short' }).slice(0, 3), value: total, today: i === 0 });
    }
    return out;
  },

  async totalRevenue(days = 7) {
    return (await this.chartData(days)).reduce((s, d) => s + d.value, 0);
  },

  /* -------- Roles y permisos -------- */
  async currentRole() {
    const biz = await this.activeBusiness(); if (!biz) return null;
    const user = this.currentUser(); if (!user) return null;
    const { data: member } = await sb.from('business_members').select('role').eq('user_id', user.id).eq('business_id', biz.id).single();
    return member ? member.role : null;
  },

  async userPermissions() {
    const role = await this.currentRole(); if (!role) return [];
    const { data } = await sb.from('role_permissions').select('permission_id').eq('role_id', role);
    return (data || []).map((r) => r.permission_id);
  },

  async can(permissionId) {
    const perms = await this.userPermissions();
    return perms.includes(permissionId);
  },

  roleLabel(role) {
    const labels = { owner: 'Propietario', staff: 'Staff', viewer: 'Viewer' };
    return labels[role] || role;
  }
};

window.Store = Store;
window.money = money;
window.initials = initials;
window.fmtDate = fmtDate;
window.uid = uid;
