let countries = [];
let timeoutId;

fetch("https://restcountries.com/v3.1/independent?status=true")
    .then(response => response.json())
    .then(data => {
        countries = data;
    })
    .catch(() => {
        document.querySelector(".error").textContent = "Не вдалося завантажити країни.";
    });

document.querySelector("input").addEventListener("input", (e) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        const countryName = e.target.value.trim();
        document.querySelector(".error").textContent = "";
        document.querySelector(".country").innerHTML = "";
        document.querySelector(".answer").innerHTML = "";

        const matched = countries.filter(obj =>
            obj.name.common.toLowerCase().startsWith(countryName.toLowerCase())
        );

        if (matched.length === 0) {
            document.querySelector(".error").textContent = "Країну не знайдено.";
        } else if (matched.length === 1) {
            fetch(`https://restcountries.com/v3.1/name/${matched[0].name.common}`)
                .then(response => response.json())
                .then(data => {
                    document.querySelector(".country").innerHTML = makeDiv(data[0]);
                })
        } else if (matched.length <= 10) {
            const names = matched.map(obj => `<p>${obj.name.common}</p>`).join('');
            document.querySelector(".answer").innerHTML = names;
        } else {
            document.querySelector(".error").textContent = "Забагато збігів. Уточніть запит.";
        }
    }, 500); 
});

function makeDiv(obj) {
    return `
        <h2>${obj.name.common}</h2>
        <p><strong>Capital:</strong> ${obj.capital ? obj.capital.join(', ') : 'N/A'}</p>
        <p><strong>Languages:</strong> ${obj.languages ? Object.values(obj.languages).join(', ') : 'N/A'}</p>
        <img src="${obj.flags.png}" alt="Flag of ${obj.name.common}" width="150">
    `;
}
