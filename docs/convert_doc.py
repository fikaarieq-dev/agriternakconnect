import markdown
import re

# Read markdown file
with open('tugas_8_perencanaan.md', 'r', encoding='utf-8') as f:
    text = f.read()

# Convert markdown to html with tables extension
html_body = markdown.markdown(text, extensions=['tables', 'fenced_code'])

# Handle Mermaid code blocks specifically for CDN rendering
html_body = re.sub(
    r'<pre><code class="language-mermaid">(.*?)</code></pre>',
    r'<div class="mermaid">\1</div>',
    html_body,
    flags=re.DOTALL
)

# Also replace raw html code tags that might be encoded
def clean_mermaid(match):
    code = match.group(1)
    code = code.replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&').replace('quot;', '"')
    return f'<div class="mermaid">{code}</div>'

html_body = re.compile(r'<div class="mermaid">(.*?)</div>', re.DOTALL).sub(clean_mermaid, html_body)

# Let's add styling
html_style = """<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Perencanaan Teknis &amp; Sprint 1 - AgriTernak Connect</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'default' });
    </script>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: #ffffff;
        }
        h1, h2, h3, h4 {
            color: #0f172a;
            font-weight: 700;
        }
        h1 {
            font-size: 24px;
            text-align: center;
            border-bottom: 2px solid #52b788;
            padding-bottom: 12px;
            margin-bottom: 24px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        h2 {
            font-size: 18px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
            margin-top: 32px;
            color: #2d6a4f;
        }
        h3 {
            font-size: 15px;
            margin-top: 20px;
            color: #1b4332;
        }
        p {
            font-size: 14px;
            margin-bottom: 16px;
            text-align: justify;
        }
        ul, ol {
            font-size: 14px;
            margin-bottom: 16px;
            padding-left: 20px;
        }
        li {
            margin-bottom: 6px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 12px;
        }
        th, td {
            border: 1px solid #cbd5e1;
            padding: 10px 12px;
            text-align: left;
        }
        th {
            background-color: #f8fafc;
            font-weight: 600;
            color: #0f172a;
        }
        tr:nth-child(even) {
            background-color: #f8fafc;
        }
        img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            border: 1px solid #cbd5e1;
            margin: 16px 0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .mermaid {
            display: flex;
            justify-content: center;
            margin: 24px 0;
            background: #f8fafc;
            padding: 16px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        hr {
            border: 0;
            height: 1px;
            background: #e2e8f0;
            margin: 24px 0;
        }
        
        /* Print styling optimized for PDF export */
        @media print {
            body {
                padding: 0;
                margin: 0;
                font-size: 11pt;
            }
            h1 {
                font-size: 18pt;
            }
            h2 {
                font-size: 14pt;
                page-break-after: avoid;
            }
            h3 {
                font-size: 12pt;
                page-break-after: avoid;
            }
            table {
                page-break-inside: avoid;
                font-size: 9pt;
            }
            tr {
                page-break-inside: avoid;
            }
            img {
                page-break-inside: avoid;
                max-height: 80mm;
            }
            .mermaid {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
"""

html_footer = """
</body>
</html>
"""

full_html = html_style + html_body + html_footer

with open('tugas_8_perencanaan.html', 'w', encoding='utf-8') as f:
    f.write(full_html)

print("HTML generated successfully!")
