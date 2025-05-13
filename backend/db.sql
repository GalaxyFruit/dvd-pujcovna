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

CREATE TRIGGER produkt_change_audit
AFTER INSERT OR DELETE ON produkt
FOR EACH ROW
EXECUTE FUNCTION log_produkt_changes();

CREATE OR REPLACE FUNCTION log_produkt_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO produkt_log (produkt_id, nazev, akce, cas, provedl)
        VALUES (NEW.id, NEW.nazev, 'INSERT', now(), NULL);
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO produkt_log (produkt_id, nazev, akce, cas, provedl)
        VALUES (OLD.id, OLD.nazev, 'DELETE', now(), NULL);
    END IF;
    RETURN NULL; -- AFTER trigger, návratová hodnota se ignoruje
END;
$$ LANGUAGE plpgsql;

CREATE TABLE produkt_log (
    id SERIAL PRIMARY KEY,
    produkt_id INTEGER,
    nazev VARCHAR(255),
    akce VARCHAR(10) NOT NULL,         -- 'INSERT' nebo 'DELETE'
    cas TIMESTAMP NOT NULL DEFAULT now(),
    provedl INTEGER                    -- id uživatele, volitelně
);
