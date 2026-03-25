/**
 * data.js — Dane procedur i szablony wiadomości
 * Procedura potwierdzenia otrzymania wypowiedzenia
 *
 * templateChannel:
 *   "email" — szablon e-mail
 *   "sms"   — szablon SMS
 *   "mail"  — Poczta Polska / telefon stacjonarny (brak szablonu elektronicznego)
 *   "none"  — kopia formularza w BOK (brak szablonu)
 */

const PROCEDURES = {
  email: {
    label: "Na e-mail",
    options: [
      {
        id: "email-any",
        title: "Dowolne dane kontaktowe",
        icon: "📝",
        colorClass: "card--yellow",
        methodLabel: "E-mail",
        deadline: "1 dzień roboczy",
        templateChannel: "email",
        description:
          "Potwierdzenie wysyłane na adres e-mail, z którego klient przesłał wypowiedzenie — w ciągu 1 dnia roboczego od jego otrzymania.",
        steps: [
          "Przygotuj standardowe potwierdzenie otrzymania wypowiedzenia.",
          "Wyślij potwierdzenie na adres e-mail, z którego klient przesłał wypowiedzenie.",
          "Termin: do 1 dnia roboczego od otrzymania wiadomości.",
        ],
      },
    ],
  },

  poczta: {
    label: "Poczta Polska",
    options: [
      {
        id: "poczta-email",
        title: "Klient posiada e-mail",
        icon: "📧",
        colorClass: "card--yellow",
        methodLabel: "E-mail",
        deadline: "1 dzień roboczy",
        templateChannel: "email",
        description:
          "Potwierdzenie wysyłane na adres e-mail klienta w ciągu 1 dnia roboczego od otrzymania przesyłki pocztowej.",
        steps: [
          "Przygotuj potwierdzenie otrzymania wypowiedzenia.",
          "Wyślij wiadomość na adres e-mail klienta.",
          "Termin: do 1 dnia roboczego od otrzymania przesyłki.",
        ],
      },
      {
        id: "poczta-telkom",
        title: "Brak e-maila, jest tel. komórkowy",
        icon: "📱",
        colorClass: "card--yellow",
        methodLabel: "SMS",
        deadline: "1 dzień roboczy",
        templateChannel: "sms",
        description:
          "Potwierdzenie wysyłane SMS-em na numer telefonu komórkowego klienta w ciągu 1 dnia roboczego.",
        steps: [
          "Przygotuj treść SMS z potwierdzeniem otrzymania wypowiedzenia.",
          "Wyślij SMS na numer telefonu komórkowego klienta.",
          "Termin: do 1 dnia roboczego od otrzymania przesyłki.",
        ],
      },
      {
        id: "poczta-telstac",
        title: "Brak e-maila i tel. kom., jest tel. stacjonarny",
        icon: "☎️",
        colorClass: "card--yellow",
        methodLabel: "Telefon stacjonarny + Poczta Polska",
        deadline: "Do 14 dni",
        templateChannel: "mail",
        description:
          "Kontakt telefoniczny (do 3 prób). Niezależnie od wyniku rozmowy — potwierdzenie wysyłane listem Pocztą Polską jako trwały nośnik zgodnie z PKE.",
        steps: [
          "Wykonaj do 3 prób połączenia telefonicznego w celu potwierdzenia otrzymania.",
          "Jeśli kontakt telefoniczny jest nieskuteczny — przygotuj potwierdzenie pisemne.",
          "Niezależnie od wyniku rozmowy wyślij potwierdzenie Pocztą Polską (trwały nośnik zgodnie z PKE).",
          "Termin wysyłki pocztowej: do 14 dni od otrzymania wypowiedzenia.",
        ],
      },
      {
        id: "poczta-brak",
        title: "Brak danych elektronicznych",
        icon: "❌",
        colorClass: "card--yellow",
        methodLabel: "List Pocztą Polską",
        deadline: "Do 14 dni",
        templateChannel: "mail",
        description:
          "Brak danych kontaktowych elektronicznych — potwierdzenie wysyłane wyłącznie listem Pocztą Polską.",
        steps: [
          "Przygotuj potwierdzenie otrzymania wypowiedzenia w formie pisemnej.",
          "Wyślij potwierdzenie listem za pośrednictwem Poczty Polskiej.",
          "Termin: do 14 dni od otrzymania wypowiedzenia.",
        ],
      },
    ],
  },

  bok: {
    label: "Osobiście w BOK",
    options: [
      {
        id: "bok-tak",
        title: "Klient wypełnił formularz PKE",
        icon: "✅",
        colorClass: "card--orange",
        methodLabel: "Kopia formularza w BOK",
        deadline: "Od razu",
        templateChannel: "none",
        description:
          "Klient otrzymuje kopię uzupełnionego formularza bezpośrednio w BOK. Oryginał zostaje w dokumentacji.",
        steps: [
          "Poproś klienta o wypełnienie formularza zgodnego z PKE.",
          "Zachowaj oryginał formularza w dokumentacji BOK.",
          "Wręcz klientowi kopię formularza od razu.",
        ],
      },
      {
        id: "bok-nie-email",
        title: "Odmówił formularza, posiada e-mail",
        icon: "📧",
        colorClass: "card--orange",
        methodLabel: "E-mail",
        deadline: "1 dzień roboczy",
        templateChannel: "email",
        description:
          "Klient odmówił wypełnienia formularza — potwierdzenie wysyłane na jego adres e-mail w ciągu 1 dnia roboczego.",
        steps: [
          "Przyjmij wypowiedzenie mimo odmowy wypełnienia formularza.",
          "Przygotuj potwierdzenie otrzymania wypowiedzenia.",
          "Wyślij potwierdzenie na adres e-mail klienta.",
          "Termin: do 1 dnia roboczego od otrzymania.",
        ],
      },
      {
        id: "bok-nie-telkom",
        title: "Odmówił formularza, brak e-maila, jest tel. kom.",
        icon: "📱",
        colorClass: "card--orange",
        methodLabel: "SMS",
        deadline: "1 dzień roboczy",
        templateChannel: "sms",
        description:
          "Klient odmówił formularza i nie posiada e-maila — potwierdzenie wysyłane SMS-em w ciągu 1 dnia roboczego.",
        steps: [
          "Przyjmij wypowiedzenie mimo odmowy formularza.",
          "Przygotuj treść SMS z potwierdzeniem otrzymania.",
          "Wyślij SMS na numer telefonu komórkowego klienta.",
          "Termin: do 1 dnia roboczego od otrzymania.",
        ],
      },
      {
        id: "bok-nie-telstac",
        title: "Odmówił formularza, tylko tel. stacjonarny",
        icon: "☎️",
        colorClass: "card--orange",
        methodLabel: "Telefon stacjonarny + Poczta Polska",
        deadline: "Do 14 dni",
        templateChannel: "mail",
        description:
          "Klient odmówił formularza i posiada jedynie telefon stacjonarny — do 3 prób kontaktu, następnie potwierdzenie listem Pocztą Polską.",
        steps: [
          "Przyjmij wypowiedzenie mimo odmowy formularza.",
          "Wykonaj do 3 prób kontaktu telefonicznego w celu potwierdzenia.",
          "Jeśli kontakt nieskuteczny — wyślij potwierdzenie listem Pocztą Polską.",
          "Termin wysyłki pocztowej: do 14 dni od otrzymania.",
        ],
      },
      {
        id: "bok-nie-brak",
        title: "Odmówił formularza, brak danych elektronicznych",
        icon: "❌",
        colorClass: "card--orange",
        methodLabel: "List Pocztą Polską",
        deadline: "Do 14 dni",
        templateChannel: "mail",
        description:
          "Klient odmówił formularza i nie posiada żadnych danych kontaktowych elektronicznych — potwierdzenie wysyłane listem Pocztą Polską.",
        steps: [
          "Przyjmij wypowiedzenie mimo odmowy formularza.",
          "Przygotuj potwierdzenie otrzymania w formie pisemnej.",
          "Wyślij potwierdzenie listem za pośrednictwem Poczty Polskiej.",
          "Termin: do 14 dni od otrzymania.",
        ],
      },
    ],
  },
};

