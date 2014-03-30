#Socks4us webwinkel#

##Beschrijving##
Dit is de demo-applicatie geschreven voor mijn SDN presentatie van 28 maart 2014. Het is een puur statische html5-app met local storage, websockets, cache manifest and notifications. Serverside is een expermintele implementatie van micro services architectuur. 

Het doel van de applicatie is om aan te tonen dat het mogelijk is om de volledige applicatie-stack (ui, business layer, persistance) aan de clientside te implementeren.

##Browser compatibility##
Werkt in recente versies van Chrome, Safari en Firefox

##Gebruikte frameworks en libraries##
- AngularJS
- LocalForage
- ReconnectingWebSocket
- Bootstrap

##Benodigdheden##
- NodeJS (een recente versie)

##Installatie & start##
- Open een command shell en navigeer naar hoofdmap van dit project 
- Voer het commando 'npm install' uit, om alle vereisten te installeren
- Navigeer vervolgens naar de map "services"
- Start als eerste de registry service met het commando 'node registry-service.js'
- Start daarna, op vergelijkbare manier alle andere services, behalve service.js

De webapplicatie is nu beschikbaar op http://localhost:8080

##Contact##
Voor vragen en opmerkingen ben ik bereiken via: 
- E-mail: n.bergsma@gmail.com
