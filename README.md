# Catholic Medical Association of Lubbock (CMA Lubbock)

Official website for the **Catholic Medical Association of Lubbock, Texas**, serving Catholic physicians, nurses, residents, and healthcare students across the South Plains and West Texas.


---

## 🏛 Historical Heritage Restored & Modernized
* **Physician's Prayer:** The full *Prayer of the Catholic Physician* bestowed by Pope Saint John Paul II (Vatican, June 29, 2000).
* **Guild Pioneers:** Honors the founding Lubbock clinicians:
  * Dr. Kenneth E. Kruczek (Cardiology)
  * Dr. Benny Phillips (Obstetrics & Gynecology)
  * Dr. Gary Simmons (Interventional & Diagnostic Radiology)
* **Events & Traditions:** Annual White Mass (Feast of St. Luke), Bioethics dinners, and student fellowship with Texas Tech University Health Sciences Center (TTUHSC).
* **Local Provider Directory:** Filterable by specialty (Cardiology, OB/GYN, Pathology, Family & Internal Medicine, Pediatrics).
* **Accessible Membership & Inquiries:** Modern, accessible contact form for membership and referral inquiries.

---

## 🚀 How to View Locally

Simply open `index.html` in your web browser, or launch a quick local web server:

```bash
# Using Python
python3 -m http.server 8000

# Or using npx
npx serve .
```

Then visit [http://localhost:8000](http://localhost:8000).

---

## 🌐 Free Hosting & Porkbun Connection Guide

You can host this website completely free with an automatic SSL certificate using either **GitHub Pages** or **Cloudflare Pages**.

### Method 1: GitHub Pages (Recommended, Free Forever)
1. Push this folder to a GitHub repository (e.g., `cmalubbock`).
2. In GitHub, go to **Settings > Pages**.
3. Under **Build and deployment**, set Source to `Deploy from a branch` and select `main`.
4. Under **Custom domain**, enter `lubbockcma.org`.
5. In your **Porkbun** account:
   * Click **DNS** next to your domain.
   * Add CNAME: `www` pointing to `<your-username>.github.io`
   * Add ALIAS/ANAME: `@` pointing to `<your-username>.github.io`

### Method 2: Cloudflare Pages
1. Connect your repository to [Cloudflare Pages](https://pages.cloudflare.com).
2. Set Build command to empty, output folder to `.`.
3. Add custom domain in Cloudflare Pages settings.
