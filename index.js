function calcularChecksumCrudo(str){
    const encoder = new TextEncoder();
    const cadenaConCaracteresEspeciales = replaceKeywordsWithChars(str);
    const bytes = encoder.encode(cadenaConCaracteresEspeciales);

    let resultado = 0;
    for (const b of bytes) {
        resultado = (resultado + b) % 256;
    }

    return resultado;
}

function calcularChecksumDecimal(str) {
    return calcularChecksumCrudo(str).toString(10).padStart(3, '0').toUpperCase();
}

function calcChecksumHexadecimal(str) {
    return calcularChecksumCrudo(str).toString(16).padStart(2, '0').toUpperCase();
}

function replaceKeywordsWithChars(str) {
    return str.replace(/\[(STX|ETX|ETB|ACK|NAK|CR|LF)\]/g, (match) => {
        const code = checksumControlChars[match];
        return String.fromCharCode(code);
    });
}
const checksumControlChars = {
    '[STX]': 0x02,
    '[ETX]': 0x03,
    '[ETB]': 0x17,
    '[ACK]': 0x06,
    '[NAK]': 0x15,
    '[CR]': 0x0D,
    '[LF]': 0x0A,
};

const keywords = [ '[STX]', '[ETX]', '[ETB]', '[ACK]', '[NAK]', '[CR]', '[LF]'];

document.addEventListener('DOMContentLoaded', () => {
    const editable = document.getElementById('editable');
    const outputHex = document.querySelector('input.hex');
    const outputDec = document.querySelector('input.dec');

    editable.addEventListener('input', () => {
        const text = getPlainTextFromHtml(editable.innerHTML);
        editable.innerHTML = highlightKeywords(text);
        placeCaretAtEnd(editable);
        outputHex.value = calcChecksumHexadecimal(text);
        outputDec.value = calcularChecksumDecimal(text);
    });
});

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightKeywords(text) {
    let escaped = escapeHtml(text);
    for (const kw of keywords) {
        const re = new RegExp(kw.replace(/[\[\]]/g, '\\$&'), 'g');
        escaped = escaped.replace(re, `<mark>${kw}</mark>`);
    }
    return escaped;
}

function getPlainTextFromHtml(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
}

function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
}
