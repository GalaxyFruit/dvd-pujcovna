let uzivatel = null;

async function prihlasit() {
    const jmeno = document.getElementById('loginJmeno').value;

    const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jmeno })
    });

    uzivatel = await res.json();

    if (uzivatel.role_id === 1) {
        document.querySelector('.add-box').style.display = 'block'; // zobrazit admin panel
    }

    nactiProdukty();
}

async function nactiProdukty() {
    try {
        const res = await fetch('http://localhost:3000/produkty');
        const produkty = await res.json();

        const div = document.getElementById('produkty');
        div.innerHTML = '';

        if (produkty.length === 0) {
            div.innerHTML = '<p class="no-movies">Žádné filmy k dispozici</p>';
            return;
        }

        for (let p of produkty) {
            let html = `
                <div class="movie-item">
                    <div>
                        <h3>${p.nazev}</h3>
                        ${p.popis ? `<p>${p.popis}</p>` : ''}
                    </div>`;

            if (uzivatel && uzivatel.role_id === 1) {
                html += `<button class="delete-btn" onclick="smazat(${p.id})">Smazat</button>`;
            }

            html += `</div>`;
            div.innerHTML += html;
        }
    } catch (error) {
        console.error("Chyba při načítání:", error);
    }
}

async function pridatProdukt() {
    const nazev = document.getElementById('nazev').value;
    const popis = document.getElementById('popis').value;

    if (!nazev) {
        alert("Zadejte název filmu");
        return;
    }

    try {
        await fetch('http://localhost:3000/produkty', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nazev, popis, id: uzivatel.id })
        });

        document.getElementById('nazev').value = '';
        document.getElementById('popis').value = '';
        nactiProdukty();
    } catch (error) {
        console.error("Chyba při přidávání:", error);
    }
}

async function smazat(id) {
    if (!confirm("Opravdu chcete smazat tento film?")) return;

    try {
        await fetch(`http://localhost:3000/produkty/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: uzivatel.id }) // přidáno ID pro kontrolu admina
        });
        nactiProdukty();
    } catch (error) {
        console.error("Chyba při mazání:", error);
    }
}

nactiProdukty();
