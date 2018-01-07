Udacity Neighborhood Map - Palermo Cultural
===========================================

The purpose of this project is create a SPA(Single Page Application) from a specific neighborhood that shows interesting spots using Google Maps Api and 3rd party APIs.

I make a cultural project where shows venues related to arts, music, museums, dance classes, bookstores, theaters and more in Palermo Neighborhood in Bogotá, Colombia.

![alt palermocultural](https://github.com/claudiainbytes/palermo-neighborhood-map/blob/master/about/screenshot.png)

## SPA Features

Libraries

- Knockout.JS as MVVM framework to organize the code
- jQuery for DOM manipulation
- Bootstrap 3.3.6 as CSS Framework
- Perfect-scrollbar to scroll in the locations nav list
- Slick.JS to slide info in each infoWindow

APIs

- Google Maps API
- Google StreetView Image API
- Firebase database to store JSON data

Google APIs requires a project name and a key to access several web services.

## Demo

If you want to play this project, click here: [Palermo Cultural ](https://claudiainbytes.github.io/palermo-neighborhood-map/src)

## Funcionality

This application does:

- Loads a map of a specific area according to lat and long coordinates
- For each location show markers

- Clicking on each marker, shows a infoWindow

![alt infowindow](https://github.com/claudiainbytes/palermo-neighborhood-map/blob/master/about/screenshot1.png)

- Shows a list of locations on the left nav bar
- Clicking in a list element, shows the venue infoWindow

![alt locations](https://github.com/claudiainbytes/palermo-neighborhood-map/blob/master/about/screenshot2.png)

- Watching the street nearest to the location using Google Street View

![alt streetview](https://github.com/claudiainbytes/palermo-neighborhood-map/blob/master/about/screenshot3.png)

- Filter locations by title of location

![alt locations](https://github.com/claudiainbytes/palermo-neighborhood-map/blob/master/about/screenshot3.png)




## How to install

Clone this project in your local machine, go into the folder, and open index.html in a browser to play:
```
  git clone https://github.com/claudiainbytes/palermo-neighborhood-map

```

1. Check out the repository
1. To inspect the site on your phone, you can run a local server

For src folder (no-optimized site/in process to be optimized):

  ```bash
  $> cd /path/to/palermo-neighborhood-map/src
  $> python -m SimpleHTTPServer 8080
  ```

For dist folder( optimized site):

  ```bash
  $> cd /path/to/palermo-neighborhood-map/dist
  $> python -m SimpleHTTPServer 3000
  ```

1. Open a browser and visit localhost:8080
2. Download and install [ngrok](https://ngrok.com/) to the top-level of your project directory to make your local server accessible remotely.

For src folder (no-optimized site/in process to be optimized):
  ```bash
  $> cd /path/to/palermo-neighborhood-map/src
  $> ./ngrok http 8080
  ```

For dist folder( optimized site):

  ```bash
  $> cd /path/to/palermo-neighborhood-map/dist
  $> ./ngrok http 3000
  ```