<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap — Top Nepali Network</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style type="text/css">
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            padding: 2.5rem 1rem;
            line-height: 1.5;
          }
          .container {
            max-width: 80rem;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 1rem;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04);
            padding: 2rem 2.5rem;
            border: 1px solid #e2e8f0;
          }
          .badge {
            display: inline-block;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            background: #dc2626;
            color: #ffffff;
            padding: 0.25rem 0.65rem;
            border-radius: 9999px;
            margin-bottom: 0.75rem;
          }
          h1 {
            font-size: 1.85rem;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 0.35rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          p.lead {
            font-size: 0.95rem;
            color: #475569;
            margin-bottom: 0.5rem;
          }
          p.sub {
            font-size: 0.85rem;
            color: #64748b;
            margin-bottom: 1.5rem;
          }
          p.sub a {
            color: #dc2626;
            text-decoration: underline;
          }
          .count-banner {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            color: #991b1b;
            padding: 0.75rem 1.25rem;
            border-radius: 0.75rem;
            font-weight: 600;
            font-size: 0.9rem;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .back-link {
            font-size: 0.85rem;
            font-weight: 600;
            color: #dc2626;
            text-decoration: none;
          }
          .back-link:hover {
            text-decoration: underline;
          }
          .table-wrapper {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.875rem;
          }
          th {
            text-align: left;
            padding: 0.75rem 1rem;
            background-color: #f1f5f9;
            color: #334155;
            font-weight: 700;
            border-bottom: 2px solid #cbd5e1;
            white-space: nowrap;
          }
          td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: middle;
          }
          tr:nth-child(even) {
            background-color: #f8fafc;
          }
          tr:hover {
            background-color: #fff1f2;
          }
          a {
            color: #dc2626;
            text-decoration: none;
            word-break: break-all;
            font-weight: 500;
          }
          a:hover {
            color: #991b1b;
            text-decoration: underline;
          }
          .mono {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            color: #64748b;
            font-size: 0.825rem;
            white-space: nowrap;
          }
          .priority-pill {
            display: inline-block;
            padding: 0.15rem 0.5rem;
            border-radius: 0.375rem;
            background: #f1f5f9;
            font-weight: 600;
            font-size: 0.75rem;
            color: #334155;
          }
          .footer {
            margin-top: 2rem;
            padding-top: 1.25rem;
            border-top: 1px solid #e2e8f0;
            font-size: 0.825rem;
            color: #64748b;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="badge">XML SITEMAP</div>
          <h1>XML Sitemap</h1>
          <p class="lead">
            Generated by Top Nepali, this is an XML Sitemap meant for consumption by search engines (Google, Bing, Yahoo, Yandex).
          </p>
          <p class="sub">
            Learn more about XML sitemaps on <a href="https://sitemaps.org" target="_blank" rel="noopener">sitemaps.org</a>.
          </p>
          
          <!-- Sitemap Index Case -->
          <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &gt; 0">
            <div class="count-banner">
              <span>This XML Sitemap Index contains <strong><xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/></strong> sub-sitemaps.</span>
            </div>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th style="width: 75%;">Sitemap</th>
                    <th style="width: 25%;">Last Modified</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                    <tr>
                      <td>
                        <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                      </td>
                      <td class="mono">
                        <xsl:value-of select="concat(substring(sitemap:lastmod,1,10), ' ', substring(sitemap:lastmod,12,5))"/>
                      </td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </div>
          </xsl:if>
          
          <!-- URL Set Case -->
          <xsl:if test="count(sitemap:urlset/sitemap:url) &gt; 0">
            <div class="count-banner">
              <span>This XML Sitemap contains <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> indexed URLs.</span>
              <a href="/sitemap.xml" class="back-link">&#8592; Back to Sitemap Index</a>
            </div>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th style="width: 60%;">URL Location</th>
                    <th style="width: 12%;">Priority</th>
                    <th style="width: 13%;">Change Freq</th>
                    <th style="width: 15%;">Last Modified</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sitemap:urlset/sitemap:url">
                    <tr>
                      <td>
                        <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                      </td>
                      <td>
                        <span class="mono priority-pill">
                          <xsl:value-of select="sitemap:priority"/>
                        </span>
                      </td>
                      <td class="mono">
                        <xsl:value-of select="sitemap:changefreq"/>
                      </td>
                      <td class="mono">
                        <xsl:value-of select="concat(substring(sitemap:lastmod,1,10), ' ', substring(sitemap:lastmod,12,5))"/>
                      </td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </div>
          </xsl:if>

          <div class="footer">
            <span>Top Nepali Network &#8226; <a href="/sitemap.xml">Sitemap Index</a></span>
            <span><a href="https://topnepali.com">topnepali.com</a></span>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
