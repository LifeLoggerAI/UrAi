import React from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot, Root } from 'react-dom/client';
import HomePage from '@/app/home/page';

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  container.remove();
});

describe('HomePage', () => {
  it('highlights the ritual entry points', () => {
    act(() => {
      root.render(<HomePage />);
    });

    const buttons = Array.from(container.querySelectorAll('button')).map((button) => button.textContent);

    expect(buttons.join(' ')).toContain('Tap the sky');
    expect(buttons.join(' ')).toContain('Local-Only');
    expect(container.textContent).toContain('Mirror');
    expect(container.textContent).toContain('Narrator');
    expect(container.textContent).toContain('Rituals');
  });

  it('routes dreamers into the life map', () => {
    act(() => {
      root.render(<HomePage />);
    });

    const action = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Tap the sky')
    );
    expect(action).not.toBeUndefined();

    const originalHref = window.location.href;

    act(() => {
      action?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(window.location.href).toContain('/life-map');

    window.location.href = originalHref;
  });
});
