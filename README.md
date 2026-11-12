# CommerceHub

A lightweight affiliate e-commerce storefront with a Firebase-powered admin area. Admins can manage products, homepage advertisements, and general website settings; visitors can browse published products and open the configured external purchase links.

## Project overview

- **Frontend:** HTML, Tailwind CSS (CDN), custom CSS, and vanilla JavaScript using ES modules.
- **Backend services:** Firebase Authentication, Cloud Firestore, and Firebase Storage.
- **Hosting configuration:** `vercel.json` configures clean URLs and disables trailing slashes. The project is a static frontend; no custom server/API is included in this repository.
- **UI libraries:** Font Awesome 6.4.0 and Tailwind CSS CDN.
- **Language:** The storefront and most admin pages use Bengali UI text, with some English labels.

## Repository structure

```text
commercehub-main/
├── index.html
├── vercel.json
├── README.md
├── admin/
│   ├── admin-panel.html
│   ├── login.html
│   ├── dashboard.html
│   ├── products.html
│   ├── advertisements.html
│   └── settings.html
└── assets/
    ├── Images/
    └── js/
        └── firebase.js
```

### Main files

| File | Purpose |
|---|---|
| `index.html` | Public storefront: category filters, desktop/mobile search, product cards, advertisement areas, site branding, and social links. |
| `admin/login.html` | Admin sign-in page using Firebase email/password authentication. |
| `admin/dashboard.html` | Admin dashboard and product-count summary. |
| `admin/products.html` | Product create, edit, delete, publish/disable, featured status, and image upload or image URL handling. |
| `admin/advertisements.html` | Management of four advertisement slots. |
| `admin/settings.html` | Website name, logo, footer text, and social-link settings. |
| `admin/admin-panel.html` | Additional admin-panel HTML page present in the repository. Review its purpose before linking it into the main navigation. |
| `assets/js/firebase.js` | Firebase initialization and shared authentication, Firestore product, and Storage helper functions. |
| `vercel.json` | Vercel URL behavior configuration. |

## Features currently implemented in the code

### Public storefront

- Displays products from the Firestore `products` collection.
- Only products with `status: true` are shown publicly.
- Orders products by `createdAt` (newest first).
- Supports category filtering and text search across product title and description.
- Displays product image, category, title, description, price, and a **Buy Now** link.
- Loads general website settings from `settings/general`.
- Loads four advertisement documents and displays active slots that have a script.
- Shows Facebook and Telegram links when configured.

### Admin area

- Signs in with Firebase Authentication email/password.
- Uses Firebase authentication-state listeners to redirect unauthenticated visitors from the main admin pages to the login page.
- Provides product management, including image upload to Firebase Storage.
- Provides four configurable advertisement slots.
- Saves general website settings to Firestore.

> The browser-side authentication checks improve the user experience, but they are not a substitute for database and Storage security rules. Enforce admin-only permissions in Firebase rules as described below.

## Firebase configuration

The Firebase project configuration is currently embedded in `assets/js/firebase.js`. The file initializes:

- Firebase Authentication
- Cloud Firestore
- Firebase Storage

The Firebase web configuration (including the API key) is designed to be present in client-side applications. It is **not** an admin credential or a private service-account key. Security must come from Firebase Authentication, Firestore Security Rules, Storage Rules, and appropriate Firebase project restrictions.

### Firebase services to enable

In the Firebase Console for the configured project:

1. Enable **Authentication → Email/Password**.
2. Create the intended administrator account(s) in Firebase Authentication.
3. Create/enable **Cloud Firestore**.
4. Enable **Cloud Storage** if product images will be uploaded as files.
5. Configure Firestore and Storage rules before making the site publicly available.

### Firestore data model used by the frontend

| Collection / document | Purpose | Fields referenced by the code |
|---|---|---|
| `products/{productId}` | Product catalogue | `title`, `category`, `price`, `buyNowUrl`, `description`, `imageUrl`, `status`, `featured`, `createdAt`, `updatedAt` |
| `settings/general` | Store-wide settings | `siteName`, `footerText`, `logoUrl`, `facebookUrl`, `telegramUrl` |
| `advertisements/slot_1` | Header advertisement | `name`, `script`, `status` |
| `advertisements/slot_2` | Homepage banner advertisement | `name`, `script`, `status` |
| `advertisements/slot_3` | Advertisement between product content | `name`, `script`, `status` |
| `advertisements/slot_4` | Footer advertisement | `name`, `script`, `status` |

