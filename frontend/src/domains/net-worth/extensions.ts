import type { Component } from 'vue';
import { capabilities } from '@/domains/capabilities';
import PremiumPeopleActionButton from '@/domains/net-worth/components/PremiumPeopleActionButton.vue';

type ExtensionProps = Record<string, unknown>;

export type NetWorthViewExtensions = {
  HeaderActions: Component | null;
  itemFormProps: ExtensionProps;
  itemListProps: ExtensionProps;
};

function resolveOwnershipProps(store?: unknown): ExtensionProps {
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
}

export function useNetWorthViewExtensions(store?: unknown): NetWorthViewExtensions {
  const ownershipProps = resolveOwnershipProps(store);

  return {
    HeaderActions: capabilities.people ? PremiumPeopleActionButton : null,
    itemFormProps: ownershipProps,
    itemListProps: ownershipProps,
  };
}
