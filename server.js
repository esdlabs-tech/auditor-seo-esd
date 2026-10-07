const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');
const { URL } = require('url');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/api/audit', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'La URL es requerida' });
    }

    let targetUrl;
    try {
        targetUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch (error) {
        return res.status(400).json({ error: 'URL inválida' });
    }

    try {
        const startTime = Date.now();
        const response = await axios.get(targetUrl.href, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000 
        });
        const ttfb = Date.now() - startTime;
        
        const html = response.data;
        const $ = cheerio.load(html);
        
        // 1. Title
        const titleText = $('title').text() || '';
        const titleLength = titleText.length;
        let titleStatus = 'Pobre';
        if (titleLength >= 50 && titleLength <= 60) titleStatus = 'Óptimo';
        else if (titleLength > 0 && titleLength < 50) titleStatus = 'Muy corto';
        else if (titleLength > 60) titleStatus = 'Muy largo';

        // 2. Meta description
        const metaDesc = $('meta[name="description"]').attr('content') || '';
        const metaDescLength = metaDesc.length;
        let metaDescStatus = 'Pobre';
        if (metaDescLength >= 150 && metaDescLength <= 160) metaDescStatus = 'Óptimo';
        else if (metaDescLength > 0 && metaDescLength < 150) metaDescStatus = 'Muy corto';
        else if (metaDescLength > 160) metaDescStatus = 'Muy largo';

        // 3. H1
        const h1s = $('h1');
        const h1Count = h1s.length;
        const h1Text = h1Count > 0 ? h1s.first().text().trim() : 'No encontrado';
        
        // 4. H2
        const h2Texts = [];
        $('h2').each((i, el) => {
            h2Texts.push($(el).text().trim());
        });

        // 5. Content length
        // Remover scripts y estilos para un conteo aproximado de palabras
        $('script, style, noscript').remove();
        const textContent = $('body').text().replace(/\s+/g, ' ').trim();
        const wordCount = textContent.split(' ').filter(word => word.length > 0).length;

        // 6. Internal links
        let internalLinksCount = 0;
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href) {
                if (href.startsWith('/') && !href.startsWith('//')) {
                    internalLinksCount++;
                } else if (href.includes(targetUrl.hostname)) {
                    internalLinksCount++;
                }
            }
        });

        // 7. Images without alt
        const imagesWithoutAltUrls = [];
        let imagesWithoutAltCount = 0;
        $('img').each((i, el) => {
            const alt = $(el).attr('alt');
            if (!alt || alt.trim() === '') {
                imagesWithoutAltCount++;
                if (imagesWithoutAltUrls.length < 5) {
                    const src = $(el).attr('src');
                    if (src) {
                        try {
                             imagesWithoutAltUrls.push(new URL(src, targetUrl.href).href);
                        } catch(e) {
                             imagesWithoutAltUrls.push(src);
                        }
                    }
                }
            }
        });

        // 8. Canonical
        const canonical = $('link[rel="canonical"]').attr('href') || 'No encontrado';

        // 9. Basic Indexing
        const robotsMeta = $('meta[name="robots"]').attr('content') || '';
        const isNoIndex = robotsMeta.toLowerCase().includes('noindex');
        const indexingStatus = isNoIndex ? 'No indexable (contiene noindex)' : 'Indexable por defecto';

        const results = {
            url: targetUrl.href,
            ttfb: ttfb,
            title: {
                content: titleText,
                length: titleLength,
                status: titleStatus
            },
            metaDescription: {
                content: metaDesc,
                length: metaDescLength,
                status: metaDescStatus
            },
            h1: {
                content: h1Text,
                count: h1Count
            },
            h2: h2Texts,
            content: {
                wordCount: wordCount,
                isShort: wordCount < 300
            },
            links: {
                internalCount: internalLinksCount
            },
            images: {
                withoutAltCount: imagesWithoutAltCount,
                sampleUrls: imagesWithoutAltUrls
            },
            canonical: canonical,
            indexing: {
                status: indexingStatus,
                isNoIndex: isNoIndex
            }
        };

        res.json(results);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al analizar la URL. Asegúrate de que es una URL pública y válida.', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de Auditor SEO Rápido ejecutándose en el puerto ${PORT}`);
});
