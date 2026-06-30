import { ref } from 'vue';

// Estado de colapso por clave para listas agrupadas (catálogo de cuentas,
// balance de patrimonio...). Centraliza el patrón de Set de claves plegadas
// que estaba duplicado por vista.
export function useCollapsibleGroups() {
  const collapsed = ref<Set<string>>(new Set());

  function isCollapsed(key: string): boolean {
    return collapsed.value.has(key);
  }

  function toggle(key: string): void {
    const next = new Set(collapsed.value);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    collapsed.value = next;
  }

  return { collapsed, isCollapsed, toggle };
}
