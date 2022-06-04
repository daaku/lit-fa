import { render } from '@lit-labs/ssr/lib/render-with-global-dom-shim.js';
import { Readable } from 'stream';
import { fa } from '../src/fa.js';

const iconA = {
  prefix: 'fas',
  iconName: 'lit',
  icon: [256, 256, null, null, 'M1'],
};
const iconB = { ...iconA, icon: [256, 256, null, null, ['M1', 'M2']] };

const renderString = async (v) => {
  const stream = Readable.from(render(v));
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf-8');
};

describe('fa with', () => {
  it('icon only', async () => {
    const html = await renderString(fa({ icon: iconA }));
    expect(html).toContain('fas-lit');
    expect(html).toContain('transform="translate(0,0) scale(1,1)"');
    expect(html).toContain('d="M1"');
  });
  it('2 path icon', async () => {
    const html = await renderString(fa({ icon: iconB }));
    expect(html).toContain('d="M1"');
    expect(html).toContain('d="M2"');
  });
  it('fw', async () => {
    const html = await renderString(fa({ icon: iconA, fw: true }));
    expect(html).toContain('width:1.25em');
  });
  it('pull', async () => {
    const html = await renderString(fa({ icon: iconA, pull: true }));
    expect(html).toContain('float');
  });
  it('size=lg', async () => {
    const html = await renderString(fa({ icon: iconA, size: 'lg' }));
    expect(html).toContain('font-size:1.33');
  });
  it('size=xs', async () => {
    const html = await renderString(fa({ icon: iconA, size: 'xs' }));
    expect(html).toContain('font-size:.75');
  });
  it('size=sm', async () => {
    const html = await renderString(fa({ icon: iconA, size: 'sm' }));
    expect(html).toContain('font-size:.875');
  });
  it('size=4x', async () => {
    const html = await renderString(fa({ icon: iconA, size: '4x' }));
    expect(html).toContain('font-size:4em');
  });
  it('flip=horizontal', async () => {
    const html = await renderString(fa({ icon: iconA, flip: 'horizontal' }));
    expect(html).toContain('transform="translate(0,0) scale(-1,1)');
  });
  it('flip=vertical', async () => {
    const html = await renderString(fa({ icon: iconA, flip: 'vertical' }));
    expect(html).toContain('transform="translate(0,0) scale(1,-1)');
  });
  it('flip', async () => {
    const html = await renderString(fa({ icon: iconA, flip: true }));
    expect(html).toContain('transform="translate(0,0) scale(-1,-1)');
  });
  it('rotate', async () => {
    const html = await renderString(fa({ icon: iconA, rotate: 10 }));
    expect(html).toContain('rotate(10)');
  });
  it('color with one path', async () => {
    const html = await renderString(fa({ icon: iconA, color: 'red' }));
    expect(html).toContain('fill="red"');
  });
  it('primaryColor with one path', async () => {
    const html = await renderString(fa({ icon: iconA, primaryColor: 'red' }));
    expect(html).toContain('fill="red"');
  });
  it('color with two paths, primary & secondary', async () => {
    const html = await renderString(
      fa({ icon: iconB, primaryColor: 'red', secondaryColor: 'green' }),
    );
    expect(html).toContain('fill="red"');
    expect(html).toContain('fill="green"');
  });
  it('swapOpacity', async () => {
    const html = await renderString(fa({ icon: iconB, swapOpacity: true }));
    expect(/d="M1"\s+fill="currentColor"\s+fill-opacity="1"/m.test(html))
      .withContext(html)
      .toBeTrue();
    expect(/d="M2"\s+fill="currentColor"\s+fill-opacity="0.4"/m.test(html))
      .withContext(html)
      .toBeTrue();
  });
});
