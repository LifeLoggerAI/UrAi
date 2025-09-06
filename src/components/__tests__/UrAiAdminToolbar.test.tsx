import { render, fireEvent } from '@testing-library/react';
import UrAiAdminToolbar from '../UrAiAdminToolbar';

describe('UrAiAdminToolbar', () => {
  it('renders status text', () => {
    const { getByText } = render(<UrAiAdminToolbar status="ready" />);
    expect(getByText(/Status: ready/)).toBeInTheDocument();
  });

  it('triggers callbacks', () => {
    const onRefresh = jest.fn();
    const onClearCache = jest.fn();
    const { getByTestId } = render(
      <UrAiAdminToolbar onRefresh={onRefresh} onClearCache={onClearCache} />
    );
    fireEvent.click(getByTestId('refresh-btn'));
    fireEvent.click(getByTestId('clear-cache-btn'));
    expect(onRefresh).toHaveBeenCalled();
    expect(onClearCache).toHaveBeenCalled();
  });
});
