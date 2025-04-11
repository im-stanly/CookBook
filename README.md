# CookBook
Idea aplikacji - umożliwić użytkownikom wprowadzenie składników do aplikacji i wyszukanie przepisów, które można z nich przyrządzić.
-Listę z góry zadanych przepisów trzymamy w bazie danych
-Możliwość zostawiania polubień i dislików pod przepisem, jeden użytkownik = maksymalnie 1 reakcja na dany przepis.
-Składniki mają swoje "nadskładniki", relacja typu mąka - mąka pszenna.
-Możliwość aproksymacji kalori poprzez policzenie sumy kalori składników, składniki 'nieprecyzyjne' typu mąka czy jogurt dostaną wartość średnią .
-Kalorie mierzone są na 100 gram, ponieważ każdy składnik można trywialnie zważyć.
-Każdy składnik ma różne swoje miary, typu szklanka, litr, gram, itp. W bazie trzymamy możliwe konwersje pomiędzy nimi.
-Ilość składnika podaje się w zakresie (np. 3/4-1 litr). Jeżeli nie ma zakresu to wartość końca zakresu jest pusta.
-Trzymamy w bazie dania, gdzie do jednego dania można przypisać wiele przepisów.
-Przepisy, na które użytkownik zareagował może on później otworzyć w aplikacji i przeglądać.
-Do oglądania przepisów stosujemy paging.
-Wyświetlany jest opis przepisu wprost z pliku csv, z którego je bierzemy.
-Przepisy nie muszą mieć ani unikalnej nazwy, ani unikalnej treści.
-Jest tylko jeden rodzaj użytkownika.
-Legalne jednostki dla składnika to takie, które występują w przepisach.
