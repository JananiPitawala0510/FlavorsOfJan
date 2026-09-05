import { getImageUrl } from "../services/recipeService";

const PAGE_WIDTH = 595.28; // A4 pt
const PAGE_HEIGHT = 841.89;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const FOREST = [63, 90, 51];
const GOLD = [168, 122, 30];
const INK = [51, 41, 27];
const INK_SOFT = [110, 96, 73];
const LINE = [230, 218, 192];

const sanitizeFilename = (title) => {
    const clean = (title || "Recipe")
        .trim()
        .replace(/[^a-z0-9]+/gi, "_")
        .replace(/^_+|_+$/g, "");
    return `${clean || "Recipe"}_Recipe.pdf`;
};

function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// Fetches the recipe photo and re-encodes it as a JPEG data URL via canvas so
// jsPDF always receives a format it understands (and a small file size),
// regardless of the original upload type (jpeg/png/webp/gif). Data URLs never
// taint a canvas, so this works even though the image is served cross-origin.
async function loadImageForPdf(imagePath) {
    const url = getImageUrl(imagePath);
    if (!url) return null;

    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const blob = await response.blob();
        const dataUrl = await blobToDataUrl(blob);

        const img = await new Promise((resolve, reject) => {
            const el = new Image();
            el.onload = () => resolve(el);
            el.onerror = reject;
            el.src = dataUrl;
        });

        const maxDimension = 1200;
        const scale = Math.min(1, maxDimension / Math.max(img.naturalWidth, img.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.naturalWidth * scale);
        canvas.height = Math.round(img.naturalHeight * scale);
        const ctx = canvas.getContext("2d");
        // Flatten any transparency onto white before JPEG-encoding (JPEG has no alpha channel)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        return {
            dataUrl: canvas.toDataURL("image/jpeg", 0.82),
            width: canvas.width,
            height: canvas.height,
        };
    } catch (err) {
        console.error("Could not load recipe image for PDF:", err);
        return null;
    }
}

function ensureSpace(doc, y, needed) {
    if (y + needed <= PAGE_HEIGHT - MARGIN) return y;
    doc.addPage();
    return MARGIN;
}

export async function downloadRecipePdf(recipe) {
    // Loaded on demand: jsPDF pulls in html2canvas/dompurify for a feature we
    // don't use, so keep that weight out of the main bundle until needed.
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const image = await loadImageForPdf(recipe.image_url);

    let y = MARGIN;

    // Header
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(2);
    doc.line(MARGIN, y, MARGIN + CONTENT_WIDTH, y);
    y += 28;

    doc.setFont("times", "bold");
    doc.setFontSize(24);
    doc.setTextColor(...INK);
    const titleLines = doc.splitTextToSize(recipe.title || "Untitled Recipe", CONTENT_WIDTH);
    doc.text(titleLines, MARGIN, y);
    y += titleLines.length * 26;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...INK_SOFT);
    doc.text(`Serves ${recipe.servings || "—"}  ·  FlavorsOfJan cooking journal`, MARGIN, y);
    y += 20;

    // Photo
    if (image) {
        const maxImgWidth = CONTENT_WIDTH;
        const maxImgHeight = 240;
        const ratio = Math.min(maxImgWidth / image.width, maxImgHeight / image.height, 1);
        const imgWidth = image.width * ratio;
        const imgHeight = image.height * ratio;
        const imgX = MARGIN + (CONTENT_WIDTH - imgWidth) / 2;

        y = ensureSpace(doc, y, imgHeight + 20);
        doc.addImage(image.dataUrl, "JPEG", imgX, y, imgWidth, imgHeight);
        doc.setDrawColor(...LINE);
        doc.setLineWidth(1);
        doc.rect(imgX, y, imgWidth, imgHeight);
        y += imgHeight + 26;
    }

    const sectionHeading = (label) => {
        y = ensureSpace(doc, y, 30);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(...FOREST);
        doc.text(label.toUpperCase(), MARGIN, y);
        doc.setDrawColor(...LINE);
        doc.setLineWidth(0.75);
        doc.line(MARGIN, y + 6, MARGIN + CONTENT_WIDTH, y + 6);
        y += 22;
    };

    // Ingredients
    sectionHeading("Ingredients");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...INK);

    if (recipe.ingredients?.length > 0) {
        recipe.ingredients.forEach((ing) => {
            const amount = [ing.quantity, ing.unit].filter(Boolean).join(" ");
            const line = `${ing.name}${amount ? `  —  ${amount}` : ""}`;
            const wrapped = doc.splitTextToSize(line, CONTENT_WIDTH - 16);
            y = ensureSpace(doc, y, wrapped.length * 15 + 4);
            doc.setFillColor(...GOLD);
            doc.circle(MARGIN + 3, y - 3.5, 2.2, "F");
            doc.text(wrapped, MARGIN + 14, y);
            y += wrapped.length * 15 + 4;
        });
    } else {
        doc.setTextColor(...INK_SOFT);
        doc.text("No ingredients added", MARGIN, y);
        y += 16;
    }

    y += 12;

    // Method
    sectionHeading("Method");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...INK);

    if (recipe.steps?.length > 0) {
        recipe.steps.forEach((step, idx) => {
            const text = step.instruction || step;
            const wrapped = doc.splitTextToSize(text, CONTENT_WIDTH - 24);
            y = ensureSpace(doc, y, wrapped.length * 15 + 8);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...FOREST);
            doc.text(`${idx + 1}.`, MARGIN, y);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...INK);
            doc.text(wrapped, MARGIN + 20, y);
            y += wrapped.length * 15 + 8;
        });
    } else {
        doc.setTextColor(...INK_SOFT);
        doc.text("No steps added", MARGIN, y);
    }

    // Footer on every page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...INK_SOFT);
        doc.text("FlavorsOfJan · a personal cooking journal", PAGE_WIDTH / 2, PAGE_HEIGHT - 28, {
            align: "center",
        });
        doc.text(`Page ${i} of ${pageCount}`, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 28, {
            align: "right",
        });
    }

    doc.save(sanitizeFilename(recipe.title));
}
