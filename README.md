# less-variable-resolver

Resolve variables defined by other variables' values - to allow for 
conversion into languages not supporting [lazy evaluation](http://lesscss.org/features/#variables-feature-lazy-evaluation).

## Usage example

```sh
const gonzales = require( 'gonzales-pe' ),
	lessVariableResolver = require( 'less-variable-resolver' ),
	sast = require( 'sast' ),

// build AST from less
const lessTree = gonzales.parse(
		fs.readFileSync( '_my_variables.less', 'utf8' ),
		{ syntax: 'less' },
	);

// resolve variables
lessVariableResolver.resolveVariablesInTree( lessTree );

// convert less to scss
const scssTree = sast.parse( lessTree.toString(), { syntax: 'less' } );

console.log( sast.stringify( scssTree ) ); // SCSS variables
```

## Development

### Building Docker image

```sh
# ensure the node user uses your user id, so you own generated files
docker-compose build --build-arg UID=$(id -u) --build-arg GID=$(id -g) node
```

### Installation

```sh
docker-compose run --rm node npm install
```

### Running code quality tools

```sh
docker-compose run --rm node npm test
```
