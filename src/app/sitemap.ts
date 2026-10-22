import type { MetadataRoute } from 'next';
import { site } from '@/data/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-10-22');
  return [
    { url: site.url, lastModified },
    { url: `${site.url}/read`, lastModified },
  ];
}
