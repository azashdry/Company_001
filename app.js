/* =========================================================
   ESTATEPRO V1
   MAIN APPLICATION
   NO ES MODULE
========================================================= */


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {

    apiKey: "AIzaSyAE44DxNnqz3m8ScqaZxoSj2FdQ7aJ2NIg",

    authDomain: "estate-pro-d564b.firebaseapp.com",

    projectId: "estate-pro-d564b",

    storageBucket: "estate-pro-d564b.firebasestorage.app",

    messagingSenderId: "600309829118",

    appId: "1:600309829118:web:60c61624ca8cdf05e884af",

    measurementId: "G-TG60FCJHXB"

};


/* =========================================================
   INITIALIZE FIREBASE
========================================================= */

let db = null;

try {

    firebase.initializeApp(firebaseConfig);

    db = firebase.firestore();

    console.log("EstatePro: Firebase connected successfully.");

} catch (error) {

    console.error(
        "EstatePro: Firebase initialization error:",
        error
    );

}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupMobileMenu();

        setupSearch();

        setupCurrentYear();

        loadCompanySettings();

        loadFeaturedProperties();

    }
);


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

    const menuToggle =
        document.getElementById("menuToggle");

    const mainNav =
        document.getElementById("mainNav");


    if (!menuToggle || !mainNav) {
        return;
    }


    menuToggle.addEventListener(
        "click",
        function () {

            const isOpen =
                mainNav.classList.toggle("open");


            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    const links =
        mainNav.querySelectorAll("a");


    links.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

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
   SEARCH
========================================================= */

function setupSearch() {

    const form =
        document.getElementById(
            "homeSearchForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const locationElement =
                document.getElementById(
                    "searchLocation"
                );


            const typeElement =
                document.getElementById(
                    "searchType"
                );


            const purposeElement =
                document.getElementById(
                    "searchPurpose"
                );


            const location =
                locationElement
                    ? locationElement.value.trim()
                    : "";


            const type =
                typeElement
                    ? typeElement.value
                    : "";


            const purpose =
                purposeElement
                    ? purposeElement.value
                    : "";


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


            const queryString =
                params.toString();


            const url =
                queryString
                    ? "properties.html?" + queryString
                    : "properties.html";


            window.location.href = url;

        }
    );

}


/* =========================================================
   CURRENT YEAR
========================================================= */

function setupCurrentYear() {

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
   COMPANY SETTINGS
========================================================= */

async function loadCompanySettings() {

    if (!db) {
        return;
    }


    try {

        const snapshot =
            await db
                .collection("settings")
                .limit(1)
                .get();


        if (snapshot.empty) {

            console.warn(
                "EstatePro: settings collection is empty."
            );

            return;

        }


        const data =
            snapshot.docs[0].data();


        /* COMPANY */

        setText(
            "companyName",
            data.companyName
        );


        setText(
            "footerCompanyName",
            data.companyName
        );


        setText(
            "copyrightCompany",
            data.companyName
        );


        /* DESCRIPTION */

        setText(
            "heroDescription",
            data.heroDescription
        );


        setText(
            "whyDescription",
            data.aboutShort
        );


        setText(
            "footerDescription",
            data.description
        );


        setText(
            "footerAddress",
            data.address
        );


        /* CONTACT */

        setupPhone(
            data.phone
        );


        setupWhatsApp(
            data.whatsapp
        );


        setupEmail(
            data.email
        );


        /* LOGO */

        updateBrand(
            data.companyName,
            data.logo
        );


        /* SEO */

        updateSEO(
            data.companyName,
            data.description,
            data.logo
        );


        console.log(
            "EstatePro: Company settings loaded."
        );


    } catch (error) {

        console.error(
            "EstatePro: Company settings error:",
            error
        );

    }

}


/* =========================================================
   FEATURED PROPERTIES
========================================================= */

async function loadFeaturedProperties() {

    const container =
        document.getElementById(
            "featuredProperties"
        );


    if (!container) {
        return;
    }


    if (!db) {

        console.error(
            "EstatePro: Firestore is not available."
        );

        return;

    }


    try {

        const snapshot =
            await db
                .collection("properties")
                .where(
                    "featured",
                    "==",
                    true
                )
                .limit(6)
                .get();


        if (snapshot.empty) {

            showNoFeaturedProperties(
                container
            );

            return;

        }


        container.innerHTML = "";


        snapshot.forEach(
            function (doc) {

                const property =
                    doc.data();


                const card =
                    createPropertyCard(
                        doc.id,
                        property
                    );


                container.appendChild(
                    card
                );

            }
        );


        console.log(
            "EstatePro: Featured properties loaded."
        );


    } catch (error) {

        console.error(
            "EstatePro: Properties error:",
            error
        );


        showPropertiesError(
            container
        );

    }

}


/* =========================================================
   PROPERTY CARD
========================================================= */

function createPropertyCard(
    id,
    property
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "property-card";


    const image =
        property.image ||
        property.imageUrl ||
        property.photo ||
        "";


    const title =
        property.title ||
        property.name ||
        "Property";


    const location =
        property.location ||
        property.address ||
        "Location not specified";


    const type =
        property.type ||
        "Property";


    const purpose =
        property.purpose ||
        "";


    const price =
        property.price ||
        "Contact for price";


    let imageHTML;


    if (image) {

        imageHTML = `

            <img
                src="${escapeHTML(image)}"
                alt="${escapeHTML(title)}"
                loading="lazy"
            >

        `;

    } else {

        imageHTML = `

            <div class="image-placeholder">
                Property image
            </div>

        `;

    }


    const purposeHTML =
        purpose
            ? `
                <span>
                    ${escapeHTML(purpose)}
                </span>
            `
            : "";


    article.innerHTML = `

        <div class="property-image">

            ${imageHTML}

            <span class="property-status">
                Featured
            </span>

        </div>


        <div class="property-content">

            <h3>
                ${escapeHTML(title)}
            </h3>


            <p class="property-location">
                ${escapeHTML(location)}
            </p>


            <div class="property-meta">

                <span>
                    ${escapeHTML(type)}
                </span>

                ${purposeHTML}

            </div>


            <div class="property-bottom">

                <strong>
                    ${escapeHTML(
                        formatPrice(price)
                    )}
                </strong>


                <a
                    href="property-details.html?id=${encodeURIComponent(id)}"
                >
                    View Property
                </a>

            </div>

        </div>

    `;


    return article;

}


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {

    if (
        price === null ||
        price === undefined ||
        String(price).trim() === ""
    ) {

        return "Contact for price";

    }


    if (
        typeof price === "number" &&
        Number.isFinite(price)
    ) {

        return (
            "₦" +
            price.toLocaleString("en-NG")
        );

    }


    return String(price);

}


/* =========================================================
   NO FEATURED PROPERTIES
========================================================= */

function showNoFeaturedProperties(
    container
) {

    container.innerHTML = `

        <article class="property-card">

            <div class="property-image">

                <div class="image-placeholder">
                    No featured properties yet
                </div>

            </div>


            <div class="property-content">

                <h3>
                    No Featured Properties
                </h3>

                <p class="property-location">
                    Featured listings will appear here.
                </p>


                <div class="property-bottom">

                    <strong>
                        Explore
                    </strong>

                    <a href="properties.html">
                        View Properties
                    </a>

                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   PROPERTY ERROR
========================================================= */

function showPropertiesError(
    container
) {

    container.innerHTML = `

        <article class="property-card">

            <div class="property-image">

                <div class="image-placeholder">
                    Unable to load properties
                </div>

            </div>


            <div class="property-content">

                <h3>
                    Properties Unavailable
                </h3>

                <p class="property-location">
                    Please try again later.
                </p>


                <div class="property-bottom">

                    <a href="properties.html">
                        View Properties
                    </a>

                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   SET TEXT
========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (!element) {
        return;
    }


    if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
    ) {

        return;

    }


    element.textContent =
        String(value);

}


/* =========================================================
   BRAND
========================================================= */

function updateBrand(
    name,
    logo
) {

    if (name) {

        setText(
            "companyName",
            name
        );


        setText(
            "footerCompanyName",
            name
        );


        setText(
            "copyrightCompany",
            name
        );

    }


    if (logo) {

        setBrandLogo(
            "brandMark",
            logo
        );


        setBrandLogo(
            "footerBrandMark",
            logo
        );

    }

}


/* =========================================================
   LOGO
========================================================= */

function setBrandLogo(
    id,
    logo
) {

    const element =
        document.getElementById(id);


    if (!element) {
        return;
    }


    element.innerHTML = "";


    const image =
        document.createElement(
            "img"
        );


    image.src =
        logo;


    image.alt =
        "Company Logo";


    image.style.width =
        "100%";


    image.style.height =
        "100%";


    image.style.objectFit =
        "contain";


    image.style.borderRadius =
        "inherit";


    image.onerror =
        function () {

            element.textContent =
                "E";

        };


    element.appendChild(
        image
    );

}


/* =========================================================
   PHONE
========================================================= */

function setupPhone(phone) {

    if (!phone) {
        return;
    }


    const link =
        document.getElementById(
            "footerPhone"
        );


    if (!link) {
        return;
    }


    const value =
        String(phone).trim();


    link.href =
        "tel:" + value;


    link.textContent =
        value;

}


/* =========================================================
   WHATSAPP
========================================================= */

function setupWhatsApp(number) {

    if (!number) {
        return;
    }


    let cleanNumber =
        String(number)
            .replace(/\D/g, "");


    if (
        cleanNumber.startsWith("0") &&
        cleanNumber.length === 11
    ) {

        cleanNumber =
            "234" +
            cleanNumber.substring(1);

    }


    if (!cleanNumber) {
        return;
    }


    const url =
        "https://wa.me/" +
        cleanNumber;


    const nav =
        document.getElementById(
            "navWhatsApp"
        );


    const footer =
        document.getElementById(
            "footerWhatsApp"
        );


    const floating =
        document.getElementById(
            "floatingWhatsApp"
        );


    if (nav) {
        nav.href = url;
    }


    if (footer) {
        footer.href = url;
    }


    if (floating) {
        floating.href = url;
    }

}


/* =========================================================
   EMAIL
========================================================= */

function setupEmail(email) {

    if (!email) {
        return;
    }


    const link =
        document.getElementById(
            "footerEmail"
        );


    if (!link) {
        return;
    }


    const value =
        String(email).trim();


    link.href =
        "mailto:" + value;


    link.textContent =
        value;

}


/* =========================================================
   SEO
========================================================= */

function updateSEO(
    companyName,
    description,
    logo
) {

    const name =
        companyName ||
        "EstatePro";


    const desc =
        description ||
        "Find houses, apartments, lands and commercial properties.";


    const title =
        name +
        " | Find Your Next Property";


    document.title =
        title;


    const pageDescription =
        document.getElementById(
            "pageDescription"
        );


    if (pageDescription) {

        pageDescription.content =
            desc;

    }


    const ogTitle =
        document.getElementById(
            "ogTitle"
        );


    if (ogTitle) {

        ogTitle.content =
            title;

    }


    const ogDescription =
        document.getElementById(
            "ogDescription"
        );


    if (ogDescription) {

        ogDescription.content =
            desc;

    }


    const ogImage =
        document.getElementById(
            "ogImage"
        );


    if (
        ogImage &&
        logo
    ) {

        ogImage.content =
            logo;

    }

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}