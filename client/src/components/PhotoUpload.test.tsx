import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PhotoUpload } from './PhotoUpload';

describe('PhotoUpload', () => {
  beforeEach(() => {
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => 'blob:photo-preview'),
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('stores a valid selection locally without making a network request', () => {
    const onUploaded = vi.fn();
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const { container } = render(<PhotoUpload onUploaded={onUploaded} />);
    const input = container.querySelector('input[type="file"]');
    const file = new File(['photo'], 'team-photo.jpg', { type: 'image/jpeg' });

    fireEvent.change(input!, { target: { files: [file] } });

    expect(onUploaded).toHaveBeenCalledWith({
      fileName: 'team-photo.jpg',
      selectedAt: expect.any(String),
    });
    expect(screen.getByText(/上傳完照片才能完成體驗/)).toBeInTheDocument();
    expect(screen.getByText(/已選擇照片/)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rejects unsupported file types', () => {
    const onUploaded = vi.fn();
    const { container } = render(<PhotoUpload onUploaded={onUploaded} />);
    const input = container.querySelector('input[type="file"]');
    const file = new File(['notes'], 'notes.txt', { type: 'text/plain' });

    fireEvent.change(input!, { target: { files: [file] } });

    expect(screen.getByRole('alert')).toHaveTextContent('JPEG、PNG 或 WEBP');
    expect(onUploaded).not.toHaveBeenCalled();
  });

  it('rejects files larger than 10 MB', () => {
    const onUploaded = vi.fn();
    const { container } = render(<PhotoUpload onUploaded={onUploaded} />);
    const input = container.querySelector('input[type="file"]');
    const file = new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'large.jpg', {
      type: 'image/jpeg',
    });

    fireEvent.change(input!, { target: { files: [file] } });

    expect(screen.getByRole('alert')).toHaveTextContent('不可超過 10 MB');
    expect(onUploaded).not.toHaveBeenCalled();
  });
});
