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
            div.innerHTML += `
                <div class="movie-item">
                    <div>
                        <h3>${p.nazev}</h3>
                        ${p.popis ? `<p>${p.popis}</p>` : ''}
                    </div>
                    <button class="delete-btn" onclick="smazat(${p.id})">Smazat</button>
                </div>`;
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
            body: JSON.stringify({ nazev, popis })
        });
        
        // Vyčistit formulář
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
        await fetch(`http://localhost:3000/produkty/${id}`, { method: 'DELETE' });
        nactiProdukty();
    } catch (error) {
        console.error("Chyba při mazání:", error);
    }
}

// Načteme filmy při načtení stránky
nactiProdukty();
