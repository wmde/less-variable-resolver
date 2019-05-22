const fs = require( 'fs' ),
	gonzales = require( 'gonzales-pe' ),
	lessVariableResolver = require( 'less-variable-resolver' ),
	fixtureFolder = __dirname + '/fixtures',
	fixtureEncoding = 'utf8';

lessVariableResolver.log.level = 'silent';

function getExpected( fixture ) {
	return fs.readFileSync( fixtureFolder + '/' + fixture + '/expected.less', fixtureEncoding );
}

function getGivenGonzalesTree( fixture ) {
	return gonzales.parse(
		fs.readFileSync( fixtureFolder + '/' + fixture + '/given.less', fixtureEncoding ),
		{ syntax: 'less' }
	);
}

describe( 'resolves variable declarations', () => {
	it.each( [
		[ 'multiple_var_in_one_value' ],
		[ 'simple_var_lookup' ],
		[ 'variable_declared_after_use' ],
		[ 'variable_referencing_two_variables' ],
		[ 'variable_referencing_variable_declared_after_use' ]
	] )(
		'%s',
		( fixture ) => {
			const lessTree = getGivenGonzalesTree( fixture );

			lessVariableResolver.resolveVariablesInTree( lessTree );

			expect( lessTree.toString() ).toBe( getExpected( fixture ) );
		}
	);
} );

describe( 'resolves things which are not considered a feature but a known side effect', () => {
	it.each( [
		[ 'variable_declaration_breaking_out_of_scope' ],
		[ 'variable_declared_inside_selector' ],
		[ 'variable_used_in_property' ],
		[ 'variable_used_in_property_declared_after_use' ]
	] )(
		'%s',
		( fixture ) => {
			const lessTree = getGivenGonzalesTree( fixture );

			lessVariableResolver.resolveVariablesInTree( lessTree );

			expect( lessTree.toString() ).toBe( getExpected( fixture ) );
		}
	);
} );
