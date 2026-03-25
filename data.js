'use strict';

/* ============================================================
   CHANNEL METADATA
   ============================================================ */
const CHANNEL_META = {
  email: {
    id: 'email',
    label: 'E-mail',
    emoji: '✉'
  },
  pocztaPolska: {
    id: 'pocztaPolska',
    label: 'Poczta Polska',
    emoji: '📮'
  },
  bok: {
    id: 'bok',
    label: 'BOK',
    emoji: '🏢'
  }
};

/* ============================================================
   CASE TYPES (typy spraw / umów)
   ============================================================ */
const CASE_TYPES = [
  { id: 'internet', label: 'Internet',     icon: '🌐' },
  { id: 'tv',       label: 'Telewizja',    icon: '📺' },
  { id: 'phone',    label: 'Telefon',      icon: '📞' },
  { id: 'bundle',   label: 'Pakiet Multi', icon: '📦' }
];

/* ============================================================
   LEGEND
   ============================================================ */
const LEGEND_ITEMS = [
  {
    channel: 'email',
    label: 'E-mail',
    description: 'Korespondencja elektroniczna'
  },
  {
    channel: 'pocztaPolska',
    label: 'Poczta Polska',
    description: 'List polecony / korespondencja papierowa'
  },
  {
    channel: 'bok',
    label: 'BOK',
    description: 'Biuro Obsługi Klienta — wizyta osobista'
  }
];

/* ============================================================
   PROCEDURES — drzewo decyzyjne
   ============================================================ */