Product documents are ordered using `createdAt`. Existing products should therefore have a valid timestamp in that field to appear in the expected order.

The product image upload helper stores files under the `products/` folder in Firebase Storage and returns a download URL, which is saved in the product document as `imageUrl`.

## Run locally

Because the project uses JavaScript ES modules and Firebase's remote module imports, open it through a local web server rather than directly using a `file://` URL.

For example, if Python is installed:

```bash
cd commercehub-main
python -m http.server 8000
```

Then open:

- Storefront: `http://localhost:8000/`
- Admin login: `http://localhost:8000/admin/login.html`

The Firebase project must be configured and the required services enabled for authentication, database reads/writes, and image uploads to work.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Set the project root directory to the directory containing `index.html` and `vercel.json` (if the repository itself contains the `commercehub-main` folder, select that folder as the root).
4. Use the static/no-build deployment configuration; there is no package manager or build script in this repository.
5. Deploy, then test the storefront and admin pages on the deployed domain.
6. Add the deployed domain to Firebase Authentication's **Authorized domains** list.

The included `vercel.json` only configures clean URLs and trailing-slash behavior. It does not create a backend or configure Firebase permissions.

## Important security and production-readiness notes

Before using this project with real users:

1. **Restrict Firestore writes.** Public visitors should only be able to read published product data and the settings/advertisement data needed by the storefront. Only authorized administrators should be able to create, update, or delete products, settings, and advertisement documents.
2. **Use an admin allowlist or custom claims.** The current frontend checks whether a user is signed in; a signed-in Firebase account is not automatically an administrator. Enforce administrator authorization in Firestore and Storage Rules, preferably with Firebase custom claims or a trusted admin allowlist.
3. **Restrict Storage uploads.** Allow uploads only for authorized admins, limit file size, and validate permitted image content types.
4. **Review advertisement HTML/script execution.** Advertisement scripts are inserted into the storefront using `innerHTML`. This executes trusted third-party markup/scripts and can create cross-site scripting risks. Only trusted admins should manage ad code; consider using a safer iframe/sandbox-based integration where possible.
5. **Validate product data.** Validate URLs, image URLs, prices, and required text before saving and before rendering. Only allow safe `https:` purchase URLs and image URLs.
6. **Avoid unsafe HTML interpolation.** Product and settings values are inserted into HTML in several places. Escape user-controlled text or build elements with DOM APIs and `textContent` to reduce XSS risk.
7. **Add operational safeguards.** Configure backups, monitoring, error handling, and a recovery process for administrator access.

Do not deploy permissive test rules such as unrestricted read/write access to Firestore or Storage.

## Current scope and limitations observed

- This repository contains a **frontend application**, not a custom PHP, Node.js, or Python backend.
- Product purchases are handled by opening the external `buyNowUrl`; there is no built-in checkout, payment processing, order management, or shipping workflow in the inspected code.
- No customer registration/account dashboard is implemented in the inspected pages.
- No automated affiliate commission tracking or reporting is visible in the inspected code.
- No build tooling, dependency manifest, automated tests, or CI workflow is included.
- The four ad slots store and render administrator-provided ad markup; ad-provider approval and third-party script behavior are outside this repository.

## Troubleshooting checklist

- **Admin login fails:** Confirm Email/Password is enabled, the admin account exists, and the current domain is in Firebase Authentication's authorized domains.
- **Products do not appear:** Check Firestore rules, the `products` collection, `status: true`, and the `createdAt` field.
- **Image upload fails:** Confirm Firebase Storage is enabled and Storage Rules allow the authenticated administrator to upload to `products/`.
- **Settings or ads do not load:** Check the `settings/general` and `advertisements/slot_1` through `slot_4` documents, browser console errors, and Firestore read permissions.
- **Deployed page cannot access Firebase:** Check the Firebase project configuration and authorized domains, then inspect the browser console and Firebase error details.

## Development notes

- Keep Firebase initialization and shared helpers in `assets/js/firebase.js`.
- Use ES module scripts for pages that import Firebase modules.
- When adding a new Firestore field, update both the admin form logic and the storefront rendering logic as appropriate.
- Test changes locally and on the deployed Vercel URL, including mobile layout and Firebase security rules.

---

**Project:** CommerceHub  
**Type:** Affiliate e-commerce storefront and Firebase admin panel  
**Deployment target:** Vercel (static frontend)
