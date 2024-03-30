# MTG Booster Generator

This is a small app for generating Magic: the Gathering boosters of various types using your collection of cards.

### Currently supported sources

- [Moxfield](https://www.moxfield.com)

## Run the app

You can use the app on [this GitHub page](https://mutisz.github.io/mtg-booster-generator/).

## Moxfield configuration instructions

Moxfield does not currently provide an easily accessible public API, so to fetch collection from Moxfield you need to extract the token from their website manually. Also CORS will need to be disabled so that browser does not block request from this app to Moxfield.
To fetch bearer token:

1.  Login to [Moxfield](https://www.moxfield.com),
2.  Open developer tools (F12) and navigate to network tab,
3.  On the website navigate to your collection page,
4.  In developer tools find GET request to search page and open it,
5.  In request details find _Authorization_ field in request headers,
6.  Copy value of this header without _Bearer_ prefix and any whitespace and paste it to credentials form

To disable CORS:

1. Install required browser extension
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere)
   - [Chrome](https://chromewebstore.google.com/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino?hl=en-US&utm_source=ext_sidebar)
2. Enable the extension before fetching the collection and disable it after
