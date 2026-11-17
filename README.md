# Maina's Pishori: bulk order landing page

Pure Mwea Pishori rice, KSh 180 per kg. All orders go to WhatsApp: +254 794 372 117.

## Folder
- `index.html`: page structure and content (hero, About, FAQs, Terms and conditions, calculator, order section)
- `css/styles.css`: all styling, light and dark mode, responsive
- `js/script.js`: WhatsApp links, price calculator and the chat assistant
- `assets/fonts/sikat.woff`: Sikat headline font (letters only)
- `assets/images/`: rice photos
- `.nojekyll`: lets GitHub Pages serve the files as they are

## Publish on GitHub Pages
1. Create a free account at github.com, then **New repository**. Name it `mainas-pishori` and set it to **Public**.
2. Click **uploading an existing file** and drag in everything inside this folder (the `css`, `js` and `assets` folders too, plus `index.html` and `.nojekyll`). Click **Commit changes**.
3. Go to **Settings > Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
4. After 1 to 2 minutes the site is live at `https://YOUR-USERNAME.github.io/mainas-pishori/`.

## Edit things
- Price: search for `180` in `index.html` and `PRICE` in `js/script.js`.
- WhatsApp number: search for `254794372117` in `js/script.js`.
- Chat assistant answers: edit the `KB` list in `js/script.js`.
- FAQs and terms: edit the `faq` and `terms` sections in `index.html`.

## Font licence
Sikat is licensed for personal use only. Buy the commercial licence at https://dumadistyle.com/license before using this page for your business.
