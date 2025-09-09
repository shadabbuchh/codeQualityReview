import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock child_process before importing the module under test
vi.mock('child_process', () => {
  return {
    exec: vi.fn(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (cmd: string, cb: (err: any, stdout: string, stderr: string) => void) => {
        cb(null, 'ok', '');
      }
    ),
  };
});

// Use dynamic import so mocks apply before module evaluation
async function importModule() {
  return await import('./sync-components');
}

const originalFetch = globalThis.fetch;

describe('scripts/sync-components', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = originalFetch;
  });

  it('fetchComponentsList parses directory listing HTML for .json files', async () => {
    const html = `
      <html><body>
        <a href="accordion.json">accordion.json</a>
        <a href="/button.json">/button.json</a>
        <a href="not-json.txt">not-json.txt</a>
      </body></html>
    `;

    globalThis.fetch = vi
      .fn()
      .mockResolvedValue({ ok: true, text: () => Promise.resolve(html) });

    const { fetchComponentsList } = await importModule();

    const list = await fetchComponentsList();
    expect(list).toHaveLength(2);
    expect(list[0]).toEqual({
      name: 'accordion',
      url: 'http://localhost:4000/accordion.json',
    });
    expect(list[1]).toEqual({
      name: 'button',
      url: 'http://localhost:4000/button.json',
    });
  });

  it('addComponent executes shadcn add when HEAD check passes', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true });

    const { addComponent } = await importModule();

    const { exec } = await import('child_process');
    const execSpy = exec as unknown as ReturnType<typeof vi.fn>;

    await expect(
      addComponent('button', 'http://localhost:4000/button.json')
    ).resolves.toBeUndefined();

    expect(execSpy).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const calledWith = (execSpy as any).mock.calls[0][0] as string;
    expect(calledWith).toContain(
      'pnpm dlx shadcn@latest add http://localhost:4000/button.json --overwrite'
    );
  });

  it('addComponent skips when component URL is not accessible', async () => {
    const headFail = vi.fn().mockResolvedValue({ ok: false });
    globalThis.fetch = headFail as unknown as typeof fetch;

    const { addComponent } = await importModule();

    const { exec } = await import('child_process');
    const execSpy = exec as unknown as ReturnType<typeof vi.fn>;

    await addComponent('missing', 'http://localhost:4000/missing.json');

    expect(execSpy).not.toHaveBeenCalled();
  });
});
