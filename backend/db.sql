-- Role
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    nazev VARCHAR(50) NOT NULL
);

-- Uživatele
CREATE TABLE uzivatel (
    id SERIAL PRIMARY KEY,
    jmeno VARCHAR(100) NOT NULL,
    role_id INTEGER REFERENCES role(id)
);

-- Produkty (např. DVD)
CREATE TABLE produkt (
    id SERIAL PRIMARY KEY,
    nazev VARCHAR(255) NOT NULL,
    popis TEXT,
    dostupnost BOOLEAN DEFAULT true
);

-- Poznámky od uživatelů
CREATE TABLE poznamka (
    id SERIAL PRIMARY KEY,
    uzivatel_id INTEGER REFERENCES uzivatel(id),
    produkt_id INTEGER REFERENCES produkt(id),
    text TEXT NOT NULL
);

-- Vložit základní role
INSERT INTO role (nazev) VALUES ('admin'), ('zakaznik');

-- Vložit testovacího admina a zákazníka
INSERT INTO uzivatel (jmeno, role_id) VALUES
('AdminUser', 1),
('ZakaznikUser', 2);

-- Vložit testovací produkty
INSERT INTO produkt (nazev, popis) VALUES
('Tanec s vlky', 'Oscarový western s Kevinem Costnerem'),
('Pán prstenů', 'Fantasy trilogie od Petera Jacksona');