/**
 * Szablony wiadomości — klucze: zaleglosc, nadplata, zerwanie
 * Każdy posiada wariant: email, sms
 * Wariant „mail" (Poczta Polska) i „none" (BOK) nie mają szablonu elektronicznego.
 */
const MESSAGE_TEMPLATES = {
  zaleglosc: {
    label: "Zaległość na koncie",
    icon: "💰",
    email: `Dzień dobry,

informuję, że wypowiedzenie umowy zostało przyjęte na podstawie przesłanego dokumentu.

Data otrzymania wypowiedzenia: [DD.MM.RRRR]
Data rozwiązania umowy: [DD.MM.RRRR]
Umowa: [NR UMOWY], [USŁUGI]
Aktualne saldo na koncie: [KWOTA] zł (zaległość)

Przypominam o konieczności uregulowania zaległości oraz zwrotu dzierżawionych urządzeń w terminie 14 dni od zakończenia umowy na adres:
• Biuro Operatora — ul. Wspólna 1/o, 45-837 Opole
• BOK Knurów — ul. Szpitalna 8/101, 44-190 Knurów
lub za pośrednictwem Poczty Polskiej / kuriera.`,
    sms: `[GRUPA MULTIPLAY] Wypowiedzenie umowy przyjęte. Data otrzymania: [DD.MM.RRRR]. Rozwiązanie: [DD.MM.RRRR]. Umowa [NR UMOWY]. Saldo: [KWOTA] zł (zaległość). Prosimy o uregulowanie zaległości i zwrot urządzeń w ciągu 14 dni na adres: ul. Wspólna 1/o, 45-837 Opole lub BOK Knurów, ul. Szpitalna 8/101.`,
  },

  nadplata: {
    label: "Nadpłata na koncie",
    icon: "💸",
    email: `Dzień dobry,

informuję, że wypowiedzenie umowy zostało przyjęte na podstawie przesłanego dokumentu.

Data otrzymania wypowiedzenia: [DD.MM.RRRR]
Data rozwiązania umowy: [DD.MM.RRRR]
Umowa: [NR UMOWY], [USŁUGI]
Aktualne saldo na koncie: [KWOTA] zł (nadpłata)

W załączniku przesyłam formularz zwrotu nadpłaty. Proszę o jego wypełnienie i odesłanie w formie skanu na ten adres e-mail.

Przypominam o konieczności zwrotu dzierżawionych urządzeń w terminie 14 dni od zakończenia umowy na adres:
• Biuro Operatora — ul. Wspólna 1/o, 45-837 Opole
• BOK Knurów — ul. Szpitalna 8/101, 44-190 Knurów
lub za pośrednictwem Poczty Polskiej / kuriera.`,
    sms: `[GRUPA MULTIPLAY] Wypowiedzenie umowy przyjęte. Data otrzymania: [DD.MM.RRRR]. Rozwiązanie: [DD.MM.RRRR]. Umowa [NR UMOWY]. Saldo: [KWOTA] zł (nadpłata). Informacja o zwrocie nadpłaty zostanie wysłana osobną korespondencją. Prosimy o zwrot urządzeń w ciągu 14 dni na adres: ul. Wspólna 1/o, 45-837 Opole lub BOK Knurów, ul. Szpitalna 8/101.`,
  },

  zerwanie: {
    label: "Zerwanie umowy",
    icon: "⚠️",
    email: `Dzień dobry,

informuję, że wypowiedzenie umowy zostało przyjęte na podstawie przesłanego dokumentu.

Data otrzymania wypowiedzenia: [DD.MM.RRRR]
Data rozwiązania umowy: [DD.MM.RRRR]
Umowa: [NR UMOWY], [USŁUGI]
Aktualne saldo na koncie: [KWOTA] zł

Wypowiedzenie zostało zakwalifikowane jako przedterminowe rozwiązanie umowy. Operatorowi przysługuje roszczenie w wysokości pozostałych opłat abonamentowych, pomniejszonych proporcjonalnie o okres od zawarcia umowy do dnia jej rozwiązania.

Informuję o możliwości:
• cesji umowy — realizowanej w Biurze Obsługi Klienta,
• wycofania wypowiedzenia — przed datą rozwiązania umowy.

Przypominam o konieczności zwrotu dzierżawionych urządzeń w terminie 14 dni od zakończenia umowy na adres:
• Biuro Operatora — ul. Wspólna 1/o, 45-837 Opole
• BOK Knurów — ul. Szpitalna 8/101, 44-190 Knurów
lub za pośrednictwem Poczty Polskiej / kuriera.`,
    sms: `[GRUPA MULTIPLAY] Wypowiedzenie umowy przyjęte (przedterminowe rozwiązanie). Data otrzymania: [DD.MM.RRRR]. Rozwiązanie: [DD.MM.RRRR]. Umowa [NR UMOWY]. Saldo: [KWOTA] zł. Operatorowi przysługuje roszczenie. Możliwość cesji lub wycofania wypowiedzenia w BOK. Zwrot urządzeń w ciągu 14 dni: ul. Wspólna 1/o, 45-837 Opole lub BOK Knurów, ul. Szpitalna 8/101.`,
  },
};

/**
 * Komunikat wyświetlany gdy dla danej ścieżki nie ma szablonu elektronicznego.
 */
const NO_TEMPLATE_MESSAGES = {
  mail: "Dla tej ścieżki potwierdzenie wysyłane jest listem Pocztą Polską. Szablon wiadomości elektronicznej nie ma zastosowania — treść przygotowywana jest w formie pisemnej zgodnie z wewnętrzną procedurą.",
  none: "Klient otrzymuje kopię formularza bezpośrednio w BOK. Szablon wiadomości elektronicznej nie ma zastosowania.",
};