const PROCEDURES = {

  /* ── E-MAIL ─────────────────────────────────────────────── */
  email: {
    id: 'email',
    label: 'E-mail',
    description: 'Wypowiedzenie przesłane drogą elektroniczną',
    channel: 'email',
    sublevel: [
      {
        id: 'email-confirmed',
        label: 'Klient potwierdził odbiór odpowiedzi',
        result: {
          title: 'Wypowiedzenie e-mail — odbiór potwierdzony',
          channel: 'email',
          deadline: '30 dni roboczych',
          status: 'Kompletna',
          statusClass: 'status--ok',
          description: 'Klient przesłał wypowiedzenie drogą elektroniczną i potwierdził otrzymanie naszej odpowiedzi. Procedura jest kompletna — należy zarejestrować sprawę i zamknąć ticket w systemie.',
          steps: [
            { n: 1, text: 'Zarejestruj wypowiedzenie w systemie CRM jako „Otrzymane".' },
            { n: 2, text: 'Zweryfikuj poprawność danych klienta i numeru umowy.' },
            { n: 3, text: 'Wyślij potwierdzenie odbioru na adres e-mail klienta.' },
            { n: 4, text: 'Ustaw datę rozwiązania umowy zgodnie z warunkami i OWU.', important: true },
            { n: 5, text: 'Przekaż sprawę do działu rozliczeń.' },
            { n: 6, text: 'Zamknij ticket z adnotacją „E-mail — potwierdzony".' }
          ],
          templateChannel: 'email'
        }
      },
      {
        id: 'email-notconfirmed',
        label: 'Klient nie potwierdził odbioru odpowiedzi',
        result: {
          title: 'Wypowiedzenie e-mail — brak potwierdzenia odbioru',
          channel: 'email',
          deadline: '7 dni roboczych (oczekiwanie)',
          status: 'Wymagana akcja',
          statusClass: 'status--warn',
          description: 'Klient przesłał wypowiedzenie e-mailem, ale nie potwierdził otrzymania naszej odpowiedzi. Wymagane podjęcie działań uzupełniających zgodnie z poniższą procedurą.',
          steps: [
            { n: 1, text: 'Zarejestruj wypowiedzenie w systemie CRM jako „Oczekujące".' },
            { n: 2, text: 'Wyślij ponowne potwierdzenie odbioru na adres e-mail klienta.', important: true },
            { n: 3, text: 'Odczekaj 7 dni roboczych na odpowiedź klienta.' },
            { n: 4, text: 'Jeśli brak odpowiedzi — podejmij próbę kontaktu telefonicznego.', important: true },
            { n: 5, text: 'W przypadku braku jakiegokolwiek kontaktu — zastosuj procedurę Poczty Polskiej.' },
            { n: 6, text: 'Udokumentuj wszystkie podjęte kroki w tickecie CRM.' }
          ],
          templateChannel: 'email'
        }
      }
    ]
  },

  /* ── POCZTA POLSKA ──────────────────────────────────────── */
  pocztaPolska: {
    id: 'pocztaPolska',
    label: 'Poczta Polska',
    description: 'List polecony lub korespondencja papierowa',
    channel: 'pocztaPolska',
    sublevel: [
      {
        id: 'poczta-polecony',
        label: 'List polecony — odbiór potwierdzony zwrotką',
        result: {
          title: 'List polecony — odbiór potwierdzony',
          channel: 'pocztaPolska',
          deadline: '30 dni roboczych',
          status: 'Kompletna',
          statusClass: 'status--ok',
          description: 'Wypowiedzenie wpłynęło listem poleconym z potwierdzeniem odbioru. Dokument jest wiążący prawnie od daty odbioru wskazanej na zwrotce.',
          steps: [
            { n: 1, text: 'Zeskanuj i zarchiwizuj oryginał dokumentu wraz ze zwrotką pocztową.' },
            { n: 2, text: 'Wprowadź datę odbioru ze zwrotki jako oficjalną datę doręczenia.', important: true },
            { n: 3, text: 'Zarejestruj w systemie CRM z oznaczeniem „Poczta — polecony".' },
            { n: 4, text: 'Wyślij potwierdzenie drogą elektroniczną, jeśli dostępny adres e-mail klienta.' },
            { n: 5, text: 'Ustaw termin rozwiązania umowy od daty odbioru wynikającej ze zwrotki.' },
            { n: 6, text: 'Przekaż do działu prawnego, jeśli dokument budzi wątpliwości formalne.' }
          ],
          templateChannel: null
        }
      },
      {
        id: 'poczta-awizo',
        label: 'Awizo — list nieodebrany przez adresata',
        result: {
          title: 'Awizo — korespondencja nieodebrana',
          channel: 'pocztaPolska',
          deadline: '14 dni (termin awizo)',
          status: 'Oczekiwanie',
          statusClass: 'status--pending',
          description: 'Korespondencja wysłana do klienta wróciła z awizo. Klient nie odebrał przesyłki w wyznaczonym terminie. Stosuje się zasadę fikcji doręczenia.',
          steps: [
            { n: 1, text: 'Odnotuj datę pierwszego awizo w systemie CRM.' },
            { n: 2, text: 'Sprawdź, czy upłynął 14-dniowy termin odbioru przesyłki.', important: true },
            { n: 3, text: 'Po upływie terminu zastosuj fikcję doręczenia: data ostatniego awizo = data doręczenia.', important: true },
            { n: 4, text: 'Zarchiwizuj kopertę z awizo jako dowód próby doręczenia.' },
            { n: 5, text: 'Zaktualizuj status w CRM na „Doręczone — fikcja prawna".' },
            { n: 6, text: 'Poinformuj dział prawny o zastosowaniu fikcji doręczenia.' }
          ],
          templateChannel: null
        }
      },
      {
        id: 'poczta-zwrot',
        label: 'List zwrócony — adres nieaktualny lub nieznany',
        result: {
          title: 'List zwrócony — adres nieaktualny',
          channel: 'pocztaPolska',
          deadline: 'Wymaga weryfikacji',
          status: 'Wymaga akcji',
          statusClass: 'status--warn',
          description: 'Przesyłka wróciła do Multiplay z adnotacją „adresat nieznany" lub „adres nieaktualny". Konieczna weryfikacja danych adresowych klienta przed ponowną wysyłką.',
          steps: [
            { n: 1, text: 'Zarchiwizuj zwróconą kopertę z datą zwrotu i adnotacją poczty.' },
            { n: 2, text: 'Zweryfikuj adres klienta w systemie CRM oraz dostępnych bazach.', important: true },
            { n: 3, text: 'Skontaktuj się z klientem telefonicznie lub e-mailem, aby zaktualizować adres.', important: true },
            { n: 4, text: 'Po aktualizacji danych — wyślij ponownie listem poleconym za potwierdzeniem odbioru.' },
            { n: 5, text: 'Jeśli brak kontaktu przez 14 dni roboczych — eskalacja do działu prawnego.' },
            { n: 6, text: 'Odnotuj wszystkie podjęte kroki z datami w tickecie CRM.' }
          ],
          templateChannel: null
        }
      }
    ]
  },

  /* ── BOK ────────────────────────────────────────────────── */
  bok: {
    id: 'bok',
    label: 'BOK',
    description: 'Złożone bezpośrednio w Biurze Obsługi Klienta',
    channel: 'bok',
    sublevel: [
      {
        id: 'bok-osobiscie',
        label: 'Złożone osobiście przez klienta',
        result: {
          title: 'BOK — złożone osobiście przez klienta',
          channel: 'bok',
          deadline: '30 dni roboczych',
          status: 'Kompletna',
          statusClass: 'status--ok',
          description: 'Klient złożył wypowiedzenie bezpośrednio w Biurze Obsługi Klienta. Tożsamość klienta została potwierdzona przez pracownika BOK w trakcie wizyty.',
          steps: [
            { n: 1, text: 'Zweryfikuj tożsamość klienta na podstawie dokumentu tożsamości.', important: true },
            { n: 2, text: 'Przyjmij oryginał wypowiedzenia i ostempluj datą wpływu.' },
            { n: 3, text: 'Wydaj klientowi kopię z pieczęcią jako potwierdzenie złożenia dokumentu.' },
            { n: 4, text: 'Wprowadź do CRM: datę złożenia oraz imię i nazwisko pracownika przyjmującego.' },
            { n: 5, text: 'Zeskanuj i zarchiwizuj oryginał dokumentu w systemie.' },
            { n: 6, text: 'Ustaw termin rozwiązania umowy od daty złożenia dokumentu.' }
          ],
          templateChannel: 'bok'
        }
      },
      {
        id: 'bok-pelnomocnik',
        label: 'Złożone przez pełnomocnika klienta',
        result: {
          title: 'BOK — złożone przez pełnomocnika',
          channel: 'bok',
          deadline: '30 dni roboczych',
          status: 'Wymaga weryfikacji',
          statusClass: 'status--warn',
          description: 'Wypowiedzenie złożono przez osobę działającą w imieniu klienta. Wymagana staranna weryfikacja zakresu pełnomocnictwa przed przyjęciem dokumentu.',
          steps: [
            { n: 1, text: 'Zweryfikuj tożsamość pełnomocnika na podstawie dokumentu tożsamości.', important: true },
            { n: 2, text: 'Sprawdź oryginał lub notarialnie poświadczoną kopię pełnomocnictwa.', important: true },
            { n: 3, text: 'Upewnij się, że pełnomocnictwo obejmuje wypowiedzenie umowy z Multiplay.' },
            { n: 4, text: 'Przyjmij wypowiedzenie i ostempluj datą wpływu.' },
            { n: 5, text: 'Wprowadź do CRM z adnotacją „Pełnomocnik" oraz danymi osoby upoważnionej.' },
            { n: 6, text: 'Przekaż kopię dokumentacji do działu prawnego w ciągu 24 godzin.', important: true }
          ],
          templateChannel: 'bok'
        }
      }
    ]
  }

};

