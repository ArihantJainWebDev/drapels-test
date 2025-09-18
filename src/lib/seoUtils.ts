import { Blog } from "@/types/blog";
import { fetchBlogs } from "./blogStorage";

// Generate XML sitemap for blog posts
export const generateBlogSitemap = async (): Promise<string> => {
  const blogs = await fetchBlogs();
  const baseUrl = "https://drapels.com";

  if (!blogs || blogs.length === 0) {
    const today = new Date().toISOString().split("T")[0];
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>${baseUrl}/blogs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
  }

  const sitemapEntries = blogs
    .map((blog) => {
      const lastmod = blog.updatedAt || blog.publishedAt;
      const priority = "0.8"; // High priority for blog posts
      const changefreq = "weekly";

      return `  <url>
    <loc>${baseUrl}/blogs/${blog.slug}</loc>
    <lastmod>${new Date(lastmod).toISOString().split("T")[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <image:image>
      <image:loc>${blog.coverImage || `${baseUrl}/blog-default.jpg`}</image:loc>
      <image:title>${blog.title}</image:title>
      <image:caption>${blog.excerpt}</image:caption>
    </image:image>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${sitemapEntries}
</urlset>`;
};

// Generate RSS feed for blog posts
export const generateBlogRSS = async (): Promise<string> => {
  const blogs = await fetchBlogs();
  const baseUrl = "https://drapels.com";
  const feedUrl = `${baseUrl}/blogs/rss.xml`;
  const siteTitle = "Drapels Blog";
  const siteDescription =
    "Latest insights on programming, career development, and technology trends from Drapels";

  const rssItems = blogs
    .slice(0, 20)
    .map((blog) => {
      // Latest 20 posts
      const pubDate = new Date(blog.publishedAt).toUTCString();
      const guid = `${baseUrl}/blogs/${blog.slug}`;

      // Extract text content for description
      const textCells =
        blog.cells?.filter(
          (cell) => cell.type === "text" || cell.type === "heading"
        ) || [];
      const fullContent = textCells.map((cell) => cell.content).join(" ");
      const description =
        fullContent.length > 300
          ? fullContent.slice(0, 297) + "..."
          : fullContent;

      return `    <item>
      <title><![CDATA[${blog.title}]]></title>
      <description><![CDATA[${description}]]></description>
      <link>${guid}</link>
      <guid isPermaLink="true">${guid}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>noreply@drapels.com (${
        blog.authorDisplayName || "Drapels Team"
      })</author>
      <category>Technology</category>
      <category>Programming</category>
      <category>Career Development</category>
      ${
        blog.coverImage
          ? `<enclosure url="${blog.coverImage}" type="image/jpeg" length="0"/>`
          : ""
      }
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${siteTitle}</title>
    <description>${siteDescription}</description>
    <link>${baseUrl}/blogs</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>${siteTitle}</title>
      <link>${baseUrl}/blogs</link>
      <width>144</width>
      <height>144</height>
    </image>
${rssItems}
  </channel>
</rss>`;
};

// Generate Google News sitemap for recent blog posts
export const generateGoogleNewsSitemap = async (): Promise<string> => {
  const blogs = await fetchBlogs();
  const baseUrl = "https://drapels.com";

  // Only include posts from last 2 days for Google News
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const recentBlogs = blogs.filter(
    (blog) => new Date(blog.publishedAt) > twoDaysAgo
  );

  if (recentBlogs.length === 0) {
    const today = new Date().toISOString().split("T")[0];
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>${baseUrl}/blogs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;
  }

  const newsEntries = recentBlogs
    .map((blog) => {
      const pubDate = new Date(blog.publishedAt).toISOString();

      return `  <url>
    <loc>${baseUrl}/blogs/${blog.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>Drapels</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title><![CDATA[${blog.title}]]></news:title>
      <news:keywords>programming, development, technology, career, coding, software engineering</news:keywords>
    </news:news>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsEntries}
</urlset>`;
};

// Generate structured data for blog listing page
export const generateBlogListingStructuredData = (blogs: Blog[]) => {
  const baseUrl = "https://drapels.com";

  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Drapels Blog",
    description:
      "Programming tutorials, career advice, and technology insights",
    url: `${baseUrl}/blogs`,
    publisher: {
      "@type": "Organization",
      name: "Drapels",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    blogPost: blogs.slice(0, 10).map((blog) => ({
      "@type": "BlogPosting",
      headline: blog.title,
      description: blog.excerpt,
      url: `${baseUrl}/blogs/${blog.slug}`,
      datePublished: blog.publishedAt,
      dateModified: blog.updatedAt,
      author: {
        "@type": "Person",
        name: blog.authorDisplayName || "Drapels Team",
      },
      image: blog.coverImage || `${baseUrl}/blog-default.jpg`,
    })),
  };
};

// SEO optimization utilities
export const optimizeImageForSEO = (
  imageUrl: string,
  alt: string,
  title: string
) => {
  return {
    src: imageUrl,
    alt: alt || title,
    title: title,
    loading: "lazy" as const,
    decoding: "async" as const,
  };
};

// Generate meta tags for social sharing
export const generateSocialMetaTags = (blog: Blog) => {
  const baseUrl = "https://drapels.com";
  const url = `${baseUrl}/blogs/${blog.slug}`;
  const image = blog.coverImage || `${baseUrl}/blog-default.jpg`;

  return {
    title: `${blog.title} | Drapels Blog`,
    description: blog.excerpt,
    url,
    image,
    type: "article",
    siteName: "Drapels",
    twitterCard: "summary_large_image",
    twitterSite: "@drapels",
    publishedTime: blog.publishedAt,
    modifiedTime: blog.updatedAt,
    author: blog.authorDisplayName || "Drapels Team",
    section: "Technology",
    tags: ["Programming", "Development", "Career", "Technology"],
  };
};

// Performance optimization for Core Web Vitals
export const preloadCriticalResources = () => {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous" as const,
    },
    { rel: "dns-prefetch", href: "https://www.google-analytics.com" },
    { rel: "dns-prefetch", href: "https://www.googletagmanager.com" },
  ];
};

// Generate breadcrumb structured data
export const generateBreadcrumbStructuredData = (blog: Blog) => {
  const baseUrl = "https://drapels.com";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${baseUrl}/blogs`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blog.title,
        item: `${baseUrl}/blogs/${blog.slug}`,
      },
    ],
  };
};

// Submit sitemap to search engines
export const submitSitemapToSearchEngines = async (sitemapUrl: string) => {
  const searchEngines = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  ];

  const results = await Promise.allSettled(
    searchEngines.map((url) =>
      fetch(url, { method: "GET", mode: "no-cors" }).catch((err) =>
        console.warn(`Failed to ping ${url}:`, err)
      )
    )
  );

  return results;
};

// Generate robots.txt content
export const generateRobotsTxt = () => {
  const baseUrl = "https://drapels.com";

  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/blogs/sitemap.xml
Sitemap: ${baseUrl}/blogs/news-sitemap.xml

# RSS Feed
Sitemap: ${baseUrl}/blogs/rss.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Disallow admin and private areas
Disallow: /admin
Disallow: /api/
Disallow: /_next/
Disallow: /static/

# Allow important pages
Allow: /blogs
Allow: /blogs/*
Allow: /roadmap
Allow: /companies
Allow: /community
`;
};
