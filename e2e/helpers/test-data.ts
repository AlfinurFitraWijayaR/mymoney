/**
 * Test data generators for E2E tests.
 * Uses unique timestamps to avoid collisions in parallel test runs.
 */

export function uniqueId(prefix = 'e2e') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

export function createTestUser() {
  const id = uniqueId('user');
  return {
    username: id,
    password: 'Test1234!',
    tenantId: `tenant_${id}`,
    role: 'MEMBER' as const,
  };
}

export function createTestCategory() {
  return {
    name: `Tes_${uniqueId('cat')}`,
    type: 'EXPENSE' as const,
    svgCode: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>',
  };
}

export function createTestTransaction() {
  return {
    amount: '50000',
    description: `E2E Test ${uniqueId('tx')}`,
    date: new Date().toISOString().split('T')[0],
  };
}