/* ============================================================
   MESSAGE TEMPLATES
   templateChannel: 'email' | 'bok' | null
   null = brak szablonu elektronicznego dla tej ścieżki
   ============================================================ */
const MESSAGE_TEMPLATES = {

  email: {
    internet: {
      subject: 'Potwierdzenie otrzymania wypowiedzenia umowy — usługa Internet',
      body: `Szanowny/a Kliencie,

niniejszym potwierdzamy otrzymanie Państwa wypowiedzenia umowy o świadczenie usług internetowych.

Wypowiedzenie zostało zarejestrowane w naszym systemie dnia [DATA WPŁYWU].
Umowa zostanie rozwiązana z dniem [DATA ROZWIĄZANIA], zgodnie z obowiązującym okresem wypowiedzenia określonym w OWU.

W razie jakichkolwiek pytań prosimy o kontakt z Biurem Obsługi Klienta.

Z wyrazami szacunku,
Dział Obsługi Klienta
Multiplay Sp. z o.o.`
    },
    tv: {
      subject: 'Potwierdzenie otrzymania wypowiedzenia umowy — usługa Telewizja',
      body: `Szanowny/a Kliencie,

potwierdzamy przyjęcie Państwa wypowiedzenia umowy na świadczenie usług telewizyjnych.

Data rejestracji wypowiedzenia: [DATA WPŁYWU]
Planowana data rozwiązania umowy: [DATA ROZWIĄZANIA]

Uprzejmie informujemy o konieczności zwrotu sprzętu dekodującego w terminie 14 dni od daty rozwiązania umowy.

W razie pytań zapraszamy do kontaktu.

Z wyrazami szacunku,
Dział Obsługi Klienta
Multiplay Sp. z o.o.`
    },
    phone: {
      subject: 'Potwierdzenie otrzymania wypowiedzenia umowy — usługa Telefon',
      body: `Szanowny/a Kliencie,

potwierdzamy otrzymanie Państwa wypowiedzenia umowy na świadczenie usług telefonicznych.

Wypowiedzenie zarejestrowane: [DATA WPŁYWU]
Termin rozwiązania umowy: [DATA ROZWIĄZANIA]

Po rozwiązaniu umowy numer telefonu zostanie dezaktywowany lub przeniesiony zgodnie z Państwa dyspozycją.

Z wyrazami szacunku,
Dział Obsługi Klienta
Multiplay Sp. z o.o.`
    },
    bundle: {
      subject: 'Potwierdzenie otrzymania wypowiedzenia umowy — Pakiet Multi',
      body: `Szanowny/a Kliencie,

potwierdzamy otrzymanie Państwa wypowiedzenia umowy zawartej w ramach Pakietu Multi.

Wypowiedzenie zarejestrowane: [DATA WPŁYWU]
Planowana data rozwiązania: [DATA ROZWIĄZANIA]

Zwracamy uwagę, że wypowiedzenie dotyczy wszystkich usług objętych pakietem. Jeśli chcą Państwo zachować wybrane usługi, prosimy o kontakt z naszym BOK przed datą rozwiązania umowy.

Z wyrazami szacunku,
Dział Obsługi Klienta
Multiplay Sp. z o.o.`
    }
  },

  bok: {
    internet: {
      subject: 'Potwierdzenie przyjęcia wypowiedzenia w BOK — usługa Internet',
      body: `Szanowny/a Kliencie,

potwierdzamy przyjęcie w naszym Biurze Obsługi Klienta Państwa wypowiedzenia umowy o świadczenie usług internetowych.

Data złożenia dokumentu: [DATA WPŁYWU]
Pracownik przyjmujący: [IMIĘ I NAZWISKO PRACOWNIKA]
Planowana data rozwiązania umowy: [DATA ROZWIĄZANIA]

Kopia potwierdzenia złożenia dokumentu została przekazana klientowi w dniu wizyty.

Z wyrazami szacunku,
Dział Obsługi Klienta
Multiplay Sp. z o.o.`
    },
    tv: {
      subject: 'Potwierdzenie przyjęcia wypowiedzenia w BOK — usługa Telewizja',
      body: `Szanowny/a Kliencie,

potwierdzamy przyjęcie w Biurze Obsługi Klienta Państwa wypowiedzenia umowy na świadczenie usług telewizyjnych.

Data złożenia dokumentu: [DATA WPŁYWU]
Pracownik przyjmujący: [IMIĘ I NAZWISKO PRACOWNIKA]
Planowana data rozwiązania: [DATA ROZWIĄZANIA]

Prosimy o zwrot sprzętu dekodującego w ciągu 14 dni od daty rozwiązania umowy.

Z wyrazami szacunku,
Dział Obsługi Klienta
Multiplay Sp. z o.o.`
    },
    phone: {
      subject: 'Potwierdzenie przyjęcia wypowiedzenia w BOK — usługa Telefon',
      body: `Szanowny/a Kliencie,

potwierdzamy przyjęcie w Biurze Obsługi Klienta Państwa wypowiedzenia umowy telefonicznej.

Data złożenia: [DATA WPŁYWU]
Pracownik: [IMIĘ I NAZWISKO PRACOWNIKA]
Data rozwiązania: [DATA ROZWIĄZANIA]

Z wyrazami szacunku,
Dział Obsługi Klienta
Multiplay Sp. z o.o.`
    },
    bundle: {
      subject: 'Potwierdzenie przyjęcia wypowiedzenia w BOK — Pakiet Multi',
      body: `Szanowny/a Kliencie,

potwierdzamy przyjęcie w Biurze Obsługi Klienta Państwa wypowiedzenia umowy Pakietu Multi.

Data złożenia: [DATA WPŁYWU]
Pracownik: [IMIĘ I NAZWISKO PRACOWNIKA]
Planowana data rozwiązania: [DATA ROZWIĄZANIA]

Wypowiedzenie obejmuje wszystkie usługi objęte pakietem.

Z wyrazami szacunku,
Dział Obsługi Klienta
Multiplay Sp. z o.o.`
    }
  },

  /* Poczta Polska — brak szablonu elektronicznego */
  pocztaPolska: null

};
