import { computed, type Component, type ComputedRef } from 'vue';
import { capabilities } from '@/domains/capabilities';

type ExtensionProps = Record<string, unknown>;

export type NetWorthViewExtensions = {
  HeaderActions: Component | null;
  itemFormProps: ComputedRef<ExtensionProps>;
  itemListProps: ComputedRef<ExtensionProps>;
};

export function useNetWorthViewExtensions(store?: unknown): NetWorthViewExtensions {
  const ownershipProps = computed<ExtensionProps>(() => {
    if (!capabilities.people || !store || typeof store !== 'object') {
      return {};
    }
    if (!('ownerships' in store)) {
      return {};
    }

    const ownerships = (store as { ownerships?: unknown }).ownerships;
    if (!Array.isArray(ownerships)) {
      return {};
    }

    return { ownerships };
  });

  return {
    HeaderActions: null,
    itemFormProps: ownershipProps,
    itemListProps: ownershipProps,
  };
}
