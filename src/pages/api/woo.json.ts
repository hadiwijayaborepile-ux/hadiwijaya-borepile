import type { APIRoute } from 'astro';
import { fetchProductsPage, fetchProductBySlug } from '../../lib/woocommerce';

export const get: APIRoute = async ({ url }) => {
  try {
    const path = url.pathname || '';
    const q = url.searchParams;
    const action = q.get('action') || q.get('type') || 'products';

    if (action === 'product' || url.searchParams.has('slug')) {
      const slug = q.get('slug') || '';
      const product = await fetchProductBySlug(slug);
      if (!product) return new Response(JSON.stringify({ error: 'not_found' }), { status: 404 });
      return new Response(JSON.stringify(product), {
        status: 200,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'public, max-age=60'
        }
      });
    }

    // default: list products (first page or page param)
    const page = Number(q.get('page') || '1') || 1;
    const per_page = Number(q.get('per_page') || '24') || 24;
    const list = await fetchProductsPage(page, per_page);
    return new Response(JSON.stringify(list), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=60'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'server_error' }), { status: 500 });
  }
};
