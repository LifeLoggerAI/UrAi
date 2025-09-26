import React from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot, Root } from 'react-dom/client';
import OnboardingPage from '@/app/onboarding/page';

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

describe('OnboardingPage', () => {
  it('displays the onboarding hero copy', () => {
    act(() => {
      root.render(<OnboardingPage />);
    });

    expect(container.querySelector('h1')?.textContent).toContain('URAI');
    expect(container.textContent).toContain('Your Emotional Media OS');
    expect(
      container.querySelector('button')?.textContent
    ).toContain('Get Started');
  });

  it('redirects users into the home experience when continuing', () => {
    act(() => {
      root.render(<OnboardingPage />);
    });

    const getStarted = container.querySelector('button');
    expect(getStarted).not.toBeNull();

    const originalHref = window.location.href;

    act(() => {
      getStarted?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(window.location.href).toContain('/home');

    window.location.href = originalHref;
  });
});
