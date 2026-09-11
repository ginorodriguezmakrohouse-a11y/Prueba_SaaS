// tests/unit/store.test.js
// Tests unitarios para Store (localStorage)

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Initialize Store before all tests
beforeEach(() => {
  // Reset store to clean seed state
  Store.reset();
});

afterEach(() => {
  // Clean up after each test if needed
  // Store.reset(); // optional
});

describe('Store - Auth', () => {
  it('login con credenciales válidas', () => {
    const result = Store.login('admin@multibiz.pe', 'admin123');
    expect(result).toBeDefined();
    expect(result.email).toBe('admin@multibiz.pe');
  });

  it('login con credenciales inválidas', () => {
    expect(() => {
      Store.login('wrong@mail.com', 'wrong');
    }).toThrow();
  });

  it('register crea nuevo usuario', () => {
    const user = Store.register({
      businessName: 'Test Business',
      userName: 'Test User',
      email: 'test@test.com',
      password: 'test123456',
    });
    expect(user).toBeDefined();
    expect(user.email).toBe('test@test.com');
  });

  it('logout limpia sesión', () => {
    Store.login('admin@multibiz.pe', 'admin123');
    Store.logout();
    expect(Store.currentUser()).toBeNull();
  });
});

describe('Store - CRUD', () => {
  beforeEach(() => {
    // Ensure logged in as admin
    Store.login('admin@multibiz.pe', 'admin123');
  });

  it('productos CRUD', () => {
    const prod = Store.createProduct({
      name: 'Test Product',
      sku: 'TST-001',
      category: 'Test',
      price: 100,
      cost: 50,
      stock: 10,
      minStock: 5,
      color: '#123456',
    });
    expect(prod).toBeDefined();
    expect(prod.name).toBe('Test Product');

    const products = Store.products();
    expect(products.length).toBeGreaterThan(0);

    Store.updateProduct(prod.id, { price: 200 });
    const updated = Store.products().find((p) => p.id === prod.id);
    expect(updated.price).toBe(200);

    Store.deleteProduct(prod.id);
    expect(Store.products().find((p) => p.id === prod.id)).toBeUndefined();
  });

  it('clientes CRUD', () => {
    const cust = Store.createCustomer({
      name: 'Test Customer',
      phone: '+51 987 654 321',
      email: 'test@mail.com',
    });
    expect(cust).toBeDefined();
    expect(cust.name).toBe('Test Customer');

    const customers = Store.customers();
    expect(customers.length).toBeGreaterThan(0);
  });

  it('ventas CRUD', () => {
    // Crear un producto primero
    const prod = Store.createProduct({
      name: 'Test Product',
      sku: 'TST-001',
      category: 'Test',
      price: 100,
      cost: 50,
      stock: 10,
      minStock: 5,
      color: '#123456',
    });

    const sale = Store.createSale({
      customerId: null,
      customerName: 'Cliente Test',
      channel: 'wa',
      items: [{ productId: prod.id, name: 'Test Product', qty: 2, price: 100 }],
    });
    expect(sale).toBeDefined();
    expect(sale.total).toBe(200);

    const sales = Store.sales();
    expect(sales.length).toBeGreaterThan(0);
  });
});

describe('Store - KPIs', () => {
  beforeEach(() => {
    Store.login('admin@multibiz.pe', 'admin123');
  });

  it('kpis retorna métricas', () => {
    const kpis = Store.kpis();
    expect(kpis).toHaveProperty('revenueToday');
    expect(kpis).toHaveProperty('salesTodayCount');
    expect(kpis).toHaveProperty('activeProducts');
    expect(kpis).toHaveProperty('lowStock');
    expect(kpis).toHaveProperty('waPct');
    expect(kpis).toHaveProperty('waCount');
  });

  it('chartData retorna datos de 7 días', () => {
    const data = Store.chartData(7);
    expect(data.length).toBe(7);
    expect(data[0]).toHaveProperty('label');
    expect(data[0]).toHaveProperty('value');
    expect(data[0]).toHaveProperty('today');
  });
});

describe('Store - Permisos', () => {
  beforeEach(() => {
    Store.login('admin@multibiz.pe', 'admin123');
  });

  it('owner tiene permisos sales:write', () => {
    expect(Store.can('sales:write')).toBe(true);
  });

  it('owner tiene permisos products:write', () => {
    expect(Store.can('products:write')).toBe(true);
  });

  it('currentRole retorna superadmin', () => {
    expect(Store.currentRole()).toBe('superadmin');
  });

  it('roleLabel retorna label correcto', () => {
    expect(Store.roleLabel('owner')).toBe('Propietario');
    expect(Store.roleLabel('staff')).toBe('Staff');
    expect(Store.roleLabel('viewer')).toBe('Viewer');
  });
});