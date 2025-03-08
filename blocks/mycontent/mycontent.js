import { fetchPlaceholders, getMetadata } from '../../scripts/aem.js';

const placeholders = await fetchPlaceholders(getMetadata("locale"));
const { abbreviation, capital, continent, countries } = placeholders;

async function createTableHeader(table) {
    let tr = document.createElement("tr");

    const headers = [
        { key: "countries", text: countries || "Country" },
        { key: "continent", text: continent || "Continent" },
        { key: "capital", text: capital || "Capital" },
        { key: "abbreviation", text: abbreviation || "Abbreviation" }
    ];

    headers.forEach(({ text }) => {
        let th = document.createElement("th");
        th.textContent = text;
        tr.appendChild(th);
    });

    table.appendChild(tr);
}

async function createTableRow(table, row) {
    let tr = document.createElement("tr");

    const columns = [
        { key: "Country", text: row.Country || "-" },
        { key: "Continent", text: row.Continent || "-" },
        { key: "Capital", text: row.Capital || "-" },
        { key: "Abbreviation", text: row.Abbreviation || "-" }
    ];

    columns.forEach(({ text }) => {
        let td = document.createElement("td");
        td.textContent = text;
        tr.appendChild(td);
    });

    table.appendChild(tr);
}

async function createTable(jsonURL) {
    let pathname = new URL(jsonURL).pathname;

    try {
        const resp = await fetch(pathname);
        const json = await resp.json();

        console.log("=====JSON=====>", json);

        const table = document.createElement('table');
        createTableHeader(table);

        json.data.forEach((row) => {
            createTableRow(table, row);
        });

        return table;
    } catch (error) {
        console.error("Error fetching JSON data:", error);
    }
}

export default async function decorate(block) {
    const countryLink = block.querySelector('a[href$=".json"]');
    if (!countryLink) return;

    const parentDiv = document.createElement('div');
    parentDiv.classList.add('mycontent-block');

    parentDiv.appendChild(await createTable(countryLink.href));
    countryLink.replaceWith(parentDiv);
}
