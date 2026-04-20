import { nxpWriteToClipboard } from './clipboard';

describe('nxpWriteToClipboard', () => {
  let originalClipboard: PropertyDescriptor | undefined;

  beforeEach(() => {
    originalClipboard = Object.getOwnPropertyDescriptor(
      globalThis.navigator,
      'clipboard',
    );
  });

  afterEach(() => {
    if (originalClipboard) {
      Object.defineProperty(
        globalThis.navigator,
        'clipboard',
        originalClipboard,
      );
    } else {
      // Remove stub we installed during the test.
      try {
        delete (globalThis.navigator as unknown as Record<string, unknown>)['clipboard'];
      } catch {
        /* noop */
      }
    }
  });

  function stubClipboard(impl: { writeText: (t: string) => Promise<void> } | null): void {
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: impl,
      configurable: true,
      writable: true,
    });
  }

  it('writes via navigator.clipboard.writeText when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboard({ writeText });

    const ok = await nxpWriteToClipboard('hello', document);

    expect(writeText).toHaveBeenCalledWith('hello');
    expect(ok).toBe(true);
  });

  it('falls back to execCommand when Clipboard API throws', async () => {
    stubClipboard({
      writeText: vi.fn().mockRejectedValue(new Error('denied')),
    });

    const execCommand = vi.fn().mockReturnValue(true);
    const originalExec = (
      document as unknown as Record<string, unknown>
    )['execCommand'];
    (document as unknown as Record<string, unknown>)['execCommand'] =
      execCommand;

    try {
      const ok = await nxpWriteToClipboard('fallback', document);
      expect(execCommand).toHaveBeenCalledWith('copy');
      expect(ok).toBe(true);
    } finally {
      (document as unknown as Record<string, unknown>)['execCommand'] =
        originalExec;
    }
  });

  it('returns false when no document is available and none provided', async () => {
    // Preserve and temporarily shadow the global `document` reference.
    const hadDocument = 'document' in globalThis;
    const originalDocument = (globalThis as unknown as Record<string, unknown>)['document'];
    try {
      (globalThis as unknown as Record<string, unknown>)['document'] = undefined;
      const ok = await nxpWriteToClipboard('x', undefined);
      expect(ok).toBe(false);
    } finally {
      if (hadDocument) {
        (globalThis as unknown as Record<string, unknown>)['document'] = originalDocument;
      }
    }
  });
});
