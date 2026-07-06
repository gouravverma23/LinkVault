const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Fetch link preview metadata from a URL.
 * Extracts title, description, favicon, and Open Graph image.
 */
const getLinkPreview = async (url) => {
  try {
    // Ensure URL has protocol
    let targetUrl = url;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    const { data } = await axios.get(targetUrl, {
      timeout: 8000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
      maxRedirects: 5,
    });

    const $ = cheerio.load(data);

    // Extract title
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      '';

    // Extract description
    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      '';

    // Extract favicon
    const parsedUrl = new URL(targetUrl);
    let favicon =
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      $('link[rel="apple-touch-icon"]').attr('href') ||
      '';

    if (favicon && !favicon.startsWith('http')) {
      favicon = favicon.startsWith('/')
        ? `${parsedUrl.protocol}//${parsedUrl.host}${favicon}`
        : `${parsedUrl.protocol}//${parsedUrl.host}/${favicon}`;
    }

    if (!favicon) {
      favicon = `${parsedUrl.protocol}//${parsedUrl.host}/favicon.ico`;
    }

    // Extract Open Graph image
    let ogImage =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      '';

    if (ogImage && !ogImage.startsWith('http')) {
      ogImage = ogImage.startsWith('/')
        ? `${parsedUrl.protocol}//${parsedUrl.host}${ogImage}`
        : `${parsedUrl.protocol}//${parsedUrl.host}/${ogImage}`;
    }

    return {
      title: title.trim().substring(0, 200),
      description: description.trim().substring(0, 500),
      favicon,
      ogImage,
      url: targetUrl,
    };
  } catch (error) {
    // Return partial data on failure
    let parsedUrl;
    try {
      parsedUrl = new URL(
        url.startsWith('http') ? url : `https://${url}`
      );
    } catch {
      return { title: '', description: '', favicon: '', ogImage: '', url };
    }

    return {
      title: parsedUrl.hostname,
      description: '',
      favicon: `${parsedUrl.protocol}//${parsedUrl.host}/favicon.ico`,
      ogImage: '',
      url: parsedUrl.href,
    };
  }
};

module.exports = { getLinkPreview };
