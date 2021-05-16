const lodash = require( 'lodash' );

const isObject = variable => {
    return Object.prototype.toString.call(variable) === "[object Object]";
}

const floatEquals = ( float1, float2 ) => {    
    const baseInteger = 100_000_000;

    let rounded1 = Math.round( float1 * baseInteger );
    let rounded2 = Math.round( float2 * baseInteger );
    
    return rounded1 === rounded2;    
}

const arrayEquals = ( arr1, arr2 )=>{  
    let sameLength = arr1.length === arr2.length
    if(!sameLength)
        return false;
    
    return lodash.xor( arr1, arr2 ).length === 0;
}

const objectHasRightStructure = ( obj, expectedProperties )=>{
    if( !isObject( obj ))
        throw new TypeError( '"obj" argument must be of type "Object".' );

    if( !Array.isArray( expectedProperties ))
        throw new TypeError( '"expectedProperties" argument must be of type "Array".' );

    let properties = Object.keys( obj );
    return arrayEquals( properties, expectedProperties );
}

module.exports = {
    isObject,
    floatEquals,
    arrayEquals,
    objectHasRightStructure
}