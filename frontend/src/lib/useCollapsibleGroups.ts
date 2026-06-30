import { ref } from 'vue';

// Estado de colapso por clave para listas agrupadas (catálogo de cuentas,
// balance de patrimonio...). Con `defaultCollapsed`, el Set guarda las claves
// abiertas para poder conservar listas que empiezan plegadas.
type CollapsibleGroupsOptions = {
  defaultCollapsed?: boolean;
};

export function useCollapsibleGroups(options: CollapsibleGroupsOptions = {}) {
  const collapsed = ref<Set<string>>(new Set());

  function isCollapsed(key: string): boolean {
    return options.defaultCollapsed ? !collapsed.value.has(key) : collapsed.value.has(key);
  }

  function toggle(key: string): void {
    const next = new Set(collapsed.value);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    collapsed.value = next;
  }

  return { collapsed, isCollapsed, toggle };
}
