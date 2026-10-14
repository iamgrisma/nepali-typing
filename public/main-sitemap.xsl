<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap - Top Nepali Typing</title>
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
            background-color: #f1f5f9;
            color: #334155;
            padding: 2rem 1rem;
            line-height: 1.5;
          }
          .page-card {
            max-width: 76rem;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05);
            border: 1px solid #e2e8f0;
          }
          .header-banner {
            background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
            color: #ffffff;
            padding: 2.25rem 2.5rem;
          }
          .badge-row {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
          }
          .network-badge {
            display: inline-block;
            font-size: 0.7rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.075em;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(4px);
            color: #ffffff;
            padding: 0.25rem 0.65rem;
            border-radius: 9999px;
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
          h1 {
            font-size: 2rem;
            font-weight: 800;
            letter-spacing: -0.025em;
            margin-bottom: 0.5rem;
            color: #ffffff;
          }
          p.lead {
            font-size: 0.95rem;
            color: #e0e7ff;
            max-width: 50rem;
            margin-bottom: 1rem;
            line-height: 1.6;
          }
          .quick-links {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
            font-size: 0.85rem;
          }
          .quick-links a {
            color: #ffffff;
            text-decoration: underline;
            text-underline-offset: 3px;
            opacity: 0.95;
            transition: opacity 0.15s ease;
          }
          .quick-links a:hover {
            opacity: 1;
          }
          .content-body {
            padding: 2rem 2.5rem;
          }
          .stats-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 1rem;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 0.75rem;
            padding: 0.875rem 1.25rem;
            margin-bottom: 1.75rem;
            font-size: 0.9rem;
            color: #475569;
          }
          .stats-bar strong {
            color: #0f172a;
          }
          .back-link {
            font-size: 0.875rem;
            font-weight: 600;
            color: #2563eb;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
          }
          .back-link:hover {
            text-decoration: underline;
          }
          .table-wrapper {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            border: 1px solid #e2e8f0;
            border-radius: 0.75rem;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.875rem;
            text-align: left;
          }
          th {
            background-color: #f8fafc;
            color: #475569;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 0.875rem 1.25rem;
            border-bottom: 1px solid #cbd5e1;
            white-space: nowrap;
          }
          td {
            padding: 0.875rem 1.25rem;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
          }
          tr:nth-child(even) {
            background-color: #fafbfc;
          }
          tr:hover {
            background-color: #f0f7ff;
          }
          a.item-link {
            color: #2563eb;
            font-weight: 500;
            text-decoration: none;
            word-break: break-all;
          }
          a.item-link:hover {
            color: #1d4ed8;
            text-decoration: underline;
          }
          .date-cell {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 0.8rem;
            color: #64748b;
            white-space: nowrap;
          }
          .footer-bar {
            padding: 1.25rem 2.5rem;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            font-size: 0.825rem;
            color: #64748b;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 0.75rem;
          }
          .footer-bar a {
            color: #2563eb;
            text-decoration: none;
          }
          .footer-bar a:hover {
            text-decoration: underline;
          }
          @media (max-width: 768px) {
            body {
              padding: 0.75rem 0.5rem;
            }
            .header-banner {
              padding: 1.5rem 1.25rem;
            }
            .content-body {
              padding: 1.25rem 1rem;
            }
            .footer-bar {
              padding: 1rem 1.25rem;
            }
            h1 {
              font-size: 1.5rem;
            }
            th, td {
              padding: 0.75rem 0.875rem;
            }
          }
        </style>
      </head>
      <body>
        <div class="page-card">
          <div class="header-banner">
            <div class="badge-row">
              <span class="network-badge">TOP NEPALI TYPING</span>
            </div>
            <h1>XML Sitemap</h1>
            <p class="lead">
              This is the official XML sitemap for Top Nepali Typing, provided to assist search engine crawlers (Google, Bing, Yahoo) in discovering and indexing typing tests, conversion tools, and guides.
            </p>
            <div class="quick-links">
              <a href="https://typing.topnepali.com">Typing Home</a>
              <span>&#8226;</span>
              <a href="https://topnepali.com">Top Nepali Home</a>
              <span>&#8226;</span>
              <a href="https://topnepali.com/sitemap.xml">Network Sitemap Index</a>
              <span>&#8226;</span>
              <a href="https://sitemaps.org" target="_blank" rel="noopener">About XML Sitemaps</a>
            </div>
          </div>
          
          <div class="content-body">
            <!-- Sitemap Index View -->
            <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &gt; 0">
              <div class="stats-bar">
                <span>This Sitemap Index contains <strong><xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/></strong> sub-sitemaps.</span>
              </div>
              <div class="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th style="width: 75%;">Sitemap Resource</th>
                      <th style="width: 25%;">Last Modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                      <xsl:variable name="sitemapURL">
                        <xsl:value-of select="sitemap:loc"/>
                      </xsl:variable>
                      <tr>
                        <td>
                          <a class="item-link" href="{$sitemapURL}">
                            <xsl:value-of select="sitemap:loc"/>
                          </a>
                        </td>
                        <td class="date-cell">
                          <xsl:choose>
                            <xsl:when test="string-length(sitemap:lastmod) &gt; 10">
                              <xsl:value-of select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))"/>
                            </xsl:when>
                            <xsl:otherwise>
                              <xsl:value-of select="sitemap:lastmod"/>
                            </xsl:otherwise>
                          </xsl:choose>
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </div>
            </xsl:if>

            <!-- URL Set View -->
            <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &lt; 1">
              <div class="stats-bar">
                <span>This Sitemap contains <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> indexed URLs.</span>
                <a href="https://topnepali.com/sitemap.xml" class="back-link">&#8592; Network Sitemap Index</a>
              </div>
              <div class="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th style="width: 75%;">URL Location</th>
                      <th style="width: 25%;">Last Modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="sitemap:urlset/sitemap:url">
                      <xsl:variable name="itemURL">
                        <xsl:value-of select="sitemap:loc"/>
                      </xsl:variable>
                      <tr>
                        <td>
                          <a class="item-link" href="{$itemURL}">
                            <xsl:value-of select="sitemap:loc"/>
                          </a>
                        </td>
                        <td class="date-cell">
                          <xsl:choose>
                            <xsl:when test="string-length(sitemap:lastmod) &gt; 10">
                              <xsl:value-of select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))"/>
                            </xsl:when>
                            <xsl:otherwise>
                              <xsl:value-of select="sitemap:lastmod"/>
                            </xsl:otherwise>
                          </xsl:choose>
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </div>
            </xsl:if>
          </div>

          <div class="footer-bar">
            <span>Top Nepali Typing &#8226; Free Online Typing Tests &amp; Tools</span>
            <span><a href="https://typing.topnepali.com">typing.topnepali.com</a></span>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
