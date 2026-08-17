/* =========================================================
   ESTATEPRO - MAIN APP.JS
   ========================================================= */


/* =========================================================
   FIREBASE CONFIG
   ========================================================= */

const firebaseConfig = {

    apiKey:
        "AIzaSyAE44DxNnqz3m8ScqaZxoSj2FdQ7aJ2NIg",

    authDomain:
        "estate-pro-d564b.firebaseapp.com",

    projectId:
        "estate-pro-d564b",

    storageBucket:
        "estate-pro-d564b.firebasestorage.app",

    messagingSenderId:
        "600309829118",

    appId:
        "1:600309829118:web:60c61624ca8cdf05e884af",

    measurementId:
        "G-TG60FCJHXB"
};


/* =========================================================
   FIREBASE VARIABLES
   ========================================================= */

let firebaseApp = null;
let db = null;
let firebaseFirestore = null;


/* =========================================================
   INITIALIZE FIREBASE
   ========================================================= */

async function initFirebase() {

    if (db) {
        return db;
    }

    try {

        const firebase =
            await import(
                "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js"
            );

        firebaseFirestore =
            await import(
                "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js"
            );


        const existingApps =
            firebase.getApps();


        if (existingApps.length > 0) {

            firebaseApp =
                existingApps[0];

        } else {

            firebaseApp =
                firebase.initializeApp(
                    firebaseConfig
                );

        }


        db =
            firebaseFirestore.getFirestore(
                firebaseApp
            );


        console.log(
            "EstatePro: Firebase initialized."
        );


        return db;


    } catch (error) {

        console.error(
            "EstatePro Firebase initialization error:",
            error
        );

        return null;

    }

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function initMobileMenu() {

    const menuToggle =
        document.getElementById(
            "menuToggle"
        );

    const mainNav =
        document.getElementById(
            "mainNav"
        );


    if (!menuToggle || !mainNav) {
        return;
    }


    menuToggle.addEventListener(
        "click",
        () => {

const isOpen =
    mainNav.classList.toggle(
        "open"
    );


            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    const navLinks =
        mainNav.querySelectorAll(
            "a"
        );


    navLinks.forEach(
        (link) => {

            link.addEventListener(
                "click",
                () => {

mainNav.classList.remove(
    "open"
);

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        }
    );

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function initNavigation() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );


    navLinks.forEach(
        (link) => {

            const href =
                link.getAttribute(
                    "href"
                );


            if (!href) {
                return;
            }


            const linkPage =
                href
                    .split("?")[0]
                    .split("/")
                    .pop()
                    .toLowerCase();


            if (
                linkPage === currentPage ||
                (
                    currentPage === "" &&
                    linkPage === "index.html"
                )
            ) {

                link.classList.add(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   WHATSAPP
   ========================================================= */

async function initWhatsApp() {

    const navWhatsapp =
        document.getElementById(
            "navWhatsapp"
        );


    if (!navWhatsapp) {
        return;
    }


    try {

        const database =
            await initFirebase();


        if (!database) {
            return;
        }


        const companyRef =
            firebaseFirestore.doc(
                database,
                "CompanySettings",
                "main"
            );


        const snapshot =
            await firebaseFirestore.getDoc(
                companyRef
            );


        if (!snapshot.exists()) {
            return;
        }


        const data =
            snapshot.data();


        if (!data.companyWhatsApp) {
            return;
        }


        const number =
            String(
                data.companyWhatsApp
            ).replace(
                /\D/g,
                ""
            );


        if (!number) {
            return;
        }


        navWhatsapp.href =
            "https://wa.me/" +
            number;


        navWhatsapp.target =
            "_blank";


        navWhatsapp.rel =
            "noopener";


    } catch (error) {

        console.error(
            "EstatePro WhatsApp error:",
            error
        );

    }

}


/* =========================================================
   SEARCH
   ========================================================= */

function initSearch() {

    const searchButton =
        document.getElementById(
            "searchButton"
        );


    if (!searchButton) {
        return;
    }


    searchButton.addEventListener(
        "click",
        () => {

            const location =
                document.getElementById(
                    "searchLocation"
                )?.value.trim();


            const type =
                document.getElementById(
                    "searchType"
                )?.value;


            const purpose =
                document.getElementById(
                    "searchStatus"
                )?.value;


            const params =
                new URLSearchParams();


            if (location) {

                params.set(
                    "location",
                    location
                );

            }


            if (type) {

                params.set(
                    "type",
                    type
                );

            }


            if (purpose) {

                params.set(
                    "purpose",
                    purpose
                );

            }


            const query =
                params.toString();


            window.location.href =
                "properties.html" +
                (
                    query
                        ? "?" + query
                        : ""
                );

        }
    );

}


/* =========================================================
   CURRENT YEAR
   ========================================================= */

function initCurrentYear() {

    const year =
        document.getElementById(
            "currentYear"
        );


    if (year) {

        year.textContent =
            new Date().getFullYear();

    }

}


/* =========================================================
   LOAD FEATURED PROPERTIES
   ========================================================= */

async function loadFeaturedProperties() {

    const container =
        document.getElementById(
            "featuredProperties"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="property-loading">
            Loading properties...
        </div>
    `;


    const database =
        await initFirebase();


    if (!database) {

        showPropertyMessage(
            container,
            "Unable to connect to the property database."
        );

        return;

    }


    try {

        const propertiesRef =
            firebaseFirestore.collection(
                database,
                "Properties"
            );


        const snapshot =
            await firebaseFirestore.getDocs(
                propertiesRef
            );


        if (snapshot.empty) {

            showPropertyMessage(
                container,
                "No properties available yet."
            );

            return;

        }


        container.innerHTML = "";


        let count = 0;


        snapshot.forEach(
            (propertyDoc) => {

                const property = {

                    id:
                        propertyDoc.id,

                    ...propertyDoc.data()

                };


                /*
                 * Show properties added
                 * from Admin/Firebase.
                 */

                const card =
                    createPropertyCard(
                        property
                    );


                container.appendChild(
                    card
                );


                count++;

            }
        );


        if (count === 0) {

            showPropertyMessage(
                container,
                "No properties available yet."
            );

        }


    } catch (error) {

        console.error(
            "EstatePro: Error loading properties:",
            error
        );


        showPropertyMessage(
            container,
            "Unable to load properties."
        );

    }

}


/* =========================================================
   CREATE PROPERTY CARD
   ========================================================= */

function createPropertyCard(
    property
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "property-card";


    const image =
        getPropertyValue(
            property,
            [
                "imageUrl",
                "imageURL",
                "image",
                "propertyImage",
                "propertyImageUrl"
            ],
            ""
        );


    const title =
        getPropertyValue(
            property,
            [
                "title",
                "name",
                "propertyName"
            ],
            "Property"
        );


    const location =
        getPropertyValue(
            property,
            [
                "location",
                "address",
                "city"
            ],
            "Location not specified"
        );


    const price =
        getPropertyValue(
            property,
            [
                "price",
                "propertyPrice"
            ],
            ""
        );


    const status =
        getPropertyValue(
            property,
            [
                "status",
                "purpose"
            ],
            "For Sale"
        );


    const type =
        getPropertyValue(
            property,
            [
                "type",
                "propertyType"
            ],
            ""
        );


    const bedrooms =
        getPropertyValue(
            property,
            [
                "bedrooms",
                "beds",
                "bed"
            ],
            ""
        );


    const bathrooms =
        getPropertyValue(
            property,
            [
                "bathrooms",
                "baths",
                "bath"
            ],
            ""
        );


    const area =
        getPropertyValue(
            property,
            [
                "area",
                "size",
                "squareMeters"
            ],
            ""
        );


    let imageHTML = "";


    if (image) {

        imageHTML = `
            <img
                src="${escapeHTML(image)}"
                alt="${escapeHTML(title)}"
                loading="lazy"
                onerror="this.style.display='none';"
            >
        `;

    } else {

        imageHTML = `
            <div class="image-placeholder">
                Property Image
            </div>
        `;

    }


    const metaItems = [];


    if (bedrooms !== "") {

        metaItems.push(
            `
            <span>
                🛏 ${escapeHTML(
                    String(bedrooms)
                )} Beds
            </span>
            `
        );

    }


    if (bathrooms !== "") {

        metaItems.push(
            `
            <span>
                🛁 ${escapeHTML(
                    String(bathrooms)
                )} Baths
            </span>
            `
        );

    }


    if (area !== "") {

        metaItems.push(
            `
            <span>
                📐 ${escapeHTML(
                    String(area)
                )}
            </span>
            `
        );

    }


    if (type !== "") {

        metaItems.push(
            `
            <span>
                🏠 ${escapeHTML(
                    String(type)
                )}
            </span>
            `
        );

    }


    const detailsURL =
        "properties.html?id=" +
        encodeURIComponent(
            property.id
        );


    article.innerHTML = `

        <div class="property-image">

            ${imageHTML}

            <span class="property-status">
                ${escapeHTML(
                    String(status)
                )}
            </span>

        </div>


        <div class="property-content">

            <h3>
                ${escapeHTML(
                    String(title)
                )}
            </h3>


            <p class="property-location">
                📍 ${escapeHTML(
                    String(location)
                )}
            </p>


            ${
                metaItems.length
                    ? `
                    <div class="property-meta">
                        ${metaItems.join("")}
                    </div>
                    `
                    : ""
            }


            <div class="property-bottom">

                <strong>
                    ${formatPrice(price)}
                </strong>


                <a
                    href="${detailsURL}"
                    class="property-view"
                >
                    View Details
                </a>

            </div>

        </div>

    `;


    return article;

}


/* =========================================================
   GET PROPERTY VALUE
   ========================================================= */

function getPropertyValue(
    property,
    possibleNames,
    fallback = ""
) {

    for (
        const name of possibleNames
    ) {

        if (
            property[name] !== undefined &&
            property[name] !== null &&
            property[name] !== ""
        ) {

            return property[name];

        }

    }


    return fallback;

}


/* =========================================================
   FORMAT PRICE
   ========================================================= */

function formatPrice(
    price
) {

    if (
        price === null ||
        price === undefined ||
        price === ""
    ) {

        return "Price on request";

    }


    if (
        typeof price === "number"
    ) {

        return (
            "₦" +
            price.toLocaleString(
                "en-NG"
            )
        );

    }


    const numericPrice =
        Number(
            String(price).replace(
                /,/g,
                ""
            )
        );


    if (
        !Number.isNaN(
            numericPrice
        )
    ) {

        return (
            "₦" +
            numericPrice.toLocaleString(
                "en-NG"
            )
        );

    }


    return escapeHTML(
        String(price)
    );

}


/* =========================================================
   PROPERTY MESSAGE
   ========================================================= */

function showPropertyMessage(
    container,
    message
) {

    container.innerHTML = `

        <div
            class="property-empty"
            style="
                width:100%;
                text-align:center;
                padding:40px 20px;
            "
        >

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

    `;

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(
    value
) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   IMAGE FALLBACKS
   ========================================================= */

function setupImageFallbacks() {

    const images =
        document.querySelectorAll(
            "img"
        );


    images.forEach(
        (image) => {

            image.addEventListener(
                "error",
                () => {

                    /*
                     * Don't hide company logos
                     * if they have not loaded yet.
                     */

                    if (
                        image.id ===
                            "companyLogo" ||
                        image.id ===
                            "footerCompanyLogo"
                    ) {

                        return;

                    }


                    image.style.display =
                        "none";

                }
            );

        }
    );

}


/* =========================================================
   LOAD COMPANY SETTINGS
   ========================================================= */

async function loadCompanySettings() {

    try {

        const database =
            await initFirebase();


        if (!database) {

            console.error(
                "EstatePro: Firebase database not initialized."
            );

            return;

        }


        const companyRef =
            firebaseFirestore.doc(
                database,
                "CompanySettings",
                "main"
            );


        const snapshot =
            await firebaseFirestore.getDoc(
                companyRef
            );


        if (!snapshot.exists()) {

            console.warn(
                "EstatePro: CompanySettings/main does not exist."
            );

            return;

        }


        const data =
            snapshot.data();


        console.log(
            "EstatePro: Company settings loaded."
        );


        /* =================================================
           COMPANY NAME
        ================================================= */

        const companyName =
            document.getElementById(
                "companyName"
            );


        if (companyName) {

            companyName.textContent =
                data.companyName ||
                "EstatePro";

        }


        const footerCompanyName =
            document.getElementById(
                "footerCompanyName"
            );


        if (footerCompanyName) {

            footerCompanyName.textContent =
                data.companyName ||
                "EstatePro";

        }


        /* =================================================
           LOGO
        ================================================= */

        const logo =
            document.getElementById(
                "companyLogo"
            );


        const logoLetter =
            document.getElementById(
                "companyLogoLetter"
            );


        const footerLogo =
            document.getElementById(
                "footerCompanyLogo"
            );


        const footerLogoLetter =
            document.getElementById(
                "footerCompanyLogoLetter"
            );


        if (data.companyLogo) {

            if (logo) {

                logo.src =
                    data.companyLogo;

                logo.style.display =
                    "block";

            }


            if (logoLetter) {

                logoLetter.style.display =
                    "none";

            }


            if (footerLogo) {

                footerLogo.src =
                    data.companyLogo;

                footerLogo.style.display =
                    "block";

            }


            if (footerLogoLetter) {

                footerLogoLetter.style.display =
                    "none";

            }

        }


        /* =================================================
           DESCRIPTION
        ================================================= */

        const description =
            document.getElementById(
                "companyDescription"
            );


        if (description) {

            description.textContent =
                data.companyDescription ||
                "";

        }


        /* =================================================
           PHONE
        ================================================= */

        const phone =
            document.getElementById(
                "companyPhone"
            );


        if (
            phone &&
            data.companyPhone
        ) {

            phone.textContent =
                data.companyPhone;


            phone.href =
                "tel:" +
                String(
                    data.companyPhone
                );

        }


        /* =================================================
           EMAIL
        ================================================= */

        const email =
            document.getElementById(
                "companyEmail"
            );


        if (
            email &&
            data.companyEmail
        ) {

            email.textContent =
                data.companyEmail;


            email.href =
                "mailto:" +
                String(
                    data.companyEmail
                );

        }


        /* =================================================
           ADDRESS
        ================================================= */

        const address =
            document.getElementById(
                "companyAddress"
            );


        if (
            address &&
            data.companyAddress
        ) {

            address.textContent =
                data.companyAddress;

        }


        /* =================================================
           WHATSAPP
        ================================================= */

        const whatsapp =
            document.getElementById(
                "companyWhatsApp"
            );


        if (
            whatsapp &&
            data.companyWhatsApp
        ) {

            const number =
                String(
                    data.companyWhatsApp
                ).replace(
                    /\D/g,
                    ""
                );


            if (number) {

                whatsapp.href =
                    "https://wa.me/" +
                    number;


                whatsapp.target =
                    "_blank";


                whatsapp.rel =
                    "noopener";

            }

        }


        /* =================================================
           WEBSITE
        ================================================= */

        const website =
            document.getElementById(
                "companyWebsite"
            );


        if (
            website &&
            data.website
        ) {

            website.href =
                data.website;


            website.target =
                "_blank";


            website.rel =
                "noopener";

        }


        /* =================================================
           SOCIAL MEDIA
           
           Intentionally NOT displayed.
           Your current index.html does not contain
           social-media elements.
        ================================================= */


    } catch (error) {

        console.error(
            "EstatePro: Failed to load company settings:",
            error
        );

    }

}


/* =========================================================
   START APPLICATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "EstatePro: Application starting..."
        );


        initMobileMenu();

        initNavigation();

        initSearch();

        initCurrentYear();

        setupImageFallbacks();


        /*
         * These are async, but we call them
         * from an async DOMContentLoaded callback.
         */

        await loadCompanySettings();

        await initWhatsApp();

        await loadFeaturedProperties();


        console.log(
            "EstatePro: Application ready."
        );

    }
);