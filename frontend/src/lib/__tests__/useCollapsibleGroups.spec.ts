import { describe, expect, it } from 'vitest';
import { useCollapsibleGroups } from '@/lib/useCollapsibleGroups';

describe('useCollapsibleGroups', () => {
  it('starts with nothing collapsed', () => {
    const { isCollapsed } = useCollapsibleGroups();
    expect(isCollapsed('a')).toBe(false);
  });

  it('toggles a key collapsed and back', () => {
    const { isCollapsed, toggle } = useCollapsibleGroups();
    toggle('a');
    expect(isCollapsed('a')).toBe(true);
    expect(isCollapsed('b')).toBe(false);
    toggle('a');
    expect(isCollapsed('a')).toBe(false);
  });

  it('can start keys collapsed by default', () => {
    const { isCollapsed, toggle } = useCollapsibleGroups({ defaultCollapsed: true });
    expect(isCollapsed('a')).toBe(true);
    toggle('a');
    expect(isCollapsed('a')).toBe(false);
    expect(isCollapsed('b')).toBe(true);
  });
});
