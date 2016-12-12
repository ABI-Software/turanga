function convertGeometryIntoBufferGeometry(geometry)
{
	var arrayLength = geometry.faces.length * 3 * 3;
	var positions = new Float32Array( arrayLength );
	var normals = new Float32Array( arrayLength );
	var colors_first = new Float32Array( arrayLength );
	var colors_second = new Float32Array( arrayLength );
	var colors_third = new Float32Array( arrayLength );
	var colors1Map = geometry.morphColors[ 0 ];
	var colors2Map = geometry.morphColors[ 1 ];
	var colors3Map = geometry.morphColors[ 2 ];
	var bufferGeometry = new THREE.BufferGeometry();

	geometry.faces.forEach( function ( face, index ) {

		positions[ index * 9 + 0 ] = geometry.vertices[ face.a ].x;
		positions[ index * 9 + 1 ] = geometry.vertices[ face.a ].y;
		positions[ index * 9 + 2 ] = geometry.vertices[ face.a ].z;
		positions[ index * 9 + 3 ] = geometry.vertices[ face.b ].x;
		positions[ index * 9 + 4 ] = geometry.vertices[ face.b ].y;
		positions[ index * 9 + 5 ] = geometry.vertices[ face.b ].z;
		positions[ index * 9 + 6 ] = geometry.vertices[ face.c ].x;
		positions[ index * 9 + 7 ] = geometry.vertices[ face.c ].y;
		positions[ index * 9 + 8 ] = geometry.vertices[ face.c ].z;

		normals[ index * 9 + 0 ] = face.vertexNormals[0].x;
		normals[ index * 9 + 1 ] = face.vertexNormals[0].y;
		normals[ index * 9 + 2 ] = face.vertexNormals[0].z;
		normals[ index * 9 + 3 ] = face.vertexNormals[1].x;
		normals[ index * 9 + 4 ] = face.vertexNormals[1].y;
		normals[ index * 9 + 5 ] = face.vertexNormals[1].z;
		normals[ index * 9 + 6 ] = face.vertexNormals[2].x;
		normals[ index * 9 + 7 ] = face.vertexNormals[2].y;
		normals[ index * 9 + 8 ] = face.vertexNormals[2].z;


		var index_in_colors = Math.floor((face.a)/3);
		var remainder = (face.a)%3;
		var hex_value_one = 0;
		var hex_value_two = 0;
		var hex_value_three = 0;
		if (remainder == 0) {
			hex_value_one = colors1Map.colors[index_in_colors].r;
			hex_value_two = colors2Map.colors[index_in_colors].r;
			hex_value_three = colors3Map.colors[index_in_colors].r
		} else if (remainder == 1) {
			hex_value_one = colors1Map.colors[index_in_colors].g;
			hex_value_two = colors2Map.colors[index_in_colors].g;
			hex_value_three = colors3Map.colors[index_in_colors].g;
		} else if (remainder == 2) {
			hex_value_one = colors1Map.colors[index_in_colors].b;
			hex_value_two = colors2Map.colors[index_in_colors].b;
			hex_value_three = colors3Map.colors[index_in_colors].b;
		}
		var mycolor_one = new THREE.Color(hex_value_one);
		var mycolor_two = new THREE.Color(hex_value_two);
		var mycolor_three = new THREE.Color(hex_value_three);

		colors_first[ index * 9 + 0 ] = mycolor_one.r;
		colors_first[ index * 9 + 1 ] = mycolor_one.g;
		colors_first[ index * 9 + 2 ] = mycolor_one.b;
		colors_second[ index * 9 + 0 ] = mycolor_two.r;
		colors_second[ index * 9 + 1 ] = mycolor_two.g;
		colors_second[ index * 9 + 2 ] = mycolor_two.b;
		colors_third[ index * 9 + 0 ] = mycolor_three.r;
		colors_third[ index * 9 + 1 ] = mycolor_three.g;
		colors_third[ index * 9 + 2 ] = mycolor_three.b;


		index_in_colors = Math.floor((face.b)/3);
		remainder = (face.b)%3;
		if (remainder == 0) {
			hex_value_one = colors1Map.colors[index_in_colors].r;
			hex_value_two = colors2Map.colors[index_in_colors].r;
			hex_value_three = colors3Map.colors[index_in_colors].r;
		} else if (remainder == 1) {
			hex_value_one = colors1Map.colors[index_in_colors].g;
			hex_value_two = colors2Map.colors[index_in_colors].g;
			hex_value_three = colors3Map.colors[index_in_colors].g;
		} else if (remainder == 2) {
			hex_value_one = colors1Map.colors[index_in_colors].b;
			hex_value_two = colors2Map.colors[index_in_colors].b;
			hex_value_three = colors3Map.colors[index_in_colors].b;
		}

		mycolor_one = new THREE.Color(hex_value_one);
		mycolor_two = new THREE.Color(hex_value_two);
		mycolor_three = new THREE.Color(hex_value_three);
		colors_first[ index * 9 + 3 ] = mycolor_one.r;
		colors_first[ index * 9 + 4 ] = mycolor_one.g;
		colors_first[ index * 9 + 5 ] = mycolor_one.b;
		colors_second[ index * 9 + 3 ] = mycolor_two.r;
		colors_second[ index * 9 + 4 ] = mycolor_two.g;
		colors_second[ index * 9 + 5 ] = mycolor_two.b;
		colors_third[ index * 9 + 3 ] = mycolor_three.r;
		colors_third[ index * 9 + 4 ] = mycolor_three.g;
		colors_third[ index * 9 + 5 ] = mycolor_three.b;

		index_in_colors = Math.floor((face.c)/3);
		remainder = (face.c)%3;
		if (remainder == 0) {
			hex_value_one = colors1Map.colors[index_in_colors].r;
			hex_value_two = colors2Map.colors[index_in_colors].r;
			hex_value_three = colors3Map.colors[index_in_colors].r;
		} else if (remainder == 1) {
			hex_value_one = colors1Map.colors[index_in_colors].g;
			hex_value_two = colors2Map.colors[index_in_colors].g;
			hex_value_three = colors3Map.colors[index_in_colors].g;
		} else if (remainder == 2) {
			hex_value_one = colors1Map.colors[index_in_colors].b;
			hex_value_two = colors2Map.colors[index_in_colors].b;
			hex_value_three = colors3Map.colors[index_in_colors].b;
		}
		mycolor_one = new THREE.Color(hex_value_one);
		mycolor_two = new THREE.Color(hex_value_two);
		mycolor_three = new THREE.Color(hex_value_three);
		colors_first[ index * 9 + 6 ] = mycolor_one.r;
		colors_first[ index * 9 + 7 ] = mycolor_one.g;
		colors_first[ index * 9 + 8 ] = mycolor_one.b;
		colors_second[ index * 9 + 6 ] = mycolor_two.r;
		colors_second[ index * 9 + 7 ] = mycolor_two.g;
		colors_second[ index * 9 + 8 ] = mycolor_two.b;
		colors_third[ index * 9 + 6 ] = mycolor_three.r;
		colors_third[ index * 9 + 7 ] = mycolor_three.g;
		colors_third[ index * 9 + 8 ] = mycolor_three.b;

	} );
	bufferGeometry.addAttribute( "position", new THREE.BufferAttribute(positions, 3));
	bufferGeometry.addAttribute( "normal", new THREE.BufferAttribute(normals, 3));
	bufferGeometry.addAttribute( "color_one", new THREE.BufferAttribute(colors_first, 3));
	bufferGeometry.addAttribute( "color_two", new THREE.BufferAttribute(colors_second, 3));
	bufferGeometry.addAttribute( "color_three", new THREE.BufferAttribute(colors_third, 3));

	return bufferGeometry;
}

function myLoader(finishCallback) {
	return function(geometry, materials){
		var material = undefined;
		if (materials && materials[0]) {
			material = materials[0];
		}
		bufferGeometry = convertGeometryIntoBufferGeometry(geometry,finishCallback);
		if (finishCallback != undefined && (typeof finishCallback == 'function')) {
			finishCallback(bufferGeometry);
		}
	}
}

function loadURLsIntoBufferGeometry(url, finishCallback, progressCallback, errorCallback)
{
	var loader = new THREE.JSONLoader( true );
	var colour = Zinc.defaultMaterialColor;
	loader.load( url, myLoader(finishCallback), progressCallback, errorCallback);
}
