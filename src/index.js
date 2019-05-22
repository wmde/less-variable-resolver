const log = require( 'npmlog' ),
	TYPE_PROPERTY = 'property',
	TYPE_VARIABLE = 'variable',
	TYPE_IDENT = 'ident',
	TYPE_VALUE = 'value';

function getVariableDeclarations( tree ) {
	const references = {},
		values = {};

	tree.traverseByType( TYPE_PROPERTY, ( property, _index, declaration ) => {
		property.traverseByType( TYPE_VARIABLE, ( variable ) => {
			variable.traverseByType( TYPE_IDENT, ( ident ) => {
				const variableName = ident.content;
				declaration.traverseByType( TYPE_VALUE, ( value ) => {
					if ( value.content.length === 1 && value.content[ 0 ].is( TYPE_VARIABLE ) ) {
						const referenced = value.content[ 0 ].content[ 0 ].content;
						log.info( 'declaring reference for variable', variableName, '->', referenced );
						references[ variableName ] = referenced;
					} else {
						log.info( 'declaring value for variable', variableName );
						values[ variableName ] = value.content;
					}
				} );
			} );
		} );
	} );

	return {
		references,
		values
	};
}

function resolveVariable( name, variableDeclarations ) {
	const { references, values } = variableDeclarations;

	if ( references[ name ] !== undefined ) {
		return resolveVariable( references[ name ], variableDeclarations );
	} else if ( values[ name ] !== undefined ) {
		return values[ name ];
	}
	return null;
}

function resolveVariables( tree, variableDeclarations ) {
	tree.traverseByType( TYPE_VALUE, ( declarationValue ) => {
		declarationValue.traverse( ( variableAsDeclarationValue, valueIndex ) => {
			if ( !variableAsDeclarationValue.is( TYPE_VARIABLE ) ) {
				return;
			}

			variableAsDeclarationValue.traverseByType( TYPE_IDENT, ( ident ) => {
				const referencedVariable = ident.content,
					value = resolveVariable( referencedVariable, variableDeclarations );
				log.info( 'referencing variable ', referencedVariable );
				if ( !value ) {
					log.warn( 'referencing undefined variable', referencedVariable );
					return;
				}
				declarationValue.content.splice( valueIndex, 1, ...value );
			} );
		} );
	} );
}

module.exports = {
	log,
	resolveVariablesInTree: ( tree ) => {
		resolveVariables( tree, getVariableDeclarations( tree ) );
		return tree;
	}
};
