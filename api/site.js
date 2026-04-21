import { siteContent } from '../src/content/siteContent.js';

export default function handler(_req, res) {
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).json(siteContent);
}
