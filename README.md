[![Build Status](https://travis-ci.org/codeenigma/jsonpopulate.svg?branch=master)]
# jsonPopulate

A PHP tool to populate JSON data from existing web pages.

## Requirements

jsonPopulate requires php 7.0 or greater.

## Install

Clone and install dependencies with composer, by running:

```composer install```

## Setup

### Server

Simplest is to use php built in server:

```cd www && php -S localhost:8000```

or, if inside a VM of some kind, use the appropriate IP, eg for ce-vm:

```cd /vagrant/www && php -S 192.168.56.4:8000```

If in doubt or having issues, you can use the 0.0.0.0 IP to listen on all addresses. This means it potentially is accessible by others on the same network, so can be a security issue.

```cd /vagrant/www && php -S 0.0.0.0:8000```

### Configuration

Create a jsonpopulate.yml file somewhere in a parent folder of the jsonpopulate codebase.
Look at the example folder for how the syntax look like, it basically consists in pairing
"source" json files with "url" targets.

#### Note 1: The config file can be directly within any parent directory of the main jsonpopulate codebase

Eg, provided jsonpopulate is at

```~/Projects/examples/prototype/tools/jsonpopulate```

Your config file can be at any of these locations:

```~/Projects/examples/prototype/tools/jsonpopulate.yml```

```~/Projects/examples/prototype/jsonpopulate.yml```

```~/Projects/examples/jsonpopulate.yml```

```~/Projects/jsonpopulate.yml```

```...```

but can NOT be at eg:

```~/Projects/examples/prototype/config/jsonpopulate.yml```

#### Note 2: Paths to the sources files are relative to the config file

Using the same example as above, given a config file at

```~/Projects/examples/prototype/jsonpopulate.yml```

and a json file at

```~/Projects/examples/prototype/pattern-lab/source/data.json```

the "source" for that file in your jsonpopulate would be "pattern-lab/source/data.json"

## Usage

### Loading

Visit [http://localhost:8000](http://localhost:8000).
You should be presented with:
- a list of available pages at the top
- a dual pane window with:
  - the JSON values as text field on the left
  - the matching URL loaded as a fake iframe on the right

### Setting values

Start by clicking on a supported element (links, images, ...) on the visited url on the right.
Then click on the json value you want to fill/override: you should be presented with a dropdown of possible variants derived from the previously clicked element.

### Navigating

To make it easier to find the elements you want, the "iframe" also allows you to navigate further between inner pages. To bypass the click hijack and actually follow a link, hold the "Alt" key while you click.

## Known issues

- Due to cross-domain/CORS restrictions, iframe "escaping" scripts, bot detections measures and so on, the rendering of the the source url may vary greatly. Some domains (typically behind Sucuri or similar) will enterly fail to load, some will only miss a few fonts, while others will be mildly affected by partial execution of some Javascript parts.
- Look and feel could do with some love, so does the UX in general.
- "Panes" resizing does not work on FF.
- Only a few elements (a, img, p, span, submit) are currently supported.
- Not much attention has been given to failures, and expect exceptions to be throwned if something fails !
- Probably a tons of other unknowns bugs and issues.

## Security

This is intended for local dev usage. Never make this accessible over http on a public server. NEVER